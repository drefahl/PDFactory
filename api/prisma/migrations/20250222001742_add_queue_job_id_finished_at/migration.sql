/*
  Warnings:

  - A unique constraint covering the columns `[queueJobId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "queueJobId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Job_queueJobId_key" ON "Job"("queueJobId");
