import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EventStatus, TicketType } from '@event-reservation/shared';
import { Venue } from './venue.entity';
import { TicketPrice } from './ticket-price.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'datetime' })
  saleStartDate: Date;

  @Column({ type: 'datetime' })
  saleEndDate: Date;

  @Column({ type: 'varchar', length: 100 })
  category: string;
  @Column({
    type: 'varchar',
    length: 50,
    default: 'draft',
    comment: 'Event status: draft, published, live, ended, cancelled',
  })
  status: string;

  @Column({ type: 'int' })
  totalSeats: number;

  @Column({ type: 'int', default: 0 })
  soldSeats: number;

  @Column({ type: 'uuid' })
  venueId: string;

  @ManyToOne(() => Venue, (venue) => venue.events)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @OneToMany(() => TicketPrice, (ticketPrice) => ticketPrice.event, {
    cascade: true,
  })
  ticketPrices: TicketPrice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get availableSeats(): number {
    return this.totalSeats - this.soldSeats;
  }
  get isActive(): boolean {
    return this.status === EventStatus.PUBLISHED;
  }

  get isSaleActive(): boolean {
    const now = new Date();
    return (
      this.isActive &&
      now >= this.saleStartDate &&
      now <= this.saleEndDate &&
      this.availableSeats > 0
    );
  }
}
