export interface Event {
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
