import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Resource } from './entities/resource.entity';
import { Video } from './entities/video.entity';
import { Comment } from './entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { ResourcesModule } from './resources/resources.module';
import { AdminModule } from './admin/admin.module';
import * as dotenv from 'dotenv';
dotenv.config();

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'hkeducan',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'hkeducan',
  entities: [User, Category, Resource, Video, Comment],
  synchronize: true
};

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    ResourcesModule,
    AdminModule
  ],
})
export class AppModule {}
