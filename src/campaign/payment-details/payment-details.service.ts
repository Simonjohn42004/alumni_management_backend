import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';

@Injectable()
export class PaymentDetailsService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createPaymentDetailsDto: CreatePaymentDetailDto) {
    return this.prisma.paymentDetails.create({
      data: {
        donationId: createPaymentDetailsDto.donationId,
        paymentProvider: createPaymentDetailsDto.paymentProvider,
        paymentStatus: createPaymentDetailsDto.paymentStatus,
        transactionDate: createPaymentDetailsDto.transactionDate ?? new Date(),
        paymentReference: createPaymentDetailsDto.paymentReference,
      },
    });
  }

  async findAll() {
    return this.prisma.paymentDetails.findMany({
      include: { donation: true },
    });
  }

  async findOne(id: number) {
    const paymentDetail = await this.prisma.paymentDetails.findUnique({
      where: { id },
      include: { donation: true },
    });
    if (!paymentDetail) {
      throw new NotFoundException(`PaymentDetail with ID ${id} not found`);
    }
    return paymentDetail;
  }

  async update(id: number, updatePaymentDetailsDto: CreatePaymentDetailDto) {
    const existing = await this.prisma.paymentDetails.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`PaymentDetail with ID ${id} not found`);
    }

    return this.prisma.paymentDetails.update({
      where: { id },
      data: {
        donationId: updatePaymentDetailsDto.donationId ?? existing.donationId,
        paymentProvider:
          updatePaymentDetailsDto.paymentProvider ?? existing.paymentProvider,
        paymentStatus:
          updatePaymentDetailsDto.paymentStatus ?? existing.paymentStatus,
        transactionDate:
          updatePaymentDetailsDto.transactionDate ?? existing.transactionDate,
        paymentReference:
          updatePaymentDetailsDto.paymentReference ?? existing.paymentReference,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.paymentDetails.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`PaymentDetail with ID ${id} not found`);
    }
    return this.prisma.paymentDetails.delete({ where: { id } });
  }
}
