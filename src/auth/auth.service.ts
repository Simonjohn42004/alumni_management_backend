import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AuthEntity, UserPermission } from './entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaDatabaseService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string, password: string): Promise<any> {
    console.log('[validateUser] Lookup userId:', userId);

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            Permissions: true,
          },
        },
      },
    });

    if (!user) {
      console.log('[validateUser] User not found:', userId);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('[validateUser] User found, verifying password');
    const storedHash = user.passwordHash.startsWith('$2y$')
      ? user.passwordHash.replace(/^\$2y\$/, '$2b$')
      : user.passwordHash;

    console.log(
      '[validateUser] comparing password and hashedPassword',
      password,
      storedHash,
    );

    const isPasswordValid = await bcrypt.compare(password, storedHash);

    if (!isPasswordValid) {
      console.log('[validateUser] Password invalid for user:', userId);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('[validateUser] Password valid, returning user info');

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<AuthEntity> {
    console.log('[login] Login attempt for userId:', loginDto.userId);

    const user = await this.validateUser(loginDto.userId, loginDto.password);

    console.log('[login] User validated:', user.id);

    const permissions: UserPermission[] = user.role.Permissions.map(
      (permission) => {
        console.log('[login] Processing permission:', permission.featureName);
        return {
          featureName: permission.featureName,
          canCreate: permission.canCreate,
          canRead: permission.canRead,
          canUpdateOwn: permission.canUpdateOwn,
          canUpdateAny: permission.canUpdateAny,
          canDeleteOwn: permission.canDeleteOwn,
          canDeleteAny: permission.canDeleteAny,
        };
      },
    );

    console.log('[login] Permissions transformed:', permissions);

    const payload = {
      sub: user.id,
      userId: user.id,
      roleId: user.roleId,
      permissions: permissions,
    };

    console.log('[login] JWT payload prepared:', payload);

    const accessToken = await this.jwtService.signAsync(payload);

    console.log('[login] JWT access token generated');

    return {
      accessToken: accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId,
        permissions: permissions,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }
}
