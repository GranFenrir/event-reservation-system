'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { eventsAPI, reservationsAPI, paymentsAPI } from '@/services/api';
import { Event } from '@/types/event';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

interface ReservationData {
  eventId: string;
  seats: number;
  totalAmount: number;
  [key: string]: unknown;
}

interface Reservation {
  id: string;
  totalAmount: number;
  eventId: string;
  status: string;
}

interface PaymentData {
  reservationId: string;
  amount: number;
  paymentMethod: string;
  [key: string]: unknown;
}

// Error type for API responses
interface APIError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const eventId = params.id as string;

  const [selectedSeats, setSelectedSeats] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Fetch event details
  const {
    data: event,
    isLoading,
    error,
  } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await eventsAPI.getById(eventId);
      return response.data.data as Event;
    },
    enabled: !!eventId,
  });

  // Create reservation mutation
  const createReservationMutation = useMutation<Reservation, APIError, ReservationData>({
    mutationFn: async (reservationData: ReservationData) => {
      const response = await reservationsAPI.create(reservationData);
      return response.data as Reservation;
    },
    onSuccess: reservation => {
      toast.success('Reservation created successfully!');
      processPayment(reservation);
    },
    onError: (error: APIError) => {
      const message =
        error?.response?.data?.message || 'Failed to create reservation';
      toast.error(message);
      setIsProcessingPayment(false);
    },
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const response = await paymentsAPI.process(paymentData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Payment successful! Your tickets have been confirmed.');
      queryClient.invalidateQueries({ queryKey: ['user-reservations'] });
      router.push('/reservations');
    },
    onError: (error: APIError) => {
      const message = error?.response?.data?.message || 'Payment failed';
      toast.error(message);
      setIsProcessingPayment(false);
    },
  });

  const processPayment = async (reservation: {
    id: string;
    totalAmount: number;
  }) => {
    setIsProcessingPayment(true);

    const paymentData: PaymentData = {
      reservationId: reservation.id,
      amount: reservation.totalAmount,
      paymentMethod: paymentMethod,
    };

    processPaymentMutation.mutate(paymentData);
  };

  const handleBooking = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      router.push('/login');
      return;
    }

    if (!event) return;

    if (selectedSeats > (event.totalSeats - event.soldSeats)) {
      toast.error('Not enough seats available');
      return;
    }

    setIsProcessingPayment(true);

    const reservationData: ReservationData = {
      eventId: event.id,
      seats: selectedSeats,
      totalAmount: parseFloat(event.ticketPrices?.[0]?.price || '0') * selectedSeats,
    };

    createReservationMutation.mutate(reservationData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, we could not find the event you are looking for.
          </p>
          <Link href="/events" className="text-blue-600 hover:text-blue-800">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/events"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Event Image */}
              {event.imageUrl && (
                <div className="h-64 bg-gray-200 relative">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>

                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString()} at{' '}
                      {new Date(event.startDate).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{event.venue?.name || 'TBA'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>
                      {event.totalSeats - event.soldSeats} of {event.totalSeats} seats
                      available
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Tag className="h-5 w-5 mr-2" />
                    <span>{event.category}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    About this Event
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Book Tickets
              </h2>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                                  <p className="text-2xl font-bold text-blue-600 mb-4">
                  $
                  {event.ticketPrices && event.ticketPrices.length > 0
                    ? parseFloat(event.ticketPrices[0]?.price || '0').toFixed(2)
                    : '0.00'}
                </p>
                </div>
                <p className="text-gray-600">per ticket</p>
              </div>

              {/* Seat Selection */}
              <div className="mb-6">
                <label
                  htmlFor="seats"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Number of Tickets
                </label>
                <select
                  id="seats"
                  value={selectedSeats}
                  onChange={e => setSelectedSeats(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from(
                    { length: Math.min(10, event.totalSeats - event.soldSeats) },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} ticket{i + 1 > 1 ? 's' : ''}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit Card
                  </label>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                                        $
                    {(parseFloat(event.ticketPrices?.[0]?.price || '0') * selectedSeats).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={isProcessingPayment || (event.totalSeats - event.soldSeats) === 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessingPayment
                  ? 'Processing...'
                  : (event.totalSeats - event.soldSeats) === 0
                    ? 'Sold Out'
                    : 'Book Now'}
              </button>

              {!user && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Login
                  </Link>{' '}
                  or{' '}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    register
                  </Link>{' '}
                  to book tickets
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
