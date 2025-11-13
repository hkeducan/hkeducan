import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { Video } from './video.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  fileKey: string; // S3 object key

  @Column()
  fileName: string;

  @Column()
  mimeType: string;

  @ManyToOne(() => Category, c => c.resources)
  category: Category;

  @OneToMany(() => Comment, c => c.resource)
  comments: Comment[];

  @OneToMany(() => Video, v => v.resource)
  videos: Video[];

  @CreateDateColumn()
  createdAt: Date;
}
