import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SeatStatus } from '@event-reservation/shared';
import { Venue } from './venue.entity';

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  row: string;

  @Column({ type: 'varchar', length: 50 })
  number: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  section?: string;
  @Column({
    type: 'varchar',
    length: 50,
    default: 'available',
    comment: 'Seat status: available, reserved, sold, blocked',
  })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  basePrice?: number;

  @Column({ type: 'uuid' })
  venueId: string;

  @ManyToOne(() => Venue, (venue) => venue.seats)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property for display
  get displayName(): string {
    return this.section
      ? `${this.section}-${this.row}${this.number}`
      : `${this.row}${this.number}`;
  }
}
