import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Resource } from './resource.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  parentId: string;

  @OneToMany(() => Resource, r => r.category)
  resources: Resource[];
}
