/*
  Warnings:

  - You are about to drop the column `otp` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "otp",
ALTER COLUMN "mobileNumber" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
