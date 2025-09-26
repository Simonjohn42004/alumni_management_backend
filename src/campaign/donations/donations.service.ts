import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { RazorpayService } from '../razorpay.service';

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);

  constructor(
    private readonly prisma: PrismaDatabaseService,
    private readonly razorpayService: RazorpayService,
  ) {}

  async create(createDonationDto: CreateDonationDto) {
    this.logger.log(`Creating donation for campaign ${createDonationDto.campaignId}, donor ${createDonationDto.donorId}`);

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

  async createRazorpayOrder(amount: number, receipt: string) {
    this.logger.debug(`Creating Razorpay order for amount ${amount}, receipt ${receipt}`);
    return this.razorpayService.createOrder(amount, 'INR', receipt);
  }

  async processDonationVerification(
    orderId: string,
    paymentId: string,
    signature: string,
    donationId: number,
  ) {
    this.logger.log(`Verifying payment with orderId: ${orderId}, paymentId: ${paymentId}`);

    if (
      this.razorpayService.verifyPaymentSignature(orderId, paymentId, signature)
    ) {
      await this.prisma.donation.update({
        where: { id: donationId },
        data: { transactionStatus: 'COMPLETED' },
      });

      await this.prisma.paymentDetails.create({
        data: {
          donationId,
          paymentProvider: 'RAZORPAY',
          paymentStatus: 'SUCCESS',
          paymentReference: paymentId,
        },
      });

      const donation = await this.prisma.donation.findUnique({
        where: { id: donationId },
        include: { campaign: true },
      });

      if (!donation || !donation.campaign) {
        this.logger.error(`Donation or campaign not found for donationId ${donationId}`);
        throw new NotFoundException('Donation or campaign not found');
      }

      await this.prisma.campaign.update({
        where: { id: donation?.campaignId },
        data: { currentAmount: { increment: donation.amount } },
      });

      // Optionally: Issue rewards or receipts, log other events here

      return { success: true };
    }

    // Failed signature verification
    this.logger.warn(`Payment signature verification failed for donation ID ${donationId}`);

    await this.prisma.donation.update({
      where: { id: donationId },
      data: { transactionStatus: 'FAILED' },
    });

    return { success: false, reason: 'Signature failed' };
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
        paymentMethod: updateDonationDto.paymentMethod ?? existing.paymentMethod,
        transactionStatus: updateDonationDto.transactionStatus ?? existing.transactionStatus,
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
