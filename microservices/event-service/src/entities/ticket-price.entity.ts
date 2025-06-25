import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TicketType } from '@event-reservation/shared';
import { Event } from './event.entity';

@Entity('ticket_prices')
export class TicketPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Ticket type: general, vip, student, early_bird, group, premium',
  })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  maxQuantity?: number;

  @Column({ type: 'int', default: 0 })
  soldQuantity: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.ticketPrices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get availableQuantity(): number | null {
    return this.maxQuantity ? this.maxQuantity - this.soldQuantity : null;
  }

  get isAvailable(): boolean {
    return (
      this.isActive &&
      (this.maxQuantity === null || this.soldQuantity < this.maxQuantity)
    );
  }
}
