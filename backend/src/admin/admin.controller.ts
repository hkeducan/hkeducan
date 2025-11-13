import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  @Roles('ADMIN')
  @Get('users')
  async listUsers() {
    return this.userRepo.find();
  }

  @Roles('ADMIN')
  @Put('users/:id/enable')
  async enableUser(@Param('id') id: string) {
    await this.userRepo.update(id, { status: 'ENABLED' });
    return { ok: true };
  }

  @Roles('ADMIN')
  @Put('users/:id/disable')
  async disableUser(@Param('id') id: string) {
    await this.userRepo.update(id, { status: 'DISABLED' });
    return { ok: true };
  }
}
