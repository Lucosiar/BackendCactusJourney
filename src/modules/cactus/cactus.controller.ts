import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { JwtPayload } from '../auth/strategies/access-jwt.strategy';
import { CreateCactusDto } from './dto/create-cactus.dto';
import { UpdateCactusDto } from './dto/update-cactus.dto';
import { CactusService } from './cactus.service';

@Controller('cactus')
@UseGuards(JwtAccessGuard)
export class CactusController {
  constructor(private readonly cactusService: CactusService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateCactusDto) {
    const user = req.user as JwtPayload;
    return this.cactusService.create(user.sub, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.cactusService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as JwtPayload;
    return this.cactusService.findOne(user.sub, id);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCactusDto,
  ) {
    const user = req.user as JwtPayload;
    return this.cactusService.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as JwtPayload;
    return this.cactusService.remove(user.sub, id);
  }
}
