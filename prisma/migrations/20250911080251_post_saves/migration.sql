-- CreateTable
CREATE TABLE "public"."PostSaves" (
    "postId" INTEGER NOT NULL,
    "savedBy" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostSaves_pkey" PRIMARY KEY ("postId","savedBy")
);

-- AddForeignKey
ALTER TABLE "public"."PostSaves" ADD CONSTRAINT "PostSaves_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostSaves" ADD CONSTRAINT "PostSaves_savedBy_fkey" FOREIGN KEY ("savedBy") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
