-- AlterTable
ALTER TABLE "public"."PaymentDetails" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT;
