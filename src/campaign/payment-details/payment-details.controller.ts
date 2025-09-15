import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentDetailsService } from './payment-details.service';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';

@Controller('payment-details')
export class PaymentDetailsController {
  constructor(private readonly paymentDetailsService: PaymentDetailsService) {}

  @Post()
  async create(@Body() createPaymentDetailsDto: CreatePaymentDetailDto) {
    return await this.paymentDetailsService.create(createPaymentDetailsDto);
  }

  @Get()
  async findAll() {
    return await this.paymentDetailsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.paymentDetailsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDetailsDto: CreatePaymentDetailDto,
  ) {
    return await this.paymentDetailsService.update(
      +id,
      updatePaymentDetailsDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.paymentDetailsService.remove(+id);
  }
}
