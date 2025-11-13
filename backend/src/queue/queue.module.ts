import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FfmpegProcessor } from './ffmpeg.processor';
import { UploadModule } from '../upload/upload.module';
import { VideosModule } from '../videos/videos.module';
@Module({
  imports: [
    BullModule.registerQueue({ name: 'ffmpeg' }),
    UploadModule,
    VideosModule,
  ],
  providers: [FfmpegProcessor],
})
export class QueueModule {}
