import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { CactusController } from './cactus.controller';
import { CactusService } from './cactus.service';
import { WateringService } from './watering.service';

@Module({
  imports: [PrismaModule],
  controllers: [CactusController],
  providers: [CactusService, WateringService],
})
export class CactusModule {}
