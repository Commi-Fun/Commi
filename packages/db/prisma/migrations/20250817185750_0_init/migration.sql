-- CreateEnum
CREATE TYPE "CrawlerTaskType" AS ENUM ('USER_FETCH', 'TWEET_FETCH', 'COMMUNITY_FETCH');

-- CreateEnum
CREATE TYPE "CrawlerTaskStatus" AS ENUM ('QUEUED', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Blockchain" AS ENUM ('SOLANA', 'ETHEREUM', 'POLYGON', 'ARBITRUM', 'OPTIMISM');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('UPCOMING', 'ONGOING', 'ENDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "TokenPoolType" AS ENUM ('LAUNCH', 'FUND');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "twitterId" VARCHAR(20) NOT NULL,
    "handle" VARCHAR(20) NOT NULL,
    "name" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "tweetsCount" INTEGER NOT NULL DEFAULT 0,
    "listedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "tweetId" VARCHAR(20) NOT NULL,
    "text" TEXT NOT NULL,
    "twitterId" VARCHAR(20) NOT NULL,
    "retweetCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "quoteCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "isRetweet" BOOLEAN NOT NULL DEFAULT false,
    "isQuote" BOOLEAN NOT NULL DEFAULT false,
    "isReply" BOOLEAN NOT NULL DEFAULT false,
    "hasMedia" BOOLEAN NOT NULL DEFAULT false,
    "tickerSymbols" TEXT[],
    "parentTweetId" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "tweetCreatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("tweetId","fetchedAt")
);

