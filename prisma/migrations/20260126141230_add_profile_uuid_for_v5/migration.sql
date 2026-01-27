/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_uuid_key" ON "Profile"("uuid");
