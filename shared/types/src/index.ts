// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  password?: string; // Optional since it shouldn't be returned in responses
  createdAt: Date;
  updatedAt: Date;
  toObject?: () => any; // For compatibility with some database models
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phone?: string;
  username?: string;
  password?: string;
  dateOfBirth?: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  avatar?: string;
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    privacy?: {
      profilePublic?: boolean;
      showEmail?: boolean;
      showPhone?: boolean;
    };
  };
  updatedAt?: Date;
}

export interface RegisterDto extends CreateUserDto {
  username: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  ORGANIZER = 'organizer'
}

// Event related types
export interface Event {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizer?: User;
  categoryId: string;
  category?: EventCategory;
  venue: string;
  address: string;
  startDate: Date;
  endDate: Date;
  maxCapacity: number;
  availableSeats: number;
  price: number;
  currency: string;
  status: EventStatus;
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDto {
  title: string;
  description: string;
  categoryId: string;
  venue: string;
  address: string;
  startDate: Date;
  endDate: Date;
  maxCapacity: number;
  price: number;
  currency: string;
  imageUrl?: string;
  tags?: string[];
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Reservation related types
export interface Reservation {
  id: string;
  userId: string;
  user?: User;
  eventId: string;
  event?: Event;
  numberOfSeats: number;
  totalAmount: number;
  currency: string;
  status: ReservationStatus;
  reservationCode: string;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  reservedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationDto {
  eventId: string;
  numberOfSeats: number;
}

export interface UpdateReservationDto {
  status?: ReservationStatus;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Notification related types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

export enum NotificationType {
  RESERVATION_CONFIRMED = 'reservation_confirmed',
  RESERVATION_CANCELLED = 'reservation_cancelled',
  EVENT_REMINDER = 'event_reminder',
  EVENT_UPDATED = 'event_updated',
  EVENT_CANCELLED = 'event_cancelled',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EventSearchQuery extends PaginationQuery {
  title?: string;
  categoryId?: string;
  venue?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
}

// Kafka Event types
export interface KafkaEvent<T = any> {
  eventType: string;
  eventId: string;
  timestamp: Date;
  data: T;
  userId?: string;
}

export interface UserCreatedEvent {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface EventCreatedEvent {
  eventId: string;
  title: string;
  organizerId: string;
  startDate: Date;
  endDate: Date;
}

export interface ReservationCreatedEvent {
  reservationId: string;
  userId: string;
  eventId: string;
  numberOfSeats: number;
  totalAmount: number;
}

export interface ReservationConfirmedEvent {
  reservationId: string;
  userId: string;
  eventId: string;
  paymentId: string;
}

export interface PaymentCompletedEvent {
  paymentId: string;
  reservationId: string;
  userId: string;
  amount: number;
  currency: string;
}
