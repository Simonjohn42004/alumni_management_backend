import { IsInt, IsString, IsOptional, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export class CreatePaymentDetailDto {
  @IsInt()
  donationId: number;

  @IsString()
  paymentProvider: string;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  transactionDate?: Date;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  // New Razorpay fields
  @IsOptional()
  @IsString()
  razorpayOrderId?: string;

  @IsOptional()
  @IsString()
  razorpayPaymentId?: string;

  @IsOptional()
  @IsString()
  razorpaySignature?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}
