-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Blockchain" AS ENUM ('SOLANA', 'ETHEREUM', 'POLYGON', 'ARBITRUM', 'OPTIMISM');

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
    "id" SERIAL NOT NULL,
    "tweetId" VARCHAR(20) NOT NULL,
    "text" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
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
    "influenceScore" DOUBLE PRECISION,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentTweetId" INTEGER,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "CrawlerLog" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawlerLog_pkey" PRIMARY KEY ("id")
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
    "description" TEXT,
    "tokenAddress" VARCHAR(44) NOT NULL,
    "tokenName" TEXT NOT NULL,
    "totalAmount" BIGINT NOT NULL,
    "remainingAmount" BIGINT NOT NULL,
    "marketCap" BIGINT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "socialLinks" JSONB,
    "status" VARCHAR(10) NOT NULL DEFAULT 'pending',
    "creatorId" INTEGER NOT NULL,
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
    "type" VARCHAR(6) NOT NULL DEFAULT 'launch',
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
    "scores" INTEGER NOT NULL,
    "rewardAmount" BIGINT NOT NULL,
    "claimStatus" VARCHAR(15) NOT NULL DEFAULT 'can_not_claim',
    "txHash" VARCHAR(88) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_tweetId_key" ON "Tweet"("tweetId");

-- CreateIndex
CREATE INDEX "Tweet_userId_idx" ON "Tweet"("userId");

-- CreateIndex
CREATE INDEX "Tweet_createdAt_idx" ON "Tweet"("createdAt");

-- CreateIndex
CREATE INDEX "Tweet_tickerSymbols_idx" ON "Tweet"("tickerSymbols");

-- CreateIndex
CREATE INDEX "Tweet_influenceScore_idx" ON "Tweet"("influenceScore");

-- CreateIndex
CREATE INDEX "NFTDistribution_status_idx" ON "NFTDistribution"("status");

-- CreateIndex
CREATE INDEX "NFTDistribution_blockchain_idx" ON "NFTDistribution"("blockchain");

-- CreateIndex
CREATE INDEX "NFTDistribution_createdAt_idx" ON "NFTDistribution"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NFTDistribution_userId_tweetId_key" ON "NFTDistribution"("userId", "tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_key_key" ON "SystemConfig"("key");

-- CreateIndex
CREATE INDEX "CrawlerLog_type_idx" ON "CrawlerLog"("type");

-- CreateIndex
CREATE INDEX "CrawlerLog_status_idx" ON "CrawlerLog"("status");

-- CreateIndex
CREATE INDEX "CrawlerLog_createdAt_idx" ON "CrawlerLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "Campaign_tokenAddress_idx" ON "Campaign"("tokenAddress");

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
CREATE INDEX "Participation_campaignId_idx" ON "Participation"("campaignId");

-- CreateIndex
CREATE INDEX "Participation_userId_idx" ON "Participation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_userId_key" ON "Whitelist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_twitterId_key" ON "Whitelist"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_referralCode_key" ON "Whitelist"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referrerId_refereeId_key" ON "Referral"("referrerId", "refereeId");

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

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_parentTweetId_fkey" FOREIGN KEY ("parentTweetId") REFERENCES "Tweet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTDistribution" ADD CONSTRAINT "NFTDistribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTDistribution" ADD CONSTRAINT "NFTDistribution_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;