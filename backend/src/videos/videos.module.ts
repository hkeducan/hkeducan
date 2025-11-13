import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '../entities/video.entity';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { BullModule } from '@nestjs/bull';
import { UploadModule } from '../upload/upload.module';
import { QueueModule } from '../queue/queue.module';
@Module({
  imports: [TypeOrmModule.forFeature([Video]), BullModule, UploadModule, QueueModule],
  providers: [VideosService],
  controllers: [VideosController],
  exports: [VideosService],
})
export class VideosModule {}
