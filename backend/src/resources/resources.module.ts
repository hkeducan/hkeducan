import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from '../entities/resource.entity';
import { Comment } from '../entities/comment.entity';
import { Video } from '../entities/video.entity';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Resource, Comment, Video])],
  providers: [ResourcesService, UploadService],
  controllers: [ResourcesController],
  exports: [ResourcesService],
})
export class ResourcesModule {}
