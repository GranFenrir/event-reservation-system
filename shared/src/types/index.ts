import {
  EventStatus,
  TicketType,
  SeatStatus,
  ReservationStatus,
  PaymentStatus,
  PaymentMethod,
  UserRole,
  NotificationType,
} from '../enums';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event extends BaseEntity {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: Venue;
  organizer: User;
  status: EventStatus;
  images: string[];
  maxCapacity: number;
  currentReservations: number;
  ticketTypes: TicketType[];
  tags: string[];
}

export interface Venue extends BaseEntity {
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  seatMap: SeatMap;
  facilities: string[];
}

export interface SeatMap {
  sections: Section[];
  layout: string; // JSON string representing the visual layout
}

export interface Section {
  id: string;
  name: string;
  ticketType: TicketType;
  price: number;
  seats: Seat[];
}

export interface Seat {
  id: string;
  row: string;
  number: string;
  status: SeatStatus;
  price: number;
  ticketType: TicketType;
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: NotificationType[];
  language: string;
  timezone: string;
}

export interface Reservation extends BaseEntity {
  event: Event;
  user: User;
  seats: Seat[];
  status: ReservationStatus;
  totalAmount: number;
  expiresAt: Date;
  payment?: Payment;
  tickets: Ticket[];
}

export interface Payment extends BaseEntity {
  reservation: Reservation;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  processedAt?: Date;
  refundedAt?: Date;
}

export interface Ticket extends BaseEntity {
  reservation: Reservation;
  seat: Seat;
  qrCode: string;
  isUsed: boolean;
  usedAt?: Date;
}

export interface Notification extends BaseEntity {
  user: User;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: Date;
}

// DTOs - Using interfaces instead of classes to avoid decorator initialization issues
export interface CreateEventDto {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venueId: string;
  images?: string[];
  maxCapacity: number;
  ticketTypes: TicketType[];
  tags?: string[];
}

export interface CreateReservationDto {
  eventId: string;
  seatIds: string[];
  userId: string;
}

export interface ProcessPaymentDto {
  reservationId: string;
  method: PaymentMethod;
  paymentToken?: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Event Messages for Kafka
export interface EventMessage {
  eventType: string;
  timestamp: Date;
  data: any;
  correlationId: string;
}

export interface ReservationCreatedMessage extends EventMessage {
  eventType: 'reservation.created';
  data: {
    reservationId: string;
    userId: string;
    eventId: string;
    seatIds: string[];
    totalAmount: number;
  };
}

export interface PaymentProcessedMessage extends EventMessage {
  eventType: 'payment.processed';
  data: {
    paymentId: string;
    reservationId: string;
    status: PaymentStatus;
    amount: number;
  };
}

export interface TicketGeneratedMessage extends EventMessage {
  eventType: 'ticket.generated';
  data: {
    ticketId: string;
    reservationId: string;
    userId: string;
    qrCode: string;
  };
}
