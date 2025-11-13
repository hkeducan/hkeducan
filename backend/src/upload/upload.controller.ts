import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('presign')
  async presign(@Body() body: { name: string; mimeType: string; kind: 'file' | 'video' }) {
    const key = `${body.kind}s/${Date.now()}_${Math.random().toString(36).slice(2, 10)}_${body.name}`;
    const url = await this.uploadService.getPresignedUrl(key, body.mimeType);
    return { key, url, objectUrl: this.uploadService.getObjectUrl(key) };
  }
}