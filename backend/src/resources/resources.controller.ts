import { Controller, Get, Param, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Repository } from 'typeorm';
import { Resource } from '../entities/resource.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';

@Controller('resources')
export class ResourcesController {
  constructor(
    @InjectRepository(Resource) private readonly resourceRepo: Repository<Resource>,
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>
  ) {}

  @Get()
  async list() {
    return this.resourceRepo.find({ relations: ['category', 'videos'] });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.resourceRepo.findOne({ where: { id }, relations: ['category', 'videos', 'comments'] });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async comment(@Param('id') id: string, @Body() body: { text: string, parentId?: string }, @Request() req) {
    const c = this.commentRepo.create({
      text: body.text,
      parentId: body.parentId,
      resource: { id },
      author: { id: req.user.userId } as any
    });
    return this.commentRepo.save(c);
  }
}
