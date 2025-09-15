import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';

@Injectable()
export class DonationsService {
constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createDonationDto: CreateDonationDto) {
    return this.prisma.donation.create({
      data: {
        campaignId: createDonationDto.campaignId,
        donorId: createDonationDto.donorId,
        amount: createDonationDto.amount,
        paymentMethod: createDonationDto.paymentMethod,
        transactionStatus: createDonationDto.transactionStatus ?? 'PENDING',
      },
    });
  }

  async findAll() {
    return this.prisma.donation.findMany({
      include: {
        campaign: true,
        donor: true,
        paymentDetails: true,
      },
    });
  }

  async findOne(id: number) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: {
        campaign: true,
        donor: true,
        paymentDetails: true,
        
      },
    });
    if (!donation) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }
    return donation;
  }

  async update(id: number, updateDonationDto: UpdateDonationDto) {
    const existing = await this.prisma.donation.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }

    return this.prisma.donation.update({
      where: { id },
      data: {
        campaignId: updateDonationDto.campaignId ?? existing.campaignId,
        donorId: updateDonationDto.donorId ?? existing.donorId,
        amount: updateDonationDto.amount ?? existing.amount,
        paymentMethod:
          updateDonationDto.paymentMethod ?? existing.paymentMethod,
        transactionStatus:
          updateDonationDto.transactionStatus ?? existing.transactionStatus,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.donation.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }
    return this.prisma.donation.delete({ where: { id } });
  }
}
