import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Cactus, Prisma } from '@prisma/client';

import { PrismaService } from '../../config/prisma.service';
import { CreateCactusDto } from './dto/create-cactus.dto';
import { UpdateCactusDto } from './dto/update-cactus.dto';
import { WateringService } from './watering.service';

@Injectable()
export class CactusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wateringService: WateringService,
  ) {}

  async create(userId: number, dto: CreateCactusDto): Promise<Cactus> {
    const cactus = await this.prisma.cactus.create({
      data: {
        userId,
        name: dto.name,
        photoUrl: dto.photoUrl,
        region: dto.region,
        interior: dto.interior,
        type: dto.type,
        size: dto.size,
        avgTemp: dto.avgTemp,
        avgHumidity: dto.avgHumidity,
        wateringFrequencyDays: dto.wateringFrequencyDays,
        lastWateredAt: dto.lastWateredAt ? new Date(dto.lastWateredAt) : undefined,
      },
    });

    return this.wateringService.calculateNextWatering(cactus);
  }

  async findAll(userId: number): Promise<Cactus[]> {
    const isAdmin = await this.isAdmin(userId);

    return this.prisma.cactus.findMany({
      where: isAdmin ? {} : { userId },
    });
  }

  async findOne(userId: number, id: number): Promise<Cactus> {
    const cactus = await this.prisma.cactus.findUnique({ where: { id } });

    if (!cactus) {
      throw new NotFoundException('Cactus not found');
    }

    await this.ensureOwnershipOrAdmin(userId, cactus.userId);

    return cactus;
  }

  async update(userId: number, id: number, dto: UpdateCactusDto): Promise<Cactus> {
    const cactus = await this.prisma.cactus.findUnique({ where: { id } });

    if (!cactus) {
      throw new NotFoundException('Cactus not found');
    }

    await this.ensureOwnershipOrAdmin(userId, cactus.userId);

    const data: Prisma.CactusUpdateInput = {
      name: dto.name,
      photoUrl: dto.photoUrl,
      region: dto.region,
      interior: dto.interior,
      type: dto.type,
      size: dto.size,
      avgTemp: dto.avgTemp,
      avgHumidity: dto.avgHumidity,
      wateringFrequencyDays: dto.wateringFrequencyDays,
      lastWateredAt: dto.lastWateredAt ? new Date(dto.lastWateredAt) : undefined,
    };

    const updated = await this.prisma.cactus.update({
      where: { id },
      data,
    });

    return this.wateringService.calculateNextWatering(updated);
  }

  async remove(userId: number, id: number): Promise<void> {
    const cactus = await this.prisma.cactus.findUnique({ where: { id } });

    if (!cactus) {
      throw new NotFoundException('Cactus not found');
    }

    await this.ensureOwnershipOrAdmin(userId, cactus.userId);

    await this.prisma.cactus.delete({ where: { id } });
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
    return Boolean((user as unknown as { isAdmin?: boolean })?.isAdmin);
  }
}
