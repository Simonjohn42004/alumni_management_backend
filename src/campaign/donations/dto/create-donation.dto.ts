import {
  IsInt,
  IsString,
  IsDecimal,
  Min,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class CreateDonationDto {
  @IsInt()
  campaignId: number;

  @IsString()
  donorId: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  amount: number;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  transactionStatus?: TransactionStatus; // Optional, defaults to PENDING if omitted
}
