/*
  Warnings:

  - Made the column `phoneNumber` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Users" ALTER COLUMN "phoneNumber" SET NOT NULL;
