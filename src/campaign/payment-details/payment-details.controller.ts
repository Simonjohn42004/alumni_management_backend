import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentDetailsService } from './payment-details.service';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/roles.guard';
import { GenericOwnershipGuard } from 'src/auth/guards/generic-ownership.guard';
import { FeatureName } from 'generated/prisma/client';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';

@ApiTags('payment-details')
@ApiBearerAuth()
@Controller('payment-details')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaymentDetailsController {
  constructor(private readonly paymentDetailsService: PaymentDetailsService) {}

  @Post()
  @RequirePermissions({ feature: FeatureName.paymentDetails, action: 'create' })
  async create(@Body() createPaymentDetailsDto: CreatePaymentDetailDto) {
    return await this.paymentDetailsService.create(createPaymentDetailsDto);
  }

  @Get()
  @RequirePermissions({ feature: FeatureName.paymentDetails, action: 'read' })
  async findAll() {
    return await this.paymentDetailsService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ feature: FeatureName.paymentDetails, action: 'read' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.paymentDetailsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({
    feature: FeatureName.paymentDetails,
    action: 'updateOwn',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDetailsDto: CreatePaymentDetailDto,
  ) {
    return await this.paymentDetailsService.update(id, updatePaymentDetailsDto);
  }

  @Delete(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({
    feature: FeatureName.paymentDetails,
    action: 'deleteOwn',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.paymentDetailsService.remove(id);
  }
}
