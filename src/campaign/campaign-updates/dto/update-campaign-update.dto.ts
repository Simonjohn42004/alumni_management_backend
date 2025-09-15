import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignUpdateDto } from './create-campaign-update.dto';

export class UpdateCampaignUpdateDto extends PartialType(
  CreateCampaignUpdateDto,
) {}
