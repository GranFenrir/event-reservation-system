import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 100 })
  type: string; // 'sales', 'events', 'users', 'payments', etc.

  @Column('text', { nullable: true })
  description: string;

  @Column('json', { nullable: true })
  parameters: Record<string, any>;

  @Column('json', { nullable: true })
  data: Record<string, any>;

  @Column({ length: 50, default: 'PENDING' })
  status: string; // 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'

  @Column({ length: 255, nullable: true })
  file_path: string;

  @Column('text', { nullable: true })
  error_message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
