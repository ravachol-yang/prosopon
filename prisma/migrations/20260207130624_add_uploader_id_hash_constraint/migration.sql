/*
  Warnings:

  - A unique constraint covering the columns `[uploaderId,hash]` on the table `Texture` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Texture_uploaderId_hash_key" ON "Texture"("uploaderId", "hash");
