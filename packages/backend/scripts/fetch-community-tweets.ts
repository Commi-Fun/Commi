#!/usr/bin/env ts-node

import { PrismaClient } from '@commi-dashboard/db';
import { safeGet, safeGetArray } from '@commi-dashboard/common';
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 初始化Prisma客户端
const prisma = new PrismaClient();

// 接口定义
interface CommunityData {
  tokenAddress: string;
  ticker?: string;
  tokenUrl?: string;
  communityUrl: string;
  communityId: string;
  platform: string;
}

interface CommunityListJson {
  timestamp: string;
  totalTokensAvailable: number;
  totalTokensChecked: number;
  totalCommunities: number;
  communitiesByPlatform: Record<string, number>;
  communities: CommunityData[];
}

interface CommunityTweetData {
  tweetId: string;
  content: string;
  createdAt: string;
  viewCount: number;
  favoriteCount: number;
  retweetCount: number;
  replyCount: number;
  quoteCount: number;
  bookmarkCount: number;
  author: {
    id: string;
    name: string;
    handle: string;
    verified: boolean;
    isBlueVerified: boolean;
    followers: number;
    profileImageUrl: string;
    description: string;
    location: string;
    followingCount: number;
    tweetsCount: number;
    listedCount: number;
    favouritesCount: number;
    protected: boolean;
    createdAt: string;
  };
  media: string[];
  hashtags: string[];
  symbols: string[];
  urls: string[];
  userMentions: string[];
  lang: string;
}

interface ApiResponse {
  result?: {
    timeline?: {
      instructions?: Array<{
        type: string;
        entry?: any;
        entries?: any[];
      }>;
    };
  };
  cursor?: {
    bottom?: string;
    top?: string;
  };
}

// Load environment variables
dotenv.config();

// 计算当前时间所属的30分钟固定时间窗口
function getCurrentTimeWindow(currentTime: Date): { windowStart: Date; windowEnd: Date } {
  const year = currentTime.getFullYear();
  const month = currentTime.getMonth();
  const date = currentTime.getDate();
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  
  // 计算当前时间属于哪个30分钟窗口
  // 窗口: 00-30, 30-60 (即下一个小时的00)
  const windowMinute = minute < 30 ? 0 : 30;
  
  // 窗口开始时间
  const windowStart = new Date(year, month, date, hour, windowMinute, 0, 0);
  
  // 窗口结束时间 (下一个窗口的开始时间)
  const windowEnd = new Date(windowStart.getTime() + 30 * 60 * 1000); // +30分钟
  
  return { windowStart, windowEnd };
}

// 读取 JSON 文件
function loadCommunityData(jsonFilePath: string): CommunityListJson {
  try {
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(jsonContent) as CommunityListJson;
  } catch (error) {
    throw new Error(`Failed to load community data from ${jsonFilePath}: ${error}`);
  }
}

