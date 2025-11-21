import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../config/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class CactusHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async addEntry(userId: number, cactusId: number, dto: CreateHistoryDto) {
    const cactus = await this.prisma.cactus.findUnique({ where: { id: cactusId } });

    if (!cactus) {
      throw new NotFoundException('Cactus not found');
    }

    await this.ensureOwnershipOrAdmin(userId, cactus.userId);

    return this.prisma.cactusHistory.create({
      data: {
        cactusId,
        photoUrl: dto.photoUrl,
        comment: dto.comment,
      },
    });
  }

  async getHistory(userId: number, cactusId: number) {
    const cactus = await this.prisma.cactus.findUnique({ where: { id: cactusId } });

    if (!cactus) {
      throw new NotFoundException('Cactus not found');
    }

    await this.ensureOwnershipOrAdmin(userId, cactus.userId);

    return this.prisma.cactusHistory.findMany({
      where: { cactusId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async ensureOwnershipOrAdmin(userId: number, resourceUserId: number): Promise<void> {
    const isAdmin = await this.isAdmin(userId);
    const isOwner = userId === resourceUserId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Access denied');
    }
  }

  private async isAdmin(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return Boolean(user?.isAdmin);
  }
}
