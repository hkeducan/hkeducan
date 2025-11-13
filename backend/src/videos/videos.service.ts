import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from '../entities/video.entity';
import { Repository } from 'typeorm';
@Injectable()
export class VideosService {
  constructor(@InjectRepository(Video) private repo: Repository<Video>) {}
  create(data: Partial<Video>) {
    const v = this.repo.create(data as any);
    return this.repo.save(v);
  }
  findById(id: string) { return this.repo.findOne({ where: { id } }); }
  async markProcessing(id: string) { await this.repo.update(id, { } as any); }
  async markProcessed(id: string, videoKey: string, thumbnailKey: string) {
    await this.repo.update(id, { videoKey, thumbnailKey } as any);
  }
}
