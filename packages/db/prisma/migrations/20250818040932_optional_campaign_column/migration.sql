/*
  Warnings:

  - You are about to drop the column `name` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "name",
ALTER COLUMN "ticker" DROP NOT NULL,
ALTER COLUMN "txHash" DROP NOT NULL;
