import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Resource } from './resource.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  videoKey: string; // S3 key

  @Column({ nullable: true })
  thumbnailKey: string;

  @ManyToOne(() => Resource, r => r.videos, { nullable: true })
  resource: Resource;

  @CreateDateColumn()
  createdAt: Date;
}
