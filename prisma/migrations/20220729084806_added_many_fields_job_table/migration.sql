/*
  Warnings:

  - Added the required column `company_scale` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_tips` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_info` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "company_scale" TEXT NOT NULL,
ADD COLUMN     "company_tips" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "job_info" TEXT NOT NULL;
