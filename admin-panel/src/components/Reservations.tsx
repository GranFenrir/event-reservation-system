import React, { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  MapPin,
  Clock,
  DollarSign,
  Check,
  X,
  Eye,
  Search,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { reservationService } from '../services/microservices';

interface Reservation {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';
  totalAmount: number;
  reservationDate: string;
  expiresAt: string;
  seats: Array<{
    id: string;
    seatNumber: string;
    section?: string;
    price: number;
  }>;
  user: {
    id: string;
    name: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    startDate: string;
    venue: {
      name: string;
      city: string;
    };
  };
  payment?: {
    id: string;
    status: string;
    amount: number;
  };
  createdAt: string;
  updatedAt: string;
}

const StatusBadge: React.FC<{ status: Reservation['status'] }> = ({ status }) => {
  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return <Clock size={12} />;
      case 'confirmed': return <Check size={12} />;
      case 'cancelled': return <X size={12} />;
      case 'expired': return <AlertCircle size={12} />;
      default: return null;
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      <span className="ml-1">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </span>
  );
};

const ReservationCard: React.FC<{
  reservation: Reservation;
  onView: (reservation: Reservation) => void;
  onCancel: (id: string) => void;
  onConfirm: (id: string) => void;
}> = ({ reservation, onView, onCancel, onConfirm }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpiringSoon = () => {
    const expiresAt = new Date(reservation.expiresAt);
    const now = new Date();
    const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilExpiry > 0 && hoursUntilExpiry < 24;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
      isExpiringSoon() ? 'border-l-4 border-orange-500' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {reservation.event.title}
          </h3>
          <p className="text-sm text-gray-600">
            Reservation #{reservation.id.slice(0, 8)}
          </p>
        </div>
        <StatusBadge status={reservation.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User size={16} className="mr-2 text-gray-400" />
          <span>{reservation.user.name} ({reservation.user.email})</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2 text-gray-400" />
          <span>{reservation.event.venue.name}, {reservation.event.venue.city}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2 text-gray-400" />
          <span>{formatDate(reservation.event.startDate)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-2 text-gray-400" />
          <span>Reserved: {formatDate(reservation.reservationDate)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <DollarSign size={16} className="mr-2 text-gray-400" />
          <span>${reservation.totalAmount}</span>
        </div>
      </div>

      {/* Seats */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Seats ({reservation.seats.length})
        </h4>
        <div className="flex flex-wrap gap-1">
          {reservation.seats.map((seat) => (
            <span
              key={seat.id}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {seat.section ? `${seat.section}-` : ''}{seat.seatNumber}
            </span>
          ))}
        </div>
      </div>

      {/* Expiry Warning */}
      {isExpiringSoon() && reservation.status === 'pending' && (
        <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center text-orange-800 text-sm">
            <AlertCircle size={16} className="mr-2" />
            <span>Expires in less than 24 hours</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {reservation.payment ? `Payment: ${reservation.payment.status}` : 'No payment'}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(reservation)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {reservation.status === 'pending' && (
            <>
              <button
                onClick={() => onConfirm(reservation.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                title="Confirm Reservation"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => onCancel(reservation.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Cancel Reservation"
              >
                <X size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReservations, setTotalReservations] = useState(0);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      const response = await reservationService.getReservations(params);
      
      // Note: Adapt this based on your actual API response structure
      setReservations(response.data || response);
      setTotalReservations(response.total || response.length);
    } catch (err) {
      setError('Failed to fetch reservations');
      console.error('Reservations fetch error:', err);
      
      // Mock data for development
      const mockReservations: Reservation[] = [
        {
          id: '1',
          userId: 'user1',
          eventId: 'event1',
          status: 'pending',
          totalAmount: 150,
          reservationDate: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
          seats: [
            { id: 'seat1', seatNumber: 'A1', section: 'VIP', price: 75 },
            { id: 'seat2', seatNumber: 'A2', section: 'VIP', price: 75 },
          ],
          user: {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com',
          },
          event: {
            id: 'event1',
            title: 'Summer Music Festival',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            venue: {
              name: 'Central Park',
              city: 'New York',
            },
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: 'user2',
          eventId: 'event2',
          status: 'confirmed',
          totalAmount: 200,
          reservationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          seats: [
            { id: 'seat3', seatNumber: 'B5', price: 100 },
            { id: 'seat4', seatNumber: 'B6', price: 100 },
          ],
          user: {
            id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
          event: {
            id: 'event2',
            title: 'Tech Conference 2025',
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            venue: {
              name: 'Convention Center',
              city: 'San Francisco',
            },
          },
          payment: {
            id: 'payment1',
            status: 'completed',
            amount: 200,
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      setReservations(mockReservations);
      setTotalReservations(mockReservations.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [currentPage, searchTerm, statusFilter]);

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    console.log('View reservation:', reservation);
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await reservationService.cancelReservation(id, 'Cancelled by admin');
        fetchReservations();
      } catch (err) {
        console.error('Cancel error:', err);
        alert('Failed to cancel reservation');
      }
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await reservationService.updateReservation(id, { status: 'confirmed' });
      fetchReservations();
    } catch (err) {
      console.error('Confirm error:', err);
      alert('Failed to confirm reservation');
    }
  };

  const statuses = ['pending', 'confirmed', 'cancelled', 'expired'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reservations Management</h1>
          <div className="text-sm text-gray-600">
            Total: {totalReservations} reservations
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by user, event, or reservation ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchReservations}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
              >
                <Filter size={16} className="mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reservations Grid */}
        {error && !reservations.length ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 mb-4">Showing mock data for development</p>
            <button
              onClick={fetchReservations}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onView={handleView}
                  onCancel={handleCancel}
                  onConfirm={handleConfirm}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalReservations > 12 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-gray-600">
                    Page {currentPage} of {Math.ceil(totalReservations / 12)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalReservations / 12)}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const ReservationList = () => <div>Reservation List</div>;
export const ReservationShow = () => <div>Reservation Show</div>;
export const ReservationEdit = () => <div>Reservation Edit</div>;
