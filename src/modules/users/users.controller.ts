import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { JwtPayload } from '../auth/strategies/access-jwt.strategy';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAccessGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.usersService.getProfile(user.sub);
  }

  @Patch('me')
  updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req.user as JwtPayload;
    return this.usersService.updateProfile(user.sub, dto);
  }

  @Get(':id')
  getUserById(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as JwtPayload;
    return this.usersService.getUserById(user.sub, id);
  }
}
