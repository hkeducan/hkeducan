import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Resource } from './resource.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToOne(() => Resource, r => r.comments)
  resource: Resource;

  @Column({ nullable: true })
  parentId: string; // 支援回覆

  @CreateDateColumn()
  createdAt: Date;
}
