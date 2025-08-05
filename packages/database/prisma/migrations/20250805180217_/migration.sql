-- AlterEnum
ALTER TYPE "public"."ProductStatus" ADD VALUE 'pending';

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "group" SET DEFAULT '';
