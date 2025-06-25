import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  type: string;

  @Column({ name: 'stripe_payment_method_id', nullable: true })
  stripePaymentMethodId?: string;

  @Column({ name: 'last_four', nullable: true })
  lastFour?: string;

  @Column({ name: 'card_brand', nullable: true })
  cardBrand?: string;

  @Column({ name: 'expiry_month', nullable: true })
  expiryMonth?: number;

  @Column({ name: 'expiry_year', nullable: true })
  expiryYear?: number;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get displayName(): string {
    if (this.type === 'card' && this.cardBrand && this.lastFour) {
      return `${this.cardBrand.toUpperCase()} ending in ${this.lastFour}`;
    }
    return this.type.toUpperCase();
  }

  get isExpired(): boolean {
    if (!this.expiryMonth || !this.expiryYear) return false;
    const now = new Date();
    const expiry = new Date(this.expiryYear, this.expiryMonth - 1);
    return now > expiry;
  }
}
