import axios, { AxiosError, AxiosResponse } from 'axios';
import { XUserTweet, XUser, TickerFilter, safeGet, safeGetArray } from '@commi-dashboard/common';

interface XUserRequest {
  userId: string;
  cursor: string;
  communityId?: string;
  filters: TickerFilter[];
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

function validateFilters(filters: TickerFilter[]): void {
  if (!Array.isArray(filters) || filters.length === 0) {
    throw XUsersError.validation('At least one ticker filter is required');
  }
  for (const f of filters) {
    if (!Array.isArray(f.symbols) || f.symbols.length === 0) {
      throw XUsersError.validation('Each filter must include at least one ticker symbol');
    }
    if (f.startDate && (!(f.startDate instanceof Date) || isNaN(f.startDate.getTime()))) {
      throw XUsersError.validation('Filter startDate must be a valid Date if provided');
    }
    if (f.endDate && (!(f.endDate instanceof Date) || isNaN(f.endDate.getTime()))) {
      throw XUsersError.validation('Filter endDate must be a valid Date if provided');
    }
  }
}

function sanitizeString(str: string | undefined): string {
  return (str || '').trim();
}

function sanitizeNumber(num: number | undefined): number {
  return typeof num === 'number' && !isNaN(num) ? num : 0;
}

function validateApiResponseStructure(data: TwitterApiResponse, expectedPaths: string[], context: string): void {
  const missingPaths = expectedPaths.filter(path => safeGet(data, path) === undefined);
  if (missingPaths.length > 0) {
    throw XUsersError.parsing(`Missing expected fields in ${context}: ${missingPaths.join(', ')}`);
  }
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

function hasAnyTickerSymbol(symbols: any, tickers: string[]): boolean {
  for (const t of tickers) {
    if (hasTickerSymbol(symbols, t)) return true;
  }
  return false;
}

function parseTweetFromEntry(entry: any, communityId?: string): XUserTweet {
  const tweetData = safeGet(entry, 'content.itemContent.tweet_results.result');
  const legacy = safeGet(tweetData, 'legacy');
  
  if (!legacy) {
    throw XUsersError.parsing('Invalid tweet entry structure - missing legacy data');
  }

  try {
    const createdAt = parseTwitterDate(safeGet(legacy, 'created_at') as string);
    const media = extractMediaUrls(safeGet(legacy, 'extended_entities.media'));
    const inCommunity = safeGet(tweetData, 'tweet.community_results.id_str') === communityId;
    const symbols = safeGet(legacy, 'entities.symbols', [])

    return {
      id: sanitizeString(safeGet(legacy, 'id_str') as string),
      content: sanitizeString(safeGet(legacy, 'full_text') as string),
      views: sanitizeNumber(safeGet(tweetData, 'views.count') as number),
      likes: sanitizeNumber(safeGet(legacy, 'favorite_count') as number),
      reposts: sanitizeNumber(safeGet(legacy, 'retweet_count') as number),
      quotes: sanitizeNumber(safeGet(legacy, 'quote_count') as number),
      replies: sanitizeNumber(safeGet(legacy, 'reply_count') as number),
      symbol: Array.isArray(symbols) ? symbols : [],
      media,
      inCommunity,
      createdAt
    };
  } catch (error) {
    throw XUsersError.parsing(`Failed to parse tweet entry: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
  }
}



export async function fetchUserTweets({ userId, cursor, communityId, filters }: XUserRequest): Promise<XUserTweetResponse> {
  // Input validation - fail fast if parameters are invalid
  validateUserId(userId);
  validateFilters(filters);

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
  const pinnedInstructions = instructions.find((instruction: any) => instruction.type === 'TimelinePinEntry');    // Pinned tweet
  const tweetsInstruction = instructions.find((instruction: any) => instruction.type === 'TimelineAddEntries');   // Regular tweets

  if (!pinnedInstructions && !tweetsInstruction) {
    throw XUsersError.parsing(`No valid instructions found for user ${userId} tweets`);
  }

  const tweets: XUserTweet[] = [];
  let bottomCursor = '';  // For pagination

  // Handle pinned tweet separately (different structure than regular tweets)
  if ((pinnedInstructions as any)?.entry) {
    try {
      const pinnedTweet = parsePinnedTweet((pinnedInstructions as any).entry, communityId, filters);
      if (pinnedTweet) {
        tweets.push(pinnedTweet);  // Add to results if it matches our filters
      }
    } catch (error) {
      // Log warning but don't fail - pinned tweet is optional
      console.warn(`Failed to parse pinned tweet for user ${userId}:`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Process regular tweets (main content)
  if ((tweetsInstruction as any)?.entries) {
    const filteredTweets = filterAndParseTweets((tweetsInstruction as any).entries, communityId, filters);
    tweets.push(...filteredTweets);  // Spread operator to add all filtered tweets
  }

  // Only set pagination cursor if we actually found valid tweets
  // (prevents infinite loops when all tweets are filtered out)
  if (tweets.length > 0) {
    bottomCursor = sanitizeString(safeGet(data, 'cursor.bottom') as string);
  }

  return {
    tweets,
    bottomCursor  // Empty string means no more pages
  };
}

function parsePinnedTweet(
  pinnedEntry: any,
  communityId: string | undefined,
  filters: TickerFilter[]
): XUserTweet | null {
  const tweetData = safeGet(pinnedEntry, 'content.itemContent.tweet_results.result');
  const legacy = safeGet(tweetData, 'legacy');
  
  if (!legacy) {
    return null;
  }

  try {
    const createdAt = parseTwitterDate(safeGet(legacy, 'created_at') as string);
    const symbols = safeGet(legacy, 'entities.symbols', []);
    
    if (matchesAnyFilter(createdAt, symbols, filters)) {
      return parseTweetFromEntry({ content: { itemContent: { tweet_results: { result: tweetData } } } }, communityId);
    }
  } catch (error) {
    console.warn('Failed to parse pinned tweet:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  return null;
}

function matchesAnyFilter(createdAt: Date, symbols: any, filters: TickerFilter[]): boolean {
  for (const f of filters) {
    const start = f.startDate ?? new Date(0);
    const end = f.endDate ?? new Date(8640000000000000);
    if (createdAt >= start && createdAt <= end && hasAnyTickerSymbol(symbols, f.symbols)) {
      return true;
    }
  }
  return false;
}

function filterAndParseTweets(
  entries: any,
  communityId: string | undefined,
  filters: TickerFilter[]
): XUserTweet[] {
  const entriesArray = Array.isArray(entries) ? entries : [];
  const validTweets: XUserTweet[] = [];
  
  for (const entry of entriesArray) {
    try {
      if (isValidTweetEntryForFilters(entry, filters)) {
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

function isValidTweetEntryForFilters(entry: any, filters: TickerFilter[]): boolean {
  const tweetData = safeGet(entry, 'content.itemContent.tweet_results.result');
  const legacy = safeGet(tweetData, 'legacy');
  
  if (!legacy || !safeGet(entry, 'content.itemContent')) {
    return false;
  }

  if (safeGet(legacy, 'retweeted_status_id_str')) {
    return false;
  }

  try {
    const createdAt = parseTwitterDate(safeGet(legacy, 'created_at') as string);
    const symbols = safeGet(legacy, 'entities.symbols', []);
    return matchesAnyFilter(createdAt, symbols, filters);
  } catch {
    return false;
  }
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
    id: sanitizeString(safeGet(userResult, 'rest_id') as string),
    name: sanitizeString(safeGet(legacy, 'name') as string),
    verified: Boolean(safeGet(data, 'result.data.user.result.is_blue_verified')),
    followers: sanitizeNumber(safeGet(legacy, 'followers_count') as number),
    likes: sanitizeNumber(safeGet(legacy, 'favourites_count') as number),
    tweets: []
  };
}

export async function fetchUser({ userId, communityId, filters }: XUserRequest): Promise<XUser | undefined> {
  try {
    validateUserId(userId);
    validateFilters(filters);
    
    // communityId is optional; if provided, it must be a non-empty string
    if (communityId !== undefined && (typeof communityId !== 'string' || communityId.trim().length === 0)) {
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
        filters
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

export async function fetchUserByUsername(username: string, communityId: string | undefined, filters: TickerFilter[]): Promise<XUser | undefined> {
  try {
    const userId = await fetchUserId(username);
    return await fetchUser({ userId, communityId, cursor: '', filters });
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
export { XUsersError, validateUserId, validateUsername };