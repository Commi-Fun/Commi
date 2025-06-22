import axios, { AxiosError, AxiosResponse } from 'axios';
import { XUserTweet, XUser } from './x_type';

interface XUserRequest {
  userId: string;
  communityId: string;
  cursor: string;
  ticker: string;
  startTime: Date;
}

interface XUserTweetResponse {
  tweets: XUserTweet[];
  bottomCursor: string;
}


// Use a more flexible approach since Twitter API responses are complex and vary
type TwitterApiResponse = Record<string, any>;

// Simplified types for complex nested structures
type TwitterMediaItem = Record<string, any>;
type TwitterSymbol = Record<string, any>;

class XUsersError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public cause?: Error
  ) {
    super(message);
    this.name = 'XUsersError';
  }

  static fromAxiosError(error: AxiosError, context: string): XUsersError {
    const message = `${context}: ${error.message}`;
    const statusCode = error.response?.status;
    return new XUsersError(message, 'API_ERROR', statusCode, error);
  }

  static validation(message: string): XUsersError {
    return new XUsersError(message, 'VALIDATION_ERROR');
  }

  static parsing(message: string, cause?: Error): XUsersError {
    return new XUsersError(message, 'PARSING_ERROR', undefined, cause);
  }
}

const API_CONFIG = {
  baseURL: 'https://twitter241.p.rapidapi.com',
  headers: {
    'Content-Type': 'application/json',
    // TODO: Move API key to environment variable for production security
    'x-rapidapi-key': process.env.RAPIDAPI_KEY || '52064c46e2mshca87ab34d1303f9p13bd1ajsn9fe385862abf',
    'x-rapidapi-host': 'twitter241.p.rapidapi.com'
  },
  timeout: 30000 // 30 second timeout to prevent hanging requests
};

const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
const MAX_RETRIES = 3;        // Retry failed requests up to 3 times
const RETRY_DELAY = 2000;     // 2 second base delay for exponential backoff

function validateUserId(userId: string): void {
  // Check for null, undefined, non-string, or empty values
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw XUsersError.validation('User ID must be a non-empty string');
  }
}

function validateUsername(username: string): void {
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    throw XUsersError.validation('Username must be a non-empty string');
  }
  // Twitter usernames have a 15 character limit
  if (username.length > 15) {
    throw XUsersError.validation('Username cannot exceed 15 characters');
  }
}

function validateTicker(ticker: string): void {
  if (!ticker || typeof ticker !== 'string' || ticker.trim().length === 0) {
    throw XUsersError.validation('Ticker must be a non-empty string');
  }
}

function validateDate(date: Date): void {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw XUsersError.validation('Start time must be a valid Date object');
  }
}

function sanitizeString(str: string | undefined): string {
  return (str || '').trim();
}

function sanitizeNumber(num: number | undefined): number {
  return typeof num === 'number' && !isNaN(num) ? num : 0;
}

function safeGet(obj: any, path: string, defaultValue: any = undefined): any {
  try {
    // Split 'user.profile.name' into ['user', 'profile', 'name'] and traverse
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    // Return default if any part of traversal fails
    return defaultValue;
  }
}

function validateApiResponseStructure(data: TwitterApiResponse, expectedPaths: string[], context: string): void {
  const missingPaths = expectedPaths.filter(path => safeGet(data, path) === undefined);
  if (missingPaths.length > 0) {
    throw XUsersError.parsing(`Missing expected fields in ${context}: ${missingPaths.join(', ')}`);
  }
}

