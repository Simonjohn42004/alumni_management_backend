import { IsInt, IsString, IsDecimal, Min } from 'class-validator';

export class CreateRewardDto {
  @IsInt()
  campaignId: number;

  @IsString()
  description: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  minimumAmount: number;
}
