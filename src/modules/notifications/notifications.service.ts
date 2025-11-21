import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async saveToken(userId: number, token: string, platform?: string) {
    return this.prisma.notificationToken.upsert({
      where: { token },
      update: { userId, platform },
      create: { token, platform, userId },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async sendWateringReminders(): Promise<void> {
    const now = new Date();
    const cutoff = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const cacti = await this.prisma.cactus.findMany({
      where: {
        nextWaterAt: {
          not: null,
          lte: cutoff,
        },
      },
      include: {
        user: {
          include: {
            notificationTokens: true,
          },
        },
      },
    });

    for (const cactus of cacti) {
      const tokens = cactus.user.notificationTokens;

      for (const token of tokens) {
        await this.sendNotification(
          token.token,
          `Time to water your cactus${cactus.name ? ` ${cactus.name}` : ''}!`,
        );
      }
    }
  }

  private async sendNotification(token: string, message: string): Promise<void> {
    this.logger.log(`Sending notification to ${token}: ${message}`);
    // Integrate with push provider here (e.g., FCM, APNs, etc.)
  }
}