-- CreateTable
CREATE TABLE "CampaignTweet" (
    "id" SERIAL NOT NULL,
    "tweetId" VARCHAR(20) NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignTweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTDistribution" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tweetId" INTEGER NOT NULL,
    "nftTokenId" TEXT,
    "transactionHash" TEXT,
    "walletAddress" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "status" "DistributionStatus" NOT NULL DEFAULT 'PENDING',
    "blockchain" "Blockchain" NOT NULL DEFAULT 'SOLANA',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFTDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlerTask" (
    "id" SERIAL NOT NULL,
    "type" "CrawlerTaskType" NOT NULL,
    "status" "CrawlerTaskStatus" NOT NULL DEFAULT 'QUEUED',
    "metadata" JSONB,
    "result" JSONB,
    "sourceId" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrawlerTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(44) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tokenAddress" VARCHAR(44) NOT NULL,
    "tokenName" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "totalAmount" BIGINT NOT NULL,
    "remainingAmount" BIGINT NOT NULL,
    "marketCap" BIGINT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "socialLinks" JSONB NOT NULL,
    "status" "CampaignStatus" NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "txHash" VARCHAR(88) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenPool" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "txHash" VARCHAR(88) NOT NULL,
    "amount" BIGINT NOT NULL,
    "type" "TokenPoolType" NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenPool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "twitterId" VARCHAR(20) NOT NULL,
    "influenceScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimRecord" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "claimed" BOOLEAN NOT NULL,
    "txHash" VARCHAR(88),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Whitelist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "twitterId" VARCHAR(20) NOT NULL,
    "referralCode" TEXT NOT NULL,
    "status" VARCHAR(15) NOT NULL DEFAULT 'registered',
    "postLink" TEXT,
    "registeredAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "followedAt" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3),
    "referredAt" TIMESTAMP(3),
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" SERIAL NOT NULL,
    "referrerId" INTEGER NOT NULL,
    "referrerTwitterId" VARCHAR(20) NOT NULL,
    "refereeId" INTEGER NOT NULL,
    "refereeTwitterId" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenInformation" (
    "id" SERIAL NOT NULL,
    "mint" VARCHAR(44) NOT NULL,
    "name" TEXT,
    "symbol" TEXT,
    "uri" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'pumpfun',
    "marketValue" DOUBLE PRECISION NOT NULL,
    "virtualSolReserves" BIGINT NOT NULL,
    "virtualTokenReserves" BIGINT NOT NULL,
    "realSolReserves" BIGINT NOT NULL,
    "realTokenReserves" BIGINT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "lastTransactionType" TEXT,
    "blockTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_twitterId_key" ON "User"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");

-- CreateIndex
CREATE INDEX "Tweet_twitterId_idx" ON "Tweet"("twitterId");

-- CreateIndex
CREATE INDEX "Tweet_fetchedAt_idx" ON "Tweet"("fetchedAt");

-- CreateIndex
CREATE INDEX "Tweet_tickerSymbols_idx" ON "Tweet" USING GIN ("tickerSymbols");

-- CreateIndex
CREATE INDEX "CampaignTweet_campaignId_idx" ON "CampaignTweet"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignTweet_tweetId_campaignId_key" ON "CampaignTweet"("tweetId", "campaignId");

-- CreateIndex
CREATE INDEX "NFTDistribution_status_idx" ON "NFTDistribution"("status");

-- CreateIndex
CREATE INDEX "NFTDistribution_blockchain_idx" ON "NFTDistribution"("blockchain");

-- CreateIndex
CREATE UNIQUE INDEX "NFTDistribution_userId_tweetId_key" ON "NFTDistribution"("userId", "tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_key_key" ON "SystemConfig"("key");

-- CreateIndex
CREATE INDEX "CrawlerTask_sourceId_idx" ON "CrawlerTask"("sourceId");

-- CreateIndex
CREATE INDEX "CrawlerTask_startedAt_idx" ON "CrawlerTask"("startedAt");

-- CreateIndex
CREATE INDEX "CrawlerTask_completedAt_idx" ON "CrawlerTask"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "Campaign_tokenAddress_idx" ON "Campaign"("tokenAddress");

-- CreateIndex
CREATE INDEX "Campaign_startTime_idx" ON "Campaign"("startTime");

-- CreateIndex
CREATE INDEX "Campaign_endTime_idx" ON "Campaign"("endTime");

-- CreateIndex
CREATE INDEX "Campaign_creatorId_idx" ON "Campaign"("creatorId");

-- CreateIndex
CREATE INDEX "Campaign_tags_idx" ON "Campaign" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "TokenPool_campaignId_idx" ON "TokenPool"("campaignId");

-- CreateIndex
CREATE INDEX "TokenPool_creatorId_idx" ON "TokenPool"("creatorId");

-- CreateIndex
CREATE INDEX "TokenPool_txHash_idx" ON "TokenPool"("txHash");

-- CreateIndex
CREATE INDEX "Participation_campaignId_idx" ON "Participation"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_userId_campaignId_key" ON "Participation"("userId", "campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_twitterId_campaignId_key" ON "Participation"("twitterId", "campaignId");

-- CreateIndex
CREATE INDEX "ClaimRecord_campaignId_idx" ON "ClaimRecord"("campaignId");

-- CreateIndex
CREATE INDEX "ClaimRecord_userId_idx" ON "ClaimRecord"("userId");

-- CreateIndex
CREATE INDEX "ClaimRecord_txHash_idx" ON "ClaimRecord"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_userId_key" ON "Whitelist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_twitterId_key" ON "Whitelist"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_referralCode_key" ON "Whitelist"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referrerId_refereeId_key" ON "Referral"("referrerId", "refereeId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referrerTwitterId_refereeTwitterId_key" ON "Referral"("referrerTwitterId", "refereeTwitterId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenInformation_mint_key" ON "TokenInformation"("mint");

-- CreateIndex
CREATE INDEX "TokenInformation_symbol_idx" ON "TokenInformation"("symbol");

-- CreateIndex
CREATE INDEX "TokenInformation_marketValue_idx" ON "TokenInformation"("marketValue");

-- CreateIndex
CREATE INDEX "TokenInformation_isComplete_idx" ON "TokenInformation"("isComplete");

-- CreateIndex
CREATE INDEX "TokenInformation_platform_idx" ON "TokenInformation"("platform");
