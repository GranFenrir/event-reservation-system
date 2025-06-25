export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum TicketType {
  VIP = 'vip',
  PREMIUM = 'premium',
  STANDARD = 'standard',
  ECONOMY = 'economy',
}

export enum SeatStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  LOCKED = 'locked',
  SOLD = 'sold',
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentType {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  DIGITAL_WALLET = 'digital_wallet',
}

export enum RefundStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  CUSTOMER = 'customer',
}

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

export enum ReportType {
  DAILY_SALES = 'daily_sales',
  MONTHLY_SALES = 'monthly_sales',
  EVENT_PERFORMANCE = 'event_performance',
  USER_ANALYTICS = 'user_analytics',
}
