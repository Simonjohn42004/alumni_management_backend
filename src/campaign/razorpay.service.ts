import { Injectable, Logger } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private razorpay: Razorpay;
  private readonly keyId = 'rzp_test_RKXIYV3w26cHaJ';
  private readonly keySecret = 'q0eiMfZD6lEtc3afVjZrqa78';

  constructor() {
    this.razorpay = new Razorpay({
      key_id: this.keyId,
      key_secret: this.keySecret,
    });
  }

  async createOrder(amount: number, currency = 'INR', receipt?: string) {
    try {
      const options = {
        amount: amount * 100,
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      };
      this.logger.debug('Creating Razorpay order:', options);
      return await this.razorpay.orders.create(options);
    } catch (error) {
      this.logger.error('Error creating order:', error);
      throw error;
    }
  }

  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    const isValid = generatedSignature === signature;
    this.logger.log(`Payment verification for order ${orderId}: ${isValid}`);
    return isValid;
  }
}
