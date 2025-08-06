'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CreditCard,
  Download,
} from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { reservationsAPI } from '@/services/api';
import { format } from 'date-fns';

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>(
    'upcoming'
  );

  const {
    data: reservations = [],
    isLoading,
    error,
  } = useQuery<Reservation[]>({
    queryKey: ['user-reservations'],
    queryFn: async () => {
      const response = await reservationsAPI.getAll();
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const filterReservations = (reservations: Reservation[]) => {
    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return reservations.filter(
          r => new Date(r.eventDate) >= now && r.status === 'confirmed'
        );
      case 'past':
        return reservations.filter(r => new Date(r.eventDate) < now);
      case 'all':
      default:
        return reservations;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusStyles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Ticket className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Total Reservations
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {reservations?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Upcoming Events
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {reservations ? filterReservations(reservations).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Total Spent
                </h3>{' '}
                <p className="text-2xl font-bold text-purple-600">
                  $
                  {reservations
                    ?.reduce(
                      (sum: number, r: Reservation) => sum + r.totalAmount,
                      0
                    )
                    .toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {(['upcoming', 'past', 'all'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
              </button>
            ))}
          </nav>
        </div>

        {/* Reservations List */}
        <div className="bg-white shadow rounded-lg">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your reservations...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Failed to load reservations</p>
            </div>
          ) : !reservations || reservations.length === 0 ? (
            <div className="p-8 text-center">
              <Ticket className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No reservations
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by booking your first event!
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
            <div className="divide-y divide-gray-200">
              {filterReservations(reservations).map(reservation => (
                <div key={reservation.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {reservation.eventTitle}
                        </h3>
                        <div className="flex space-x-2">
                          {getStatusBadge(reservation.status)}
                          {getPaymentStatusBadge(reservation.paymentStatus)}
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(reservation.eventDate), 'PPP')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {format(new Date(reservation.eventDate), 'p')}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {reservation.eventLocation}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Tickets:</span>{' '}
                          {reservation.quantity} × {reservation.ticketType}
                        </p>
                        {reservation.seats.length > 0 && (
                          <p>
                            <span className="font-medium">Seats:</span>{' '}
                            {reservation.seats
                              .map(seat => `${seat.section}-${seat.seatNumber}`)
                              .join(', ')}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Total:</span> $
                          {reservation.totalAmount.toFixed(2)}
                        </p>
                        <p>
                          <span className="font-medium">Booked:</span>{' '}
                          {format(new Date(reservation.bookingDate), 'PPP')}
                        </p>
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col space-y-2">
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-2" />
                        Download Ticket
                      </button>
                      {reservation.status === 'confirmed' &&
                        new Date(reservation.eventDate) > new Date() && (
                          <button className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
