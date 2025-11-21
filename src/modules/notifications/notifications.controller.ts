import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { SaveTokenDto } from './dto/save-token.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('token')
  @UseGuards(JwtAccessGuard)
  saveToken(@Req() req: Request, @Body() dto: SaveTokenDto) {
    const user = req.user as { sub: number };
    return this.notificationsService.saveToken(user.sub, dto.token, dto.platform);
  }
}
