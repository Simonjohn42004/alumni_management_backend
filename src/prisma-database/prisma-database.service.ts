import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaDatabaseService
  extends PrismaClient
  implements OnModuleInit
{
  onModuleInit() {
    this.$connect;
  }
}
