/*
  Warnings:

  - The primary key for the `PostComments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PostTags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[postId,taggedUserId,taggedBy]` on the table `PostTags` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."PostComments" DROP CONSTRAINT "PostComments_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PostComments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."PostTags" DROP CONSTRAINT "PostTags_pkey",
ADD COLUMN     "commentId" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PostTags_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "PostTags_postId_taggedUserId_taggedBy_key" ON "public"."PostTags"("postId", "taggedUserId", "taggedBy");

-- AddForeignKey
ALTER TABLE "public"."PostTags" ADD CONSTRAINT "PostTags_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."PostComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
