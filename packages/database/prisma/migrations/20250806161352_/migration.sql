/*
  Warnings:

  - You are about to drop the column `group` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "group",
ADD COLUMN     "voteCount" INTEGER NOT NULL DEFAULT 0;
