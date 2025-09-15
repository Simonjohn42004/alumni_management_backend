import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignUpdateDto } from './dto/create-campaign-update.dto';
import { UpdateCampaignUpdateDto } from './dto/update-campaign-update.dto';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';

@Injectable()
export class CampaignUpdatesService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createCampaignUpdateDto: CreateCampaignUpdateDto) {
    return this.prisma.campaignUpdate.create({
      data: {
        campaignId: createCampaignUpdateDto.campaignId,
        userId: createCampaignUpdateDto.userId,
        updateText: createCampaignUpdateDto.updateText,
      },
    });
  }

  async findAll() {
    return this.prisma.campaignUpdate.findMany({
      include: {
        campaign: true,
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const campaignUpdate = await this.prisma.campaignUpdate.findUnique({
      where: { id },
      include: {
        campaign: true,
        user: true,
      },
    });
    if (!campaignUpdate) {
      throw new NotFoundException(`CampaignUpdate with ID ${id} not found`);
    }
    return campaignUpdate;
  }

  async update(id: number, updateCampaignUpdateDto: UpdateCampaignUpdateDto) {
    const existing = await this.prisma.campaignUpdate.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`CampaignUpdate with ID ${id} not found`);
    }

    return this.prisma.campaignUpdate.update({
      where: { id },
      data: {
        campaignId: updateCampaignUpdateDto.campaignId ?? existing.campaignId,
        userId: updateCampaignUpdateDto.userId ?? existing.userId,
        updateText: updateCampaignUpdateDto.updateText ?? existing.updateText,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.campaignUpdate.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`CampaignUpdate with ID ${id} not found`);
    }
    return this.prisma.campaignUpdate.delete({ where: { id } });
  }
}