// 调用Twitter API获取社区推文（支持分页）
function fetchCommunityTweets(communityId: string, cursor?: string): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    let path = `/community-tweets?communityId=${communityId}&searchType=Default&rankingMode=Relevance&count=20`;
    if (cursor) {
      path += `&cursor=${encodeURIComponent(cursor)}`;
    }

    const options = {
      method: 'GET',
      hostname: 'twitter241.p.rapidapi.com',
      port: null,
      path: path,
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'twitter241.p.rapidapi.com'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON response: ${error}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 社区信息接口
interface CommunityInfo {
  id: string;
  name: string;
  description: string;
  creationTime: Date;
  memberCount: number;
  moderatorCount?: number;
}

// 从API响应中提取游标
function extractCursor(apiResponse: ApiResponse): string | null {
  try {
    const instructions = safeGetArray(apiResponse, 'result.timeline.instructions');
    const addEntriesInstruction = instructions.find(inst => inst.type === "TimelineAddEntries");
    
    if (safeGetArray(addEntriesInstruction, 'entries')) {
      const cursorEntry = safeGetArray(addEntriesInstruction, 'entries').find((entry: any) => 
        safeGet(entry, 'content.cursorType') === "Bottom"
      );
      return safeGet(cursorEntry, 'content.value');
    }
    
    return safeGet(apiResponse, 'cursor.bottom');
  } catch (error) {
    console.warn('Failed to extract cursor:', error);
    return null;
  }
}

// 解析API响应数据
function parseApiResponse(apiResponse: ApiResponse): { tweets: CommunityTweetData[], community: CommunityInfo | null } {
  const tweets: CommunityTweetData[] = [];
  let community: CommunityInfo | null = null;
  
  if (!safeGet(apiResponse, 'result.timeline.instructions')) {
    console.warn('No timeline instructions found in API response');
    return { tweets, community };
  }

  const instructions = safeGetArray(apiResponse, 'result.timeline.instructions');

  // 处理置顶推文
  const pinnedInstruction = instructions.find(inst => inst.type === "TimelinePinEntry");
  if (safeGet(pinnedInstruction, 'entry.content.itemContent.tweet_results.result.tweet')) {
    const tweetData = safeGet(pinnedInstruction, 'entry.content.itemContent.tweet_results.result.tweet');
    const parsedTweet = parseTweetData(tweetData);
    if (parsedTweet) tweets.push(parsedTweet);
    
    // 从第一个推文中提取社区信息
    if (!community && safeGet(tweetData, 'author_community_relationship.community_results.result')) {
      community = parseCommunityData(safeGet(tweetData, 'author_community_relationship.community_results.result'));
    }
  }

  // 处理常规推文
  const addEntriesInstruction = instructions.find(inst => inst.type === "TimelineAddEntries");
  if (safeGetArray(addEntriesInstruction, 'entries')) {
    const regularTweets = safeGetArray(addEntriesInstruction, 'entries')
      .filter((entry: any) => safeGet(entry, 'content.itemContent.tweet_results.result.tweet'))
      .map((entry: any) => {
        const tweet = safeGet(entry, 'content.itemContent.tweet_results.result.tweet');
        // 如果还没有解析到社区信息，从推文中提取
        if (!community && safeGet(tweet, 'author_community_relationship.community_results.result')) {
          community = parseCommunityData(safeGet(tweet, 'author_community_relationship.community_results.result'));
        }
        return parseTweetData(tweet);
      })
      .filter((tweet: CommunityTweetData | null) => tweet !== null);
    
    tweets.push(...regularTweets);
  }

  return { tweets, community };
}

// 解析社区数据
function parseCommunityData(communityResult: any): CommunityInfo | null {
  try {
    return {
      id: safeGet(communityResult, 'id_str', ''),
      name: safeGet(communityResult, 'name', ''),
      description: safeGet(communityResult, 'description', ''),
      creationTime: safeGet(communityResult, 'created_at') ? new Date(safeGet(communityResult, 'created_at')) : new Date(),
      memberCount: safeGet(communityResult, 'member_count', 0),
      moderatorCount: safeGet(communityResult, 'moderator_count', 0),
    };
  } catch (error) {
    console.error('Error parsing community data:', error);
    return null;
  }
}

// 解析单个推文数据
function parseTweetData(tweetData: any): CommunityTweetData | null {
  try {
    const legacy = safeGet(tweetData, 'legacy', {});
    const userResult = safeGet(tweetData, 'core.user_results.result', {});
    const userLegacy = safeGet(userResult, 'legacy', {});
    const entities = safeGet(legacy, 'entities', {});
    return {
      tweetId: safeGet(tweetData, 'rest_id', safeGet(legacy, 'id_str', '')),
      content: safeGet(legacy, 'full_text', ''),
      createdAt: safeGet(legacy, 'created_at', ''),
      viewCount: parseInt(safeGet(tweetData, 'views.count', '0')),
      favoriteCount: safeGet(legacy, 'favorite_count', 0),
      retweetCount: safeGet(legacy, 'retweet_count', 0),
      replyCount: safeGet(legacy, 'reply_count', 0),
      quoteCount: safeGet(legacy, 'quote_count', 0),
      bookmarkCount: safeGet(legacy, 'bookmark_count', 0),
      author: {
        id: safeGet(userResult, 'rest_id', ''),
        name: safeGet(userLegacy, 'name', ''),
        handle: safeGet(userLegacy, 'screen_name', ''),
        verified: safeGet(userResult, 'verification.verified', false),
        isBlueVerified: safeGet(userResult, 'is_blue_verified', false),
        followers: safeGet(userLegacy, 'followers_count', 0),
        profileImageUrl: safeGet(userLegacy, 'profile_image_url_https', ''),
        description: safeGet(userLegacy, 'description', ''),
        location: safeGet(userResult, 'location.location', ''),
        followingCount: safeGet(userLegacy, 'friends_count', 0),
        tweetsCount: safeGet(userLegacy, 'statuses_count', 0),
        listedCount: safeGet(userLegacy, 'listed_count', 0),
        favouritesCount: safeGet(userLegacy, 'favourites_count', 0),
        protected: safeGet(userResult, 'privacy.protected', false),
        createdAt: safeGet(userLegacy, 'created_at', ''),
      },
      media: (safeGetArray(legacy, 'extended_entities.media')?.filter((media: any) => safeGet(media, 'type', '') === 'photo')
        .map((media: any) => safeGet(media, 'media_url_https', ''))) ?? [],
      hashtags: (safeGetArray(entities, 'hashtags')).map((tag: any) => safeGet(tag, 'text', '')),
      symbols: (safeGetArray(entities, 'symbols')).map((symbol: any) => safeGet(symbol, 'text', '')),
      urls: (safeGetArray(entities, 'urls')).map((url: any) => safeGet(url, 'expanded_url', '')),
      userMentions: (safeGetArray(entities, 'user_mentions')).map((mention: any) => safeGet(mention, 'screen_name', '')),
      lang: safeGet(legacy, 'lang', ''),
    };
  } catch (error) {
    console.error('Error parsing tweet data:', error);
    return null;
  }
}

// 保存社区信息到数据库
async function saveCommunityToDatabase(
  communityData: CommunityData, 
  apiCommunityInfo?: CommunityInfo | null
): Promise<void> {
  try {
    // 首先检查是否已存在
    const existingCommunity = await prisma.community.findFirst({
      where: { communityId: communityData.communityId },
    });

    // 优先使用 API 返回的社区信息，否则使用 JSON 文件中的基础信息
    const communityName = apiCommunityInfo?.name || `${communityData.ticker || 'Unknown'} Community`;
    const communityDescription = apiCommunityInfo?.description || `Community for ${communityData.ticker || communityData.tokenAddress}`;
    const creationTime = apiCommunityInfo?.creationTime || new Date();
    const memberCount = apiCommunityInfo?.memberCount || 0;
    const moderatorCount = apiCommunityInfo?.moderatorCount || 0;

    if (existingCommunity) {
      // 更新现有社区
      await prisma.community.update({
        where: { id: existingCommunity.id },
        data: {
          name: communityName,
          description: communityDescription,
          creationTime: creationTime,
          tokenAddress: communityData.tokenAddress,
          tokenName: communityData.ticker || 'Unknown',
          ticker: communityData.ticker,
          platform: communityData.platform,
          memberCount: memberCount,
          moderatorCount: moderatorCount,
          updatedAt: new Date(),
        },
      });
    } else {
      // 创建新社区
      await prisma.community.create({
        data: {
          communityId: communityData.communityId,
          name: communityName,
          description: communityDescription,
          creationTime: creationTime,
          tokenAddress: communityData.tokenAddress,
          tokenName: communityData.ticker || 'Unknown',
          ticker: communityData.ticker,
          platform: communityData.platform,
          memberCount: memberCount,
          moderatorCount: moderatorCount,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
    
    // 如果有 API 社区信息，记录额外的统计数据
    if (apiCommunityInfo) {
      console.log(`📊 Community Stats: ${apiCommunityInfo.memberCount} members, ${apiCommunityInfo.moderatorCount} moderators`);
    }
  } catch (error) {
    console.error(`Failed to save community ${communityData.communityId}:`, error);
  }
}

// 保存用户到数据库
async function saveUserToDatabase(user: CommunityTweetData['author'], communityId: string): Promise<void> {
  try {
    const creationTime = new Date(user.createdAt);
    
    // 先查找是否已存在该用户
    const existingUser = await prisma.communityUser.findUnique({
      where: { twitterId: user.id }
    });

    if (existingUser) {
      // 如果用户已存在，更新用户信息并将新的 communityId 添加到数组中（如果不存在）
      const isNewCommunity = !existingUser.communityId.includes(communityId);
      const updatedCommunityIds = isNewCommunity 
        ? [...existingUser.communityId, communityId] // 添加新的 communityId
        : existingUser.communityId; // 如果已存在则不重复添加

      await prisma.communityUser.update({
        where: { twitterId: user.id },
        data: {
          handle: user.handle,
          name: user.name,
          description: user.description,
          location: user.location,
          profileImageUrl: user.profileImageUrl,
          followersCount: user.followers,
          followingCount: user.followingCount,
          friendsCount: user.followingCount,
          tweetsCount: user.tweetsCount,
          listedCount: user.listedCount,
          favouritesCount: user.favouritesCount,
          verified: user.verified,
          protected: user.protected,
          isBlueVerified: user.isBlueVerified,
          communityId: updatedCommunityIds, // 更新 communityId 数组
          updatedAt: new Date(),
        },
      });

      if (isNewCommunity) {
        console.log(`👥 Added community ${communityId} to existing user @${user.handle} (total: ${updatedCommunityIds.length} communities)`);
      }
    } else {
      // 如果用户不存在，创建新用户
      await prisma.communityUser.create({
        data: {
          twitterId: user.id,
          handle: user.handle,
          name: user.name,
          description: user.description,
          location: user.location,
          profileImageUrl: user.profileImageUrl,
          followersCount: user.followers,
          followingCount: user.followingCount,
          friendsCount: user.followingCount,
          tweetsCount: user.tweetsCount,
          listedCount: user.listedCount,
          favouritesCount: user.favouritesCount,
          verified: user.verified,
          protected: user.protected,
          isBlueVerified: user.isBlueVerified,
          communityId: [communityId], // 初始化为包含当前 communityId 的数组
          creationTime: creationTime,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`🆕 Created new user @${user.handle} in community ${communityId}`);
    }
  } catch (error) {
    console.error(`Failed to save user ${user.handle}:`, error);
  }
}

// 保存推文到数据库
async function saveTweetToDatabase(tweet: CommunityTweetData, communityId: string, currentRunTime: Date): Promise<void> {
  try {
    const tweetCreatedAt = new Date(tweet.createdAt);
    
    // 检查在当前30分钟固定时间窗口内是否已经记录过这条推文
    // 时间窗口: 12:00-12:30, 12:30-13:00, 13:00-13:30, etc.
    const { windowStart, windowEnd } = getCurrentTimeWindow(currentRunTime);
    
    const existingInCurrentRun = await prisma.communityTweet.findFirst({
      where: {
        tweetId: tweet.tweetId,
        fetchedAt: {
          gte: windowStart,
          lt: windowEnd  // 使用 lt 而不是 lte，确保不包含下一个窗口的开始时间
        }
      }
    });

    if (existingInCurrentRun) {
      console.log(`⏭️  Tweet ${tweet.tweetId} already recorded in current run window, skipping...`);
      return;
    }

    // 如果在当前运行窗口内没有记录，则创建新记录
    await prisma.communityTweet.create({
      data: {
        tweetId: tweet.tweetId,
        text: tweet.content,
        twitterId: tweet.author.id,
        communityId: communityId,
        retweetCount: tweet.retweetCount,
        replyCount: tweet.replyCount,
        likeCount: tweet.favoriteCount,
        quoteCount: tweet.quoteCount,
        viewCount: tweet.viewCount,
        bookmarkCount: tweet.bookmarkCount,
        isRetweet: false, // 需要根据实际情况判断
        isQuote: false,   // 需要根据实际情况判断
        isReply: false,   // 需要根据实际情况判断
        hasMedia: tweet.media.length > 0,
        symbols: tweet.symbols,
        hashtags: tweet.hashtags,
        urls: tweet.urls,
        mentions: tweet.userMentions,
        lang: tweet.lang,
        fetchedAt: currentRunTime,
        tweetCreatedAt: tweetCreatedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(`Failed to save tweet ${tweet.tweetId}:`, error);
  }
}

// 处理单个社区的完整流程
async function processCommunity(community: CommunityData, index: number, total: number, currentRunTime: Date): Promise<{
  success: boolean;
  communityId: string;
  tweetsCount: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    console.log(`\n🔍 [${index}/${total}] Processing community: ${community.ticker || 'Unknown'}`);
    console.log(`📄 Token: ${community.ticker || 'Unknown'} (${community.tokenAddress})`);
    console.log(`🔗 Community ID: ${community.communityId}`);

    let allTweets: CommunityTweetData[] = [];
    let apiCommunityInfo: CommunityInfo | null = null;
    let cursor: string | null = null;
    let pageCount = 0;
    const maxPages = 3; // 限制最大页数，避免无限循环

    // 分页获取所有推文
    do {
      pageCount++;
      console.log(`📱 Fetching page ${pageCount}${cursor ? ` (cursor: ${cursor.substring(0, 20)}...)` : ''}...`);
      
      const apiResponse = await fetchCommunityTweets(community.communityId, cursor || undefined);
      const { tweets, community: communityInfo } = parseApiResponse(apiResponse);
      
      // 第一次请求时保存社区信息
      if (!apiCommunityInfo && communityInfo) {
        apiCommunityInfo = communityInfo;
      }

      if (tweets.length === 0) {
        console.log(`📭 No more tweets found on page ${pageCount}`);
        break;
      }

      allTweets.push(...tweets);
      console.log(`📝 Page ${pageCount}: Found ${tweets.length} tweets (Total: ${allTweets.length})`);

      // 获取下一页游标
      cursor = extractCursor(apiResponse);
      
      // 添加页面间延迟
      if (cursor && pageCount < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } while (cursor && pageCount < maxPages);

    console.log(`📊 Total tweets collected: ${allTweets.length} (${pageCount} pages)`);

    // 保存社区信息
    await saveCommunityToDatabase(community, apiCommunityInfo);

    if (allTweets.length === 0) {
      console.log('⚠️  No tweets found for this community');
      return {
        success: true,
        communityId: community.communityId,
        tweetsCount: 0
      };
    }

    // 保存推文和用户数据
    let savedTweets = 0;
    for (const tweet of allTweets) {
      try {
        // 先保存用户信息
        await saveUserToDatabase(tweet.author, community.communityId);
        
        // 再保存推文
        await saveTweetToDatabase(tweet, community.communityId, currentRunTime);
        
        savedTweets++;
        
        // 每10条推文显示一次进度
        if (savedTweets % 10 === 0 || savedTweets === allTweets.length) {
          console.log(`💾 Saved ${savedTweets}/${allTweets.length} tweets`);
        }
      } catch (error) {
        console.error(`❌ Error saving tweet ${tweet.tweetId}:`, error);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ [${index}/${total}] Successfully processed community ${community.communityId}`);
    console.log(`📈 Stats: ${savedTweets} tweets, ${pageCount} pages, ${duration}s`);
    
    return {
      success: true,
      communityId: community.communityId,
      tweetsCount: savedTweets
    };

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ [${index}/${total}] Error processing community ${community.communityId}: ${errorMessage} (${duration}s)`);
    
    return {
      success: false,
      communityId: community.communityId,
      tweetsCount: 0,
      error: errorMessage
    };
  }
}

// 主函数
async function main(jsonFilePath?: string, concurrency: number = 5) {
  const startTime = Date.now();
  const currentRunTime = new Date(); // 当前运行的统一时间戳
  
  try {
    console.log('🚀 Starting community tweets fetching script...');
    console.log(`⚡ Concurrency level: ${concurrency} communities in parallel`);
    console.log(`🕐 Current run time: ${currentRunTime.toISOString()}`);
    
    // 显示当前时间窗口信息
    const { windowStart, windowEnd } = getCurrentTimeWindow(currentRunTime);
    console.log(`📅 Time window: ${windowStart.toLocaleTimeString()} - ${windowEnd.toLocaleTimeString()}`);

    // 使用默认路径或传入的路径
    const inputPath = jsonFilePath || path.join(process.cwd(), 'solana-communities.json');
    
    // 从 JSON 文件读取社区数据
    console.log(`📊 Loading community data from ${inputPath}...`);
    const communityData = loadCommunityData(inputPath);
    
    console.log(`📋 Found ${communityData.totalCommunities} communities`);
    console.log(`📈 Platform breakdown:`, communityData.communitiesByPlatform);

    // 并行处理社区，使用控制并发数
    const results: Array<{
      success: boolean;
      communityId: string;
      tweetsCount: number;
      error?: string;
    }> = [];

    console.log(`\n🔄 Starting parallel processing...`);

    // 分批处理，控制并发数
    for (let i = 0; i < communityData.communities.length; i += concurrency) {
      const batch = communityData.communities.slice(i, i + concurrency);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(communityData.communities.length / concurrency)} (${batch.length} communities)`);
      
      // 并行处理当前批次
      const batchPromises = batch.map((community, batchIndex) => 
        processCommunity(community, i + batchIndex + 1, communityData.communities.length, currentRunTime)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      // 收集结果
      batchResults.forEach((result, batchIndex) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          const community = batch[batchIndex];
          console.error(`❌ Failed to process community ${community.communityId}: ${result.reason}`);
          results.push({
            success: false,
            communityId: community.communityId,
            tweetsCount: 0,
            error: String(result.reason)
          });
        }
      });

      // 批次间延迟，避免过度请求
      if (i + concurrency < communityData.communities.length) {
        console.log(`⏳ Waiting 3 seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // 统计结果
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;
    const totalTweets = results.reduce((sum, r) => sum + r.tweetsCount, 0);
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    console.log(`\n🎉 Script completed!`);
    console.log(`📊 Final Statistics:`);
    console.log(`   - Total communities: ${communityData.communities.length}`);
    console.log(`   - Successful: ${successCount}`);
    console.log(`   - Failed: ${failedCount}`);
    console.log(`   - Total tweets collected: ${totalTweets}`);
    console.log(`   - Total duration: ${duration} minutes`);
    console.log(`   - Average tweets per community: ${successCount > 0 ? (totalTweets / successCount).toFixed(1) : 0}`);

    // 显示失败的社区
    const failedCommunities = results.filter(r => !r.success);
    if (failedCommunities.length > 0) {
      console.log(`\n❌ Failed communities:`);
      failedCommunities.forEach(failed => {
        console.log(`   - ${failed.communityId}: ${failed.error}`);
      });
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 处理未捕获的异常
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// 运行脚本
if (require.main === module) {
  // 支持命令行参数：JSON 文件路径和并发数
  const jsonFilePath = process.argv[2];
  const concurrency = process.argv[3] ? parseInt(process.argv[3]) : 3;
  
  if (concurrency < 1 || concurrency > 10) {
    console.error('❌ Concurrency must be between 1 and 10');
    process.exit(1);
  }
  
  main(jsonFilePath, concurrency);
}

export { 
  main, 
  fetchCommunityTweets, 
  parseApiResponse, 
  loadCommunityData,
  saveCommunityToDatabase,
  saveUserToDatabase,
  saveTweetToDatabase,
  parseTweetData,
  parseCommunityData,
  processCommunity,
  extractCursor,
  getCurrentTimeWindow
};