function safeGetArray(obj: any, path: string): any[] {
  const result = safeGet(obj, path);
  return Array.isArray(result) ? result : [];
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeApiRequest(
  url: string,
  params: Record<string, any>,
  context: string,
  retries = MAX_RETRIES
): Promise<TwitterApiResponse> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await delay(RATE_LIMIT_DELAY);
      
      const response: AxiosResponse<TwitterApiResponse> = await axios.get(url, {
        ...API_CONFIG,
        params
      });

      if (response.status !== 200) {
        throw new XUsersError(
          `HTTP ${response.status}: ${response.statusText}`,
          'HTTP_ERROR',
          response.status
        );
      }

      // Validate that we received a valid response object
      if (!response.data || typeof response.data !== 'object') {
        throw new XUsersError(
          `Invalid API response format from ${context}`,
          'PARSING_ERROR'
        );
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const isRetryable = !error.response || 
          error.response.status >= 500 || 
          error.response.status === 429;
        
        if (attempt < retries && isRetryable) {
          console.warn(`${context} attempt ${attempt} failed, retrying in ${RETRY_DELAY}ms:`, error.message);
          await delay(RETRY_DELAY * attempt);
          continue;
        }
        
        throw XUsersError.fromAxiosError(error, context);
      }
      throw error;
    }
  }
  
  throw new XUsersError(`Max retries (${retries}) exceeded for ${context}`);
}

function parseTwitterDate(dateString: string | undefined): Date {
  if (!dateString) {
    throw XUsersError.parsing('Invalid date string provided');
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw XUsersError.parsing(`Unable to parse date: ${dateString}`);
  }
  
  return date;
}

function extractMediaUrls(media: any): string[] {
  const mediaArray = Array.isArray(media) ? media : []; // Ensure we have an array
  const validUrls: string[] = [];
  
  for (const item of mediaArray) {
    try {
      const type = safeGet(item, 'type');
      const url = safeGet(item, 'media_url_https');
      
      // Filter: only photos (not videos/GIFs) with valid HTTPS URLs
      if (type === 'photo' && typeof url === 'string' && isValidHttpsUrl(url)) {
        validUrls.push(url);
      }
    } catch (error) {
      // Skip malformed media items without logging spam
      continue;
    }
  }
  
  return validUrls;
}

function isValidHttpsUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function hasTickerSymbol(symbols: any, ticker: string): boolean {
  const symbolsArray = Array.isArray(symbols) ? symbols : [];
  
  if (symbolsArray.length === 0 || !ticker) {
    return false;
  }
  
  const normalizedTicker = ticker.toLowerCase().trim();
  
  for (const symbol of symbolsArray) {
    try {
      const symbolText = safeGet(symbol, 'text');
      if (typeof symbolText === 'string') {
        const normalizedSymbolText = symbolText.toLowerCase().trim();
        // Handle both $SYMBOL and SYMBOL formats
        const cleanSymbolText = normalizedSymbolText.startsWith('$') 
          ? normalizedSymbolText.substring(1) 
          : normalizedSymbolText;
        const cleanTicker = normalizedTicker.startsWith('$') 
          ? normalizedTicker.substring(1) 
          : normalizedTicker;
          
        if (cleanSymbolText === cleanTicker) {
          return true;
        }
      }
    } catch (error) {
      // Skip invalid symbol items - don't log to avoid spam
      continue;
    }
  }
  
  return false;
}

