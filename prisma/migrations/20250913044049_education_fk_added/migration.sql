/*
  Warnings:

  - The primary key for the `Educations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Educations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,schoolName,degree]` on the table `Educations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Educations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Educations" DROP CONSTRAINT "Educations_pkey",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Educations_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Educations_userId_schoolName_degree_key" ON "public"."Educations"("userId", "schoolName", "degree");

-- AddForeignKey
ALTER TABLE "public"."Educations" ADD CONSTRAINT "Educations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
