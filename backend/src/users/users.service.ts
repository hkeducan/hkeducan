import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(data: Partial<User>) {
    const u = this.repo.create(data as any);
    return this.repo.save(u);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findAll() {
    return this.repo.find();
  }

  updateStatus(id: string, status: string) {
    return this.repo.update(id, { status } as any);
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}