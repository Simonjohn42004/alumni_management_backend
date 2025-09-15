import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateCampaignUpdateDto {
  @IsInt()
  campaignId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  updateText: string;
}
