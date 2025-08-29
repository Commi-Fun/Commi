-- CreateTable
CREATE TABLE "public"."Community" (
    "id" SERIAL NOT NULL,
    "communityId" VARCHAR(20) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creationTime" TIMESTAMP(3) NOT NULL,
    "tokenAddress" VARCHAR(44) NOT NULL,
    "tokenName" TEXT NOT NULL,
    "ticker" TEXT,
    "platform" TEXT NOT NULL,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "moderatorCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommunityUser" (
    "id" SERIAL NOT NULL,
    "twitterId" VARCHAR(20) NOT NULL,
    "handle" VARCHAR(20) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "communityId" TEXT[],
    "location" TEXT,
    "profileImageUrl" TEXT,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "friendsCount" INTEGER NOT NULL DEFAULT 0,
    "tweetsCount" INTEGER NOT NULL DEFAULT 0,
    "listedCount" INTEGER NOT NULL DEFAULT 0,
    "favouritesCount" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "protected" BOOLEAN NOT NULL DEFAULT false,
    "isBlueVerified" BOOLEAN NOT NULL DEFAULT false,
    "creationTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommunityTweet" (
    "tweetId" VARCHAR(20) NOT NULL,
    "text" TEXT NOT NULL,
    "twitterId" VARCHAR(20) NOT NULL,
    "communityId" VARCHAR(20) NOT NULL,
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
    "symbols" TEXT[],
    "hashtags" TEXT[],
    "urls" TEXT[],
    "mentions" TEXT[],
    "lang" TEXT,
    "parentTweetId" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "tweetCreatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityTweet_pkey" PRIMARY KEY ("tweetId","fetchedAt")
);

-- CreateIndex
CREATE INDEX "Community_communityId_idx" ON "public"."Community"("communityId");

-- CreateIndex
CREATE INDEX "Community_ticker_idx" ON "public"."Community"("ticker");

-- CreateIndex
CREATE INDEX "Community_tokenAddress_idx" ON "public"."Community"("tokenAddress");

-- CreateIndex
CREATE INDEX "CommunityUser_communityId_idx" ON "public"."CommunityUser" USING GIN ("communityId");

-- CreateIndex
CREATE INDEX "CommunityUser_creationTime_idx" ON "public"."CommunityUser"("creationTime");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityUser_twitterId_key" ON "public"."CommunityUser"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityUser_handle_key" ON "public"."CommunityUser"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityTweet_tweetId_key" ON "public"."CommunityTweet"("tweetId");

-- CreateIndex
CREATE INDEX "CommunityTweet_twitterId_idx" ON "public"."CommunityTweet"("twitterId");

-- CreateIndex
CREATE INDEX "CommunityTweet_fetchedAt_idx" ON "public"."CommunityTweet"("fetchedAt");

-- CreateIndex
CREATE INDEX "CommunityTweet_symbols_idx" ON "public"."CommunityTweet" USING GIN ("symbols");

-- CreateIndex
CREATE INDEX "CommunityTweet_hashtags_idx" ON "public"."CommunityTweet" USING GIN ("hashtags");

-- CreateIndex
CREATE INDEX "CommunityTweet_mentions_idx" ON "public"."CommunityTweet" USING GIN ("mentions");
