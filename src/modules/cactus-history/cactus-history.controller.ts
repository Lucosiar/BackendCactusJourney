import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { JwtPayload } from '../auth/strategies/access-jwt.strategy';
import { CreateHistoryDto } from './dto/create-history.dto';
import { CactusHistoryService } from './cactus-history.service';

@Controller('history')
@UseGuards(JwtAccessGuard)
export class CactusHistoryController {
  constructor(private readonly cactusHistoryService: CactusHistoryService) {}

  @Post(':cactusId')
  addEntry(
    @Req() req: Request,
    @Param('cactusId', ParseIntPipe) cactusId: number,
    @Body() dto: CreateHistoryDto,
  ) {
    const user = req.user as JwtPayload;
    return this.cactusHistoryService.addEntry(user.sub, cactusId, dto);
  }

  @Get(':cactusId')
  getHistory(@Req() req: Request, @Param('cactusId', ParseIntPipe) cactusId: number) {
    const user = req.user as JwtPayload;
    return this.cactusHistoryService.getHistory(user.sub, cactusId);
  }
}
