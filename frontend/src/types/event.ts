export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  saleStartDate: string;
  saleEndDate: string;
  category: string;
  status: string;
  totalSeats: number;
  soldSeats: number;
  venueId: string;
  createdAt: string;
  updatedAt: string;
  venue: {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    capacity: number;
    imageUrl?: string;
  };
  ticketPrices: TicketPrice[];
}

export interface TicketPrice {
  id: string;
  type: string;
  name: string;
  description: string;
  price: string;
  maxQuantity?: number;
  soldQuantity: number;
  isActive: boolean;
}

// Legacy interface for backward compatibility
export interface LegacyEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  category: string;
  status: string;
  image?: string;
}

export interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  seats: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
