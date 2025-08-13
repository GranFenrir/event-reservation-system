'use client';

import { Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '@/services/api';
import { Event } from '@/types/event';
import { formatCurrency } from '@/utils';

export default function EventsPage() {
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      console.log('🔍 Fetching events from API...');
      const response = await eventsAPI.getAll();
      console.log('✅ API Response:', response.data);
      return response.data;
    },
  });

  // Extract events from the microservice response structure
  const events: Event[] = apiResponse?.data?.events || [];

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
                <option value="conference">Conference</option>
                <option value="comedy">Comedy</option>
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
            </div>
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-gray-500 py-12">
            <p>Unable to load events. Please try again later.</p>
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <Calendar className="mx-auto h-12 w-12 mb-4" />
            <p>No events available at the moment.</p>
            <p className="text-sm">Check back soon for exciting events!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  // Format the date and time from ISO string
  const eventDate = new Date(event.startDate);
  const eventEndDate = new Date(event.endDate);
  
  // Get the minimum price from ticket prices
  const minPrice = event.ticketPrices && event.ticketPrices.length > 0 
    ? Math.min(...event.ticketPrices.map(price => parseFloat(price.price)))
    : 0;

  // Calculate available seats
  const availableSeats = event.totalSeats - event.soldSeats;

  return (
    <Link href={`/events/${event.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="h-48 relative overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold mb-1">{event.title}</h3>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.venue?.city ? `${event.venue.city}, ${event.venue.country}` : 'Location TBA'}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-2 text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>

          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">
              From {formatCurrency(minPrice)}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>
                {event.soldSeats} / {event.totalSeats} sold
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
