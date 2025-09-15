import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createCampaignDto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        title: createCampaignDto.title,
        description: createCampaignDto.description,
        goalAmount: createCampaignDto.goalAmount,
        currentAmount: createCampaignDto.currentAmount ?? 0,
        startDate: createCampaignDto.startDate,
        endDate: createCampaignDto.endDate,
        status: createCampaignDto.status ?? 'ACTIVE',
        creatorId: createCampaignDto.creatorId,
      },
    });
  }

  async findAll() {
    return this.prisma.campaign.findMany({
      include: {
        creator: true,
        donations: true,
        rewards: true,
        updates: true,
        categories: {
          include: { category: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        creator: true,
        donations: true, // fetch donations as usual
        rewards: true,
        updates: true,
        categories: { include: { category: true } },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    // Get sum of completed donations
    const sumResult = await this.prisma.donation.aggregate({
      where: { campaignId: id, transactionStatus: 'COMPLETED' },
      _sum: { amount: true },
    });

    // Add sum as a separate field
    return {
      ...campaign,
      totalDonations: sumResult._sum.amount ?? 0,
    };
  }

  async update(id: number, updateCampaignDto: CreateCampaignDto) {
    const existing = await this.prisma.campaign.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return this.prisma.campaign.update({
      where: { id },
      data: {
        title: updateCampaignDto.title ?? existing.title,
        description: updateCampaignDto.description ?? existing.description,
        goalAmount: updateCampaignDto.goalAmount ?? existing.goalAmount,
        currentAmount:
          updateCampaignDto.currentAmount ?? existing.currentAmount,
        startDate: updateCampaignDto.startDate ?? existing.startDate,
        endDate: updateCampaignDto.endDate ?? existing.endDate,
        status: updateCampaignDto.status ?? existing.status,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.campaign.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return this.prisma.campaign.delete({ where: { id } });
  }
}
