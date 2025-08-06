import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import { eventService } from '../services/microservices';

interface Event {
  id: string;
  title: string;
  description: string;
  venue: {
    id: string;
    name: string;
    address: string;
    city: string;
    capacity: number;
  };
  startDate: string;
  endDate: string;
  capacity: number;
  availableSeats: number;
  price: number;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  category: string;
  organizerName: string;
  organizerEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface EventsResponse {
  success: boolean;
  data: {
    events: Event[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}

const StatusBadge: React.FC<{ status: Event['status'] }> = ({ status }) => {
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const EventCard: React.FC<{
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onView: (event: Event) => void;
}> = ({ event, onEdit, onDelete, onView }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const occupancyRate = ((event.capacity - event.availableSeats) / event.capacity) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2 text-gray-400" />
          <span>{event.venue.name}, {event.venue.city}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2 text-gray-400" />
          <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Users size={16} className="mr-2 text-gray-400" />
          <span>{event.capacity - event.availableSeats}/{event.capacity} attendees</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <DollarSign size={16} className="mr-2 text-gray-400" />
          <span>${event.price}</span>
        </div>
      </div>

      {/* Occupancy Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Occupancy</span>
          <span>{occupancyRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              occupancyRate >= 90 ? 'bg-red-500' :
              occupancyRate >= 70 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${occupancyRate}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Category: {event.category}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(event)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(event)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            title="Edit Event"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete Event"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      };

      const response: EventsResponse = await eventService.getEvents(params);
      
      if (response.success) {
        setEvents(response.data.events);
        setTotalEvents(response.data.total);
      } else {
        setError('Failed to fetch events');
      }
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Events fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage, searchTerm, statusFilter, categoryFilter]);

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    // Open edit modal/form
    console.log('Edit event:', event);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        fetchEvents();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete event');
      }
    }
  };

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const categories = ['Concert', 'Sports', 'Theater', 'Conference', 'Workshop'];
  const statuses = ['draft', 'published', 'active', 'completed', 'cancelled'];

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
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={20} className="mr-2" />
            New Event
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchEvents}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
              >
                <Filter size={16} className="mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalEvents > 12 && (
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
                    Page {currentPage} of {Math.ceil(totalEvents / 12)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalEvents / 12)}
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

export const EventList = () => <div>Event List</div>;
export const EventShow = () => <div>Event Show</div>;
export const EventEdit = () => <div>Event Edit</div>;
export const EventCreate = () => <div>Event Create</div>;
