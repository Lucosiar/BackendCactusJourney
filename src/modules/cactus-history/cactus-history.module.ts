import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { CactusHistoryController } from './cactus-history.controller';
import { CactusHistoryService } from './cactus-history.service';

@Module({
  imports: [PrismaModule],
  controllers: [CactusHistoryController],
  providers: [CactusHistoryService],
})
export class CactusHistoryModule {}
