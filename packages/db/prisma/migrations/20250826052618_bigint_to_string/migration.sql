-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "totalAmount" SET DATA TYPE TEXT,
ALTER COLUMN "remainingAmount" SET DATA TYPE TEXT,
ALTER COLUMN "marketCap" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ClaimRecord" ALTER COLUMN "amount" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TokenInformation" ALTER COLUMN "virtualSolReserves" SET DATA TYPE TEXT,
ALTER COLUMN "virtualTokenReserves" SET DATA TYPE TEXT,
ALTER COLUMN "realSolReserves" SET DATA TYPE TEXT,
ALTER COLUMN "realTokenReserves" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TokenPool" ALTER COLUMN "amount" SET DATA TYPE TEXT;
