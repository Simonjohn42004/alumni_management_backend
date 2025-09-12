/*
  Warnings:

  - The values [CHATS,PROFILES,POSTS,FUNDRAISING,EVENTS,ANNOUNCEMENTS] on the enum `FeatureName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."FeatureName_new" AS ENUM ('chats', 'profiles', 'posts', 'fundraising', 'events', 'announcements');
ALTER TABLE "public"."permissions" ALTER COLUMN "featureName" TYPE "public"."FeatureName_new" USING ("featureName"::text::"public"."FeatureName_new");
ALTER TYPE "public"."FeatureName" RENAME TO "FeatureName_old";
ALTER TYPE "public"."FeatureName_new" RENAME TO "FeatureName";
DROP TYPE "public"."FeatureName_old";
COMMIT;
