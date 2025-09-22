import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaDatabaseModule } from 'src/prisma-database/prisma-database.module';
import { AuthModule } from 'src/auth/auth.module';
// import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaDatabaseModule, AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
