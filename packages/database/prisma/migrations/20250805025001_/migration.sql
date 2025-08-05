/*
  Warnings:

  - You are about to drop the column `icon` on the `ProductCategory` table. All the data in the column will be lost.
  - Added the required column `group` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "group" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductCategory" DROP COLUMN "icon";