function parseTweetFromEntry(entry: any, communityId: string): XUserTweet {
  const tweetData = safeGet(entry, 'content.itemContent.tweet_results.result');
  const legacy = safeGet(tweetData, 'legacy');
  
  if (!legacy) {
    throw XUsersError.parsing('Invalid tweet entry structure - missing legacy data');
  }

  try {
    const createdAt = parseTwitterDate(safeGet(legacy, 'created_at'));
    const media = extractMediaUrls(safeGet(legacy, 'extended_entities.media'));
    const inCommunity = safeGet(tweetData, 'tweet.community_results.id_str') === communityId;

    return {
      id: sanitizeString(safeGet(legacy, 'id_str')),
      content: sanitizeString(safeGet(legacy, 'full_text')),
      views: sanitizeNumber(safeGet(tweetData, 'views.count')),
      likes: sanitizeNumber(safeGet(legacy, 'favorite_count')),
      reposts: sanitizeNumber(safeGet(legacy, 'retweet_count')),
      quotes: sanitizeNumber(safeGet(legacy, 'quote_count')),
      replies: sanitizeNumber(safeGet(legacy, 'reply_count')),
      media,
      inCommunity,
      createdAt
    };
  } catch (error) {
    throw XUsersError.parsing(`Failed to parse tweet entry: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
  }
}



async function fetchUserTweets({ userId, cursor, communityId, ticker, startTime }: XUserRequest): Promise<XUserTweetResponse> {
  // Input validation - fail fast if parameters are invalid
  validateUserId(userId);
  validateTicker(ticker);
  validateDate(startTime);

  const data = await makeApiRequest(
    `${API_CONFIG.baseURL}/user-tweets`,
    {
      user: userId,
      count: 20,                    // Twitter API limit: max 20 tweets per request
      cursor: cursor || undefined   // For pagination: empty cursor = first page
    },
    `Fetching tweets for user ${userId}`
  );

  // Twitter API returns complex nested structure with "instructions"
  const instructions = safeGetArray(data, 'result.timeline.instructions');
  if (instructions.length === 0) {
    throw XUsersError.parsing(`No timeline instructions found for user ${userId} tweets`);
  }

  // Look for different instruction types in the response
  const pinnedInstructions = instructions.find(instruction => instruction.type === 'TimelinePinEntry');    // Pinned tweet
  const tweetsInstruction = instructions.find(instruction => instruction.type === 'TimelineAddEntries');   // Regular tweets

  if (!pinnedInstructions && !tweetsInstruction) {
    throw XUsersError.parsing(`No valid instructions found for user ${userId} tweets`);
  }

  const tweets: XUserTweet[] = [];
  let bottomCursor = '';  // For pagination

  // Handle pinned tweet separately (different structure than regular tweets)
  if (pinnedInstructions?.entry) {
    try {
      const pinnedTweet = parsePinnedTweet(pinnedInstructions.entry, communityId, ticker, startTime);
      if (pinnedTweet) {
        tweets.push(pinnedTweet);  // Add to results if it matches our filters
      }
    } catch (error) {
      // Log warning but don't fail - pinned tweet is optional
      console.warn(`Failed to parse pinned tweet for user ${userId}:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Process regular tweets (main content)
  if (tweetsInstruction?.entries) {
    const filteredTweets = filterAndParseTweets(tweetsInstruction.entries, communityId, ticker, startTime);
    tweets.push(...filteredTweets);  // Spread operator to add all filtered tweets
  }

  // Only set pagination cursor if we actually found valid tweets
  // (prevents infinite loops when all tweets are filtered out)
  if (tweets.length > 0) {
    bottomCursor = sanitizeString(safeGet(data, 'cursor.bottom'));
  }

  return {
    tweets,
    bottomCursor  // Empty string means no more pages
  };
}

function parsePinnedTweet(
  pinnedEntry: any,
  communityId: string,
  ticker: string,
  startTime: Date
): XUserTweet | null {
  const tweetData = safeGet(pinnedEntry, 'content.itemContent.tweet_results.result');
  const legacy = safeGet(tweetData, 'legacy');
  
  if (!legacy) {
    return null;
  }

  try {
    const createdAt = parseTwitterDate(safeGet(legacy, 'created_at'));
    const symbols = safeGet(legacy, 'entities.symbols', []);
    
    if (createdAt >= startTime && hasTickerSymbol(symbols, ticker)) {
      return parseTweetFromEntry({ content: { itemContent: { tweet_results: { result: tweetData } } } }, communityId);
    }
  } catch (error) {
    console.warn('Failed to parse pinned tweet:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  return null;
}

function filterAndParseTweets(
  entries: any,
  communityId: string,
  ticker: string,
  startTime: Date
): XUserTweet[] {
  const entriesArray = Array.isArray(entries) ? entries : [];
  const validTweets: XUserTweet[] = [];
  
  for (const entry of entriesArray) {
    try {
      if (isValidTweetEntry(entry, ticker, startTime)) {
        const tweet = parseTweetFromEntry(entry, communityId);
        validTweets.push(tweet);
      }
    } catch (error) {
      // Skip invalid entries - don't log to avoid spam
      continue;
    }
  }
  
  return validTweets;
}

function isValidTweetEntry(entry: any, ticker: string, startTime: Date): boolean {
  const tweetData = safeGet(entry, 'content.itemContent.tweet_results.result');
  const legacy = safeGet(tweetData, 'legacy');
  
  if (!legacy || !safeGet(entry, 'content.itemContent')) {
    return false;
  }

  if (safeGet(legacy, 'retweeted_status_id_str')) {
    return false;
  }

  try {
    const createdAt = parseTwitterDate(safeGet(legacy, 'created_at'));
    if (createdAt < startTime) {
      return false;
    }
  } catch {
    return false;
  }

  const symbols = safeGet(legacy, 'entities.symbols', []);
  return hasTickerSymbol(symbols, ticker);
}

async function fetchUserId(username: string): Promise<string> {
  validateUsername(username);
  
  const sanitizedUsername = username.trim().replace(/^@/, '');
  
  const data = await makeApiRequest(
    `${API_CONFIG.baseURL}/user-id`,
    { username: sanitizedUsername },
    `Fetching user ID for username ${sanitizedUsername}`
  );

  const userId = safeGet(data, 'result.data.user.result.rest_id');
  if (!userId || typeof userId !== 'string') {
    throw XUsersError.parsing(`User ID not found for username: ${sanitizedUsername}`);
  }

  return sanitizeString(userId);
}

async function fetchUserInformation(userId: string): Promise<XUser> {
  validateUserId(userId);
  
  const data = await makeApiRequest(
    `${API_CONFIG.baseURL}/get-users-v2`,
    { users: userId },
    `Fetching information for user ${userId}`
  );

  const users = safeGetArray(data, 'result.data.users');
  if (users.length === 0) {
    throw XUsersError.parsing(`User information not found for ID: ${userId}`);
  }

  const user = users[0];
  const userResult = safeGet(user, 'result');
  const legacy = safeGet(userResult, 'legacy');
  
  if (!userResult || !legacy) {
    throw XUsersError.parsing(`Invalid user data structure for ID: ${userId}`);
  }

  return {
    id: sanitizeString(safeGet(userResult, 'rest_id')),
    name: sanitizeString(safeGet(legacy, 'name')),
    verified: Boolean(safeGet(data, 'result.data.user.result.is_blue_verified')),
    followers: sanitizeNumber(safeGet(legacy, 'followers_count')),
    likes: sanitizeNumber(safeGet(legacy, 'favourites_count')),
    tweets: []
  };
}

export async function fetchUser({ userId, communityId, ticker, startTime }: XUserRequest): Promise<XUser | undefined> {
  try {
    validateUserId(userId);
    validateTicker(ticker);
    validateDate(startTime);
    
    if (!communityId || typeof communityId !== 'string') {
      throw XUsersError.validation('Community ID must be a non-empty string');
    }

    const userInformation = await fetchUserInformation(userId);
    let cursor = '';
    const maxPages = 50;
    let pageCount = 0;

    do {
      const userTweets = await fetchUserTweets({ 
        userId, 
        cursor, 
        communityId, 
        ticker, 
        startTime 
      });
      
      userInformation.tweets.push(...userTweets.tweets);
      cursor = userTweets.bottomCursor;
      pageCount++;
      
      if (pageCount >= maxPages) {
        console.warn(`Reached maximum page limit (${maxPages}) for user ${userId}`);
        break;
      }
    } while (cursor);

    return userInformation;
  } catch (error) {
    if (error instanceof XUsersError) {
      console.error(`XUsersError fetching user ${userId}:`, {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      });
    } else {
      console.error(`Unexpected error fetching user ${userId}:`, error);
    }
    return undefined;
  }
}

export async function fetchUserByUsername(username: string, communityId: string, ticker: string, startTime: Date): Promise<XUser | undefined> {
  try {
    const userId = await fetchUserId(username);
    return await fetchUser({ userId, communityId, cursor: '', ticker, startTime });
  } catch (error) {
    if (error instanceof XUsersError) {
      console.error(`XUsersError fetching user by username ${username}:`, {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      });
    } else {
      console.error(`Unexpected error fetching user by username ${username}:`, error);
    }
    return undefined;
  }
}

// Export error class and validation functions for external use
export { XUsersError, validateUserId, validateUsername, validateTicker, validateDate };