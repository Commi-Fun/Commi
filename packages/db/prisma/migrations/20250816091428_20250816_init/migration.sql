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
CREATE UNIQUE INDEX "TokenInformation_mint_key" ON "TokenInformation"("mint");

-- CreateIndex
CREATE INDEX "TokenInformation_symbol_idx" ON "TokenInformation"("symbol");

-- CreateIndex
CREATE INDEX "TokenInformation_marketValue_idx" ON "TokenInformation"("marketValue");

-- CreateIndex
CREATE INDEX "TokenInformation_isComplete_idx" ON "TokenInformation"("isComplete");

-- CreateIndex
CREATE INDEX "TokenInformation_platform_idx" ON "TokenInformation"("platform");
