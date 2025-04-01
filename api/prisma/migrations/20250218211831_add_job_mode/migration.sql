-- CreateEnum
CREATE TYPE "JobMode" AS ENUM ('SYNC', 'ASYNC');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "mode" "JobMode" NOT NULL;
