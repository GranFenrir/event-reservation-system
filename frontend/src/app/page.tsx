'use client';

import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/utils';
import { Event } from '@/types/event';
import { eventsAPI } from '@/services/api';

export default function Home() {
  // Use the hook directly in the component
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await eventsAPI.getAll();
      return response.data;
    },
  });

  // Extract events from the microservice response structure
  const events = apiResponse?.data?.events || [];

  const featuredEvents: Event[] = events?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Events
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Book tickets for concerts, conferences, sports events, and more.
            Secure your spot at the most exciting events in your city.
          </p>
          <Link
            href="/events"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-200"
          >
            Browse Events
          </Link>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-lg text-gray-600">
              Don&apos;t miss these amazing upcoming events
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-gray-500">
              <p>Unable to load events. Please try again later.</p>
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Calendar className="mx-auto h-12 w-12 mb-4" />
              <p>No events available at the moment.</p>
              <p className="text-sm">Check back soon for exciting events!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/events"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Events →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose EventReserve?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Easy Booking"
              description="Simple and intuitive booking process with real-time seat selection"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Secure Payments"
              description="Safe and secure payment processing with multiple payment options"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Instant Confirmation"
              description="Receive instant booking confirmation and e-tickets via email"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  // Format the date and time from ISO string
  const eventDate = new Date(event.startDate);
  
  // Get the minimum price from ticket prices
  const minPrice = event.ticketPrices.length > 0 
    ? Math.min(...event.ticketPrices.map(price => parseFloat(price.price)))
    : 0;

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
            <span className="text-sm text-gray-500">
              {event.soldSeats} / {event.totalSeats} sold
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
