import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { CreateRewardDto } from './dto/create-reward.dto';

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createRewardDto: CreateRewardDto) {
    return this.prisma.reward.create({
      data: {
        campaignId: createRewardDto.campaignId,
        description: createRewardDto.description,
        minimumAmount: createRewardDto.minimumAmount,
      },
    });
  }

  async findAll() {
    return this.prisma.reward.findMany({
      include: { campaign: true },
    });
  }

  async findOne(id: number) {
    const reward = await this.prisma.reward.findUnique({
      where: { id },
      include: { campaign: true },
    });
    if (!reward) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return reward;
  }

  async update(id: number, updateRewardDto: UpdateRewardDto) {
    const existing = await this.prisma.reward.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }

    return this.prisma.reward.update({
      where: { id },
      data: {
        campaignId: updateRewardDto.campaignId ?? existing.campaignId,
        description: updateRewardDto.description ?? existing.description,
        minimumAmount: updateRewardDto.minimumAmount ?? existing.minimumAmount,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.reward.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    return this.prisma.reward.delete({ where: { id } });
  }
}
