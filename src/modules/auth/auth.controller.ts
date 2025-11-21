import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/access-jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req: Request & { user: JwtPayload }) {
    const refreshToken = this.extractTokenFromHeader(req);
    return this.authService.refresh(req.user, refreshToken);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() req: Request & { user: JwtPayload }) {
    const refreshToken = this.extractTokenFromHeader(req);
    await this.authService.logout(refreshToken);
    return { message: 'Logged out' };
  }

  private extractTokenFromHeader(req: Request): string {
    const header = req.headers['authorization'];
    if (!header) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [, token] = header.split(' ');
    if (!token) {
      throw new UnauthorizedException('Refresh token missing');
    }
    return token;
  }
}
