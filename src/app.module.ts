import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { PrismaDatabaseModule } from './prisma-database/prisma-database.module';
import { EducationModule } from './education/education.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [ProfileModule, PrismaDatabaseModule, EducationModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
