-- CreateEnum
CREATE TYPE "public"."Department" AS ENUM ('COMPUTER_SCIENCE_ENGINEERING', 'COMPUTER_SCIENCE_BUSINESS_SYSTEMS', 'ARTIFICIAL_INTELLIGENCE_DATA_SCIENCE', 'ARTIFICIAL_INTELLIGENCE_MACHINE_LEARNING', 'MECHANICAL_AUTOMATION_ENGINEERING', 'INTERNET_OF_THINGS', 'CYBERSECURITY', 'COMPUTER_COMMUNICATION_ENGINEERING', 'ELECTRICAL_INSTRUMENTATION_ENGINEERING', 'INSTRUMENTATION_CONTROL_ENGINEERING', 'INFORMATION_TECHNOLOGY', 'MECHANICAL_ENGINEERING', 'ELECTRICAL_ELECTRONICS_ENGINEERING', 'CIVIL_ENGINEERING', 'ELECTRONICS_COMMUNICATION_ENGINEERING');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "currentPosition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collegeId" INTEGER NOT NULL,
    "department" "public"."Department" NOT NULL,
    "skillSets" TEXT[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Educations" (
    "id" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "cgpa" DECIMAL(3,2) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Educations_pkey" PRIMARY KEY ("id","schoolName","degree")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_passwordHash_key" ON "public"."Users"("passwordHash");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phoneNumber_key" ON "public"."Users"("phoneNumber");
