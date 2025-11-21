import { Injectable } from '@nestjs/common';
import { Cactus } from '@prisma/client';

import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class WateringService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateNextWatering(cactus: Cactus): Promise<Cactus> {
    const nextWaterAt = this.computeNextWaterDate(cactus);

    return this.prisma.cactus.update({
      where: { id: cactus.id },
      data: { nextWaterAt },
    });
  }

  private computeNextWaterDate(cactus: Cactus): Date | null {
    const { wateringFrequencyDays, lastWateredAt, interior, avgHumidity, avgTemp } = cactus;

    if (!wateringFrequencyDays) {
      return null;
    }

    let days = wateringFrequencyDays;

    if (interior) {
      days += 2;
    }

    if (typeof avgHumidity === 'number' && avgHumidity > 80) {
      days += 3;
    }

    if (typeof avgTemp === 'number' && avgTemp > 30) {
      days -= 2;
    }

    if (this.isWinter()) {
      days += 4;
    }

    if (days < 1) {
      days = 1;
    }

    const baseDate = lastWateredAt ?? new Date();
    const nextWaterAt = new Date(baseDate);
    nextWaterAt.setDate(baseDate.getDate() + days);

    return nextWaterAt;
  }

  private isWinter(): boolean {
    const month = new Date().getMonth();
    return month === 11 || month === 0 || month === 1;
  }
}
