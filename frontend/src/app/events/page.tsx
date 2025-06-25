import { Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

interface Venue {
  name: string;
  address: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: Venue;
  maxCapacity: number;
  currentReservations: number;
  images: string[];
  ticketTypes: string[];
}

// This would be fetched from the API in a real application
const sampleEvents = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description:
      'Join us for an amazing summer music festival featuring top artists from around the world.',
    startDate: '2025-07-15T18:00:00Z',
    endDate: '2025-07-15T23:00:00Z',
    venue: { name: 'Central Park', address: 'New York, NY' },
    maxCapacity: 5000,
    currentReservations: 2350,
    images: ['/placeholder-event.jpg'],
    ticketTypes: ['VIP', 'Premium', 'Standard'],
  },
  {
    id: '2',
    title: 'Tech Conference 2025',
    description:
      'Learn about the latest technology trends and network with industry professionals.',
    startDate: '2025-08-20T09:00:00Z',
    endDate: '2025-08-20T17:00:00Z',
    venue: { name: 'Convention Center', address: 'San Francisco, CA' },
    maxCapacity: 1000,
    currentReservations: 750,
    images: ['/placeholder-event.jpg'],
    ticketTypes: ['Premium', 'Standard'],
  },
  {
    id: '3',
    title: 'Theater Performance',
    description:
      'Experience a captivating theatrical performance by award-winning actors.',
    startDate: '2025-09-10T19:30:00Z',
    endDate: '2025-09-10T22:00:00Z',
    venue: { name: 'Broadway Theater', address: 'New York, NY' },
    maxCapacity: 800,
    currentReservations: 450,
    images: ['/placeholder-event.jpg'],
    ticketTypes: ['VIP', 'Standard'],
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Events</h1>
          <p className="text-lg text-gray-600">
            Discover amazing events happening near you
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option value="music">Music</option>
                <option value="tech">Technology</option>
                <option value="theater">Theater</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter city"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>{' '}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any Price</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold mb-1">{event.title}</h3>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.venue?.name}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-2 text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {new Date(event.startDate).toLocaleDateString()} at{' '}
              {new Date(event.startDate).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">From $49</span>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>
                {event.currentReservations} / {event.maxCapacity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
