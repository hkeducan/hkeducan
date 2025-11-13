import { Controller, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { PresignDto } from '../dto/presign.dto';
import { CreateVideoDto } from '../dto/create-video.dto';
import { ValidationPipe } from '@nestjs/common';
@Controller('videos')
export class VideosController {
  constructor(private videosService: VideosService, @InjectQueue('ffmpeg') private ffmpegQueue: Queue) {}

  @UseGuards(JwtAuthGuard)
  @Roles('CREATOR','ADMIN')
  @Post()
  async create(@Body(new ValidationPipe()) body: CreateVideoDto, @Request() req) {
    // basic checks
    if (!body.key) throw new BadRequestException('key is required');
    // create DB record with original key set in some field (videoKey temporarily holds original)
    const userId = req.user.userId;
    const v = await this.videosService.create({ title: body.title, resource: body.resourceId ? { id: body.resourceId } as any : null, videoKey: body.key });
    // enqueue job for ffmpeg processing
    await this.ffmpegQueue.add({ key: body.key, videoId: v.id }, { attempts: 3, backoff: 5000 });
    return { id: v.id, status: 'queued' };
  }
}
