-- AlterTable
ALTER TABLE "public"."Internship" ADD COLUMN     "applicationUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."InternshipApplication" ADD COLUMN     "externalUrl" TEXT,
ALTER COLUMN "applicantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "applicationUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."JobApplication" ADD COLUMN     "externalUrl" TEXT,
ALTER COLUMN "applicantId" DROP NOT NULL;
