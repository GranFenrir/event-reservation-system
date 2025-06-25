import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RefundStatus } from '@event-reservation/shared';
import { Payment } from './payment.entity';

@Entity('refunds')
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'payment_id' })
  paymentId: string;

  @ManyToOne(() => Payment, payment => payment.refunds)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;
  @Column({
    type: 'varchar',
    default: 'PENDING',
  })
  status: string;

  @Column({ name: 'stripe_refund_id', nullable: true })
  stripeRefundId?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ name: 'processed_at', nullable: true })
  processedAt?: Date;

  @Column({ name: 'failed_at', nullable: true })
  failedAt?: Date;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isSuccessful(): boolean {
    return this.status === RefundStatus.COMPLETED;
  }

  get isFailed(): boolean {
    return this.status === RefundStatus.FAILED;
  }

  get isPending(): boolean {
    return this.status === RefundStatus.PENDING;
  }
}
