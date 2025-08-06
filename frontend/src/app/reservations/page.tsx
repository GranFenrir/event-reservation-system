'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Ticket, Download, X } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { reservationsAPI } from '@/services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Reservation {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  seats: Array<{
    id: string;
    seatNumber: string;
    section: string;
  }>;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  bookingDate: string;
}

export default function ReservationsPage() {
  const {
    data: reservations = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Reservation[]>({
    queryKey: ['user-reservations'],
    queryFn: async () => {
      const response = await reservationsAPI.getAll();
      return Array.isArray(response.data) ? response.data : [];
    },
  });
  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationsAPI.cancel(reservationId);
      toast.success('Reservation cancelled successfully');
      refetch();
    } catch {
      toast.error('Failed to cancel reservation');
    }
  };

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    toast.success('Ticket download started');
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusStyles = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
          <p className="mt-2 text-gray-600">
            View and manage your event tickets
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load reservations</p>
            <button
              onClick={() => refetch()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : !reservations || reservations.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No reservations yet
            </h3>
            <p className="mt-1 text-gray-500">
              Start by booking your first event!
            </p>{' '}
            <div className="mt-6">
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation: Reservation) => (
              <div
                key={reservation.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {reservation.eventTitle}
                    </h3>
                    <div className="flex space-x-2">
                      {getStatusBadge(reservation.status)}
                      {getPaymentStatusBadge(reservation.paymentStatus)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>
                        {format(new Date(reservation.eventDate), 'PPP')}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>
                        {format(new Date(reservation.eventDate), 'p')}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{reservation.eventLocation}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Reservation ID:
                        </span>
                        <span className="ml-2 text-gray-600">
                          #{reservation.id}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Tickets:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {reservation.quantity} × {reservation.ticketType}
                        </span>
                      </div>
                      {reservation.seats.length > 0 && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">
                            Seats:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {reservation.seats
                              .map(seat => `${seat.section}-${seat.seatNumber}`)
                              .join(', ')}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-700">
                          Total Amount:
                        </span>
                        <span className="ml-2 text-gray-600 font-semibold">
                          ${reservation.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Booked:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {format(new Date(reservation.bookingDate), 'PPP')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      {reservation.status === 'confirmed' &&
                        reservation.paymentStatus === 'paid' && (
                          <button
                            onClick={() => handleDownloadTicket()}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Ticket
                          </button>
                        )}
                    </div>

                    <div className="flex space-x-3">
                      {reservation.status === 'confirmed' &&
                        new Date(reservation.eventDate) > new Date() && (
                          <button
                            onClick={() =>
                              handleCancelReservation(reservation.id)
                            }
                            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
