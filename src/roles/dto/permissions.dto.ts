import { IsBoolean, IsEnum } from 'class-validator';
import { FeatureName } from 'generated/prisma';

export class PermissionDto {
  @IsEnum(FeatureName)
  featureName: FeatureName;

  @IsBoolean()
  canCreate: boolean;

  @IsBoolean()
  canRead: boolean;

  @IsBoolean()
  canUpdateOwn: boolean;

  @IsBoolean()
  canUpdateAny: boolean;

  @IsBoolean()
  canDeleteOwn: boolean;

  @IsBoolean()
  canDeleteAny: boolean;

  constructor(partial: Partial<PermissionDto>) {
    Object.assign(this, partial);
  }
}
