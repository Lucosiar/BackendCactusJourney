import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { JwtPayload } from '../auth/strategies/access-jwt.strategy';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@UseGuards(JwtAccessGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('cactus/:cactusId')
  @UseInterceptors(FileInterceptor('file'))
  uploadCactusImage(
    @Req() req: Request,
    @Param('cactusId', ParseIntPipe) cactusId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req.user as JwtPayload;
    return this.uploadsService.uploadCactusImage(user.sub, cactusId, file);
  }
}
