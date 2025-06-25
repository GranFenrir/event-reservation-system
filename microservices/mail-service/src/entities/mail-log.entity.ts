import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NotificationType } from '@event-reservation/shared';

@Entity('mail_logs')
export class MailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'template_id', nullable: true })
  templateId?: string;
  @ManyToOne('MailTemplate', { nullable: true })
  @JoinColumn({ name: 'template_id' })
  template?: any;

  @Column({ name: 'recipient_email' })
  recipientEmail: string;

  @Column({ name: 'recipient_name', nullable: true })
  recipientName?: string;

  @Column({ name: 'sender_email' })
  senderEmail: string;

  @Column({ name: 'sender_name', nullable: true })
  senderName?: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ name: 'html_body', type: 'text', nullable: true })
  htmlBody?: string;
  @Column({
    type: 'varchar',
    default: 'EMAIL',
  })
  type: string;

  @Column({ name: 'is_sent', default: false })
  isSent: boolean;

  @Column({ name: 'sent_at', nullable: true })
  sentAt?: Date;

  @Column({ name: 'failed_at', nullable: true })
  failedAt?: Date;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason?: string;

  @Column({ name: 'retry_count', default: 0 })
  retryCount: number;

  @Column({ name: 'max_retries', default: 3 })
  maxRetries: number;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @Column({ name: 'event_id', nullable: true })
  eventId?: string;

  @Column({ name: 'reservation_id', nullable: true })
  reservationId?: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get canRetry(): boolean {
    return this.retryCount < this.maxRetries && !this.isSent;
  }

  get isDelivered(): boolean {
    return this.isSent && !!this.sentAt;
  }

  get isFailed(): boolean {
    return !this.isSent && !!this.failedAt;
  }
}
