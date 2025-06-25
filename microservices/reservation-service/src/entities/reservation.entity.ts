import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ReservationStatus } from '@event-reservation/shared';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'event_id' })
  eventId: string;
  @Column({
    type: 'varchar',
    default: 'PENDING',
  })
  status: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'confirmed_at', nullable: true })
  confirmedAt: Date | null;

  @Column({ name: 'cancelled_at', nullable: true })
  cancelledAt: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => ReservationItem, item => item.reservation, {
    cascade: true,
    eager: true,
  })
  items: ReservationItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Virtual properties
  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
  get isActive(): boolean {
    return this.status === 'PENDING' && !this.isExpired;
  }

  get totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

@Entity('reservation_items')
export class ReservationItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reservation_id' })
  reservationId: string;

  @Column({ name: 'seat_id', nullable: true })
  seatId: string | null;

  @Column({ name: 'ticket_type' })
  ticketType: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => Reservation, reservation => reservation.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
