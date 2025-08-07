/*
  Warnings:

  - You are about to drop the column `facebookUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `instagramUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `redditUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tiktokUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `twitterUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeUrl` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "facebookUrl",
DROP COLUMN "instagramUrl",
DROP COLUMN "redditUrl",
DROP COLUMN "tiktokUrl",
DROP COLUMN "twitterUrl",
DROP COLUMN "youtubeUrl",
ADD COLUMN     "socialLinks" TEXT[] DEFAULT ARRAY[]::TEXT[];
