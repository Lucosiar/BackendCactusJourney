import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../config/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(
    userId: number,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const data: Prisma.UserUpdateInput = {};

    if (dto.email) {
      data.email = dto.email;
    }

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.sanitizeUser(updatedUser);
  }

  async getUserById(
    adminUserId: number,
    userId: number,
  ): Promise<Omit<User, 'passwordHash'>> {
    const adminUser = await this.prisma.user.findUnique({ where: { id: adminUserId } });

    if (!adminUser?.isAdmin) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
