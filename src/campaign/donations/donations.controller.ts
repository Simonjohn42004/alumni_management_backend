import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Logger,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { CreateDonationDto } from './dto/create-donation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/roles.guard';
import { GenericOwnershipGuard } from 'src/auth/guards/generic-ownership.guard';
import { FeatureName } from 'generated/prisma/client';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';

export class VerifyPaymentDto {
  orderId: string;
  paymentId: string;
  signature: string;
  donationId: number;
}

@ApiTags('donations')
@ApiBearerAuth()
@Controller('donations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DonationsController {
  private readonly logger = new Logger(DonationsController.name);

  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @RequirePermissions({ feature: FeatureName.donations, action: 'create' })
  async create(@Body() createDonationDto: CreateDonationDto) {
    // Step 1: Create donation with PENDING status
    const donation = await this.donationsService.create(createDonationDto);

    try {
      // Step 2: Create Razorpay order for the donation amount
      const order = await this.donationsService.createRazorpayOrder(
        donation.amount.toNumber(),
        `donation_${donation.id}`,
      );

      return {
        donation,
        razorpayOrder: order,
      };
    } catch (error) {
      this.logger.error('Error creating Razorpay order', error);
      throw new BadRequestException('Failed to create payment order');
    }
  }

  @Post('verify')
  async verifyPayment(@Body() verifyDto: VerifyPaymentDto) {
    const { orderId, paymentId, signature, donationId } = verifyDto;
    this.logger.log(`Verifying payment for donation ID ${donationId}`);

    const verificationResult =
      await this.donationsService.processDonationVerification(
        orderId,
        paymentId,
        signature,
        donationId,
      );

    if (!verificationResult.success) {
      throw new BadRequestException('Invalid payment signature');
    }

    return { success: true };
  }

  @Get()
  @RequirePermissions({ feature: FeatureName.donations, action: 'read' })
  async findAll() {
    return await this.donationsService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ feature: FeatureName.donations, action: 'read' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.donationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({ feature: FeatureName.donations, action: 'updateOwn' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return await this.donationsService.update(id, updateDonationDto);
  }

  @Delete(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({ feature: FeatureName.donations, action: 'deleteOwn' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.donationsService.remove(id);
  }
}
