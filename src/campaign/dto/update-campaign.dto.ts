import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsDecimal,
  Min,
  MaxLength,
  IsOptional,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  goalAmount: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  currentAmount?: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsString()
  @IsNotEmpty()
  creatorId: string;
}
