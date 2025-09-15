import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CampaignUpdatesService } from './campaign-updates.service';
import { CreateCampaignUpdateDto } from './dto/create-campaign-update.dto';
import { UpdateCampaignUpdateDto } from './dto/update-campaign-update.dto';

@Controller('campaign-updates')
export class CampaignUpdatesController {
  constructor(
    private readonly campaignUpdatesService: CampaignUpdatesService,
  ) {}

  @Post()
  async create(@Body() createCampaignUpdateDto: CreateCampaignUpdateDto) {
    return await this.campaignUpdatesService.create(createCampaignUpdateDto);
  }

  @Get()
  async findAll() {
    return await this.campaignUpdatesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.campaignUpdatesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCampaignUpdateDto: UpdateCampaignUpdateDto,
  ) {
    return await this.campaignUpdatesService.update(
      +id,
      updateCampaignUpdateDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.campaignUpdatesService.remove(+id);
  }
}
