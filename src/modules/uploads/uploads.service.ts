import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCactusImage(
    userId: number,
    cactusId: number,
    file?: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const cactus = await this.prisma.cactus.findUnique({ where: { id: cactusId } });

    if (!cactus) {
      throw new NotFoundException('Cactus not found');
    }

    await this.ensureOwnershipOrAdmin(userId, cactus.userId);

    const uploadDir = path.join(process.cwd(), 'uploads', 'cactus');
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const filename = `${uuidv4()}.webp`;
    const filePath = path.join(uploadDir, filename);

    await sharp(file.buffer).webp({ quality: 90 }).toFile(filePath);

    const publicUrl = path.posix.join('/uploads', 'cactus', filename);

    await this.prisma.cactus.update({
      where: { id: cactusId },
      data: { photoUrl: publicUrl },
    });

    return { url: publicUrl };
  }

  private async ensureOwnershipOrAdmin(userId: number, resourceUserId: number): Promise<void> {
    const isAdmin = await this.isAdmin(userId);
    const isOwner = userId === resourceUserId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Access denied');
    }
  }

  private async isAdmin(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return Boolean(user?.isAdmin);
  }
}
