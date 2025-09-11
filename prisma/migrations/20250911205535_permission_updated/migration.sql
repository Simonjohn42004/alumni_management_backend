/*
  Warnings:

  - You are about to drop the column `canDelete` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `canUpdate` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the `features` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `featureName` on the `permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."FeatureName" AS ENUM ('CHATS', 'PROFILES', 'POSTS', 'FUNDRAISING', 'EVENTS', 'ANNOUNCEMENTS');

-- AlterTable
ALTER TABLE "public"."permissions" DROP COLUMN "canDelete",
DROP COLUMN "canUpdate",
ADD COLUMN     "canDeleteAny" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteOwn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canUpdateAny" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canUpdateOwn" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "featureName",
ADD COLUMN     "featureName" "public"."FeatureName" NOT NULL,
ALTER COLUMN "canRead" SET DEFAULT false;

-- DropTable
DROP TABLE "public"."features";

-- CreateIndex
CREATE UNIQUE INDEX "permissions_roleId_featureName_key" ON "public"."permissions"("roleId", "featureName");
