-- CreateTable
CREATE TABLE "public"."ProductContent" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "longDescription" TEXT,
    "features" TEXT,
    "useCase" TEXT,
    "howToUse" TEXT,
    "faq" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductContent_productId_language_key" ON "public"."ProductContent"("productId", "language");

-- AddForeignKey
ALTER TABLE "public"."ProductContent" ADD CONSTRAINT "ProductContent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
