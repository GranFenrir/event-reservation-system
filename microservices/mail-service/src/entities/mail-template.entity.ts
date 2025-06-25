import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { NotificationType } from '@event-reservation/shared';

@Entity('mail_templates')
export class MailTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

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

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  variables?: string[]; // List of template variables like {{name}}, {{eventTitle}}

  @Column({ name: 'default_sender_email', nullable: true })
  defaultSenderEmail?: string;
  @Column({ name: 'default_sender_name', nullable: true })
  defaultSenderName?: string;

  @OneToMany('MailLog', (mailLog: any) => mailLog.template)
  mailLogs: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isEnabled(): boolean {
    return this.isActive;
  }

  get hasHtml(): boolean {
    return !!this.htmlBody;
  }

  get templateVars(): string[] {
    return this.variables || [];
  }
}
