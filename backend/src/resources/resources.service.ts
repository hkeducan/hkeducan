import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from '../entities/resource.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResourcesService {
  constructor(@InjectRepository(Resource) private repo: Repository<Resource>) {}

  list() {
    return this.repo.find({ relations: ['category', 'videos', 'comments'] });
  }

  get(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['category', 'videos', 'comments'] });
  }

  create(data: Partial<Resource>) {
    const r = this.repo.create(data as any);
    return this.repo.save(r);
  }

  update(id: string, data: Partial<Resource>) {
    return this.repo.update(id, data as any);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}