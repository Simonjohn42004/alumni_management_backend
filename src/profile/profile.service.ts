import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { Prisma, Users } from 'generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createProfileDto: CreateUserDto): Promise<Users> {
    const prismaInput: Prisma.UsersCreateInput = {
      id: createProfileDto.id,
      roleId: createProfileDto.roleId,
      fullName: createProfileDto.fullName,
      email: createProfileDto.email,
      passwordHash: createProfileDto.passwordHash,
      phoneNumber: createProfileDto.phoneNumber,
      profilePicture: createProfileDto.profilePicture,
      graduationYear: createProfileDto.graduationYear,
      currentPosition: createProfileDto.currentPosition,
      createdAt: createProfileDto.createdAt ?? new Date(),
      collegeId: createProfileDto.collegeId,
      department: createProfileDto.department,
      skillSets: createProfileDto.skillSets,
    };

    return await this.prisma.users.create({
      data: prismaInput,
    });
  }

  async findAll(): Promise<Users[]> {
    return await this.prisma.users.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        educations: true,
        posts: true,
        postComments: true,
        postTagsBy: true,
        postTagsTagged: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async update(id: string, updateProfileDto: UpdateUserDto): Promise<Users> {
    const prismaUpdateInput: Prisma.UsersUpdateInput = {
      ...updateProfileDto,
    };

    return await this.prisma.users.update({
      where: { id },
      data: prismaUpdateInput,
    });
  }

  async remove(id: string): Promise<Users> {
    return await this.prisma.users.delete({
      where: { id },
    });
  }
}
