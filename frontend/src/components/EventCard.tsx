'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Heart, Share2, Clock, Ticket } from 'lucide-react';
import { Event } from '@/types/event';
import { formatCurrency } from '@/utils';

interface EventCardProps {
  event: Event;
  variant?: 'compact' | 'featured' | 'list';
}

export function EventCard({ event, variant = 'compact' }: EventCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const minPrice = event.ticketPrices?.length > 0 
    ? Math.min(...event.ticketPrices.map(tp => parseFloat(tp.price)))
    : 0;

  const availableSeats = event.totalSeats - event.soldSeats;
  const isLowAvailability = availableSeats < event.totalSeats * 0.2;
  const isSoldOut = availableSeats === 0;

  if (variant === 'featured') {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={event.imageUrl || '/placeholder-event.jpg'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-md transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Status Badges */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            {isSoldOut && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                SOLD OUT
              </span>
            )}
            {isLowAvailability && !isSoldOut && (
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                ALMOST SOLD OUT
              </span>
            )}
            {event.category && (
              <span className="px-3 py-1 bg-blue-500/90 text-white text-xs font-medium rounded-full capitalize">
                {event.category}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {event.description}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{new Date(event.startDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{new Date(event.startDate).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>

            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.venue?.name}, {event.venue?.city}</span>
            </div>

            <div className="flex items-center text-gray-600 text-sm">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{availableSeats} seats available</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs text-gray-500">Starting from</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(minPrice)}
              </div>
            </div>
            
            <Link
              href={`/events/${event.id}`}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                isSoldOut
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              }`}
              {...(isSoldOut && { onClick: (e) => e.preventDefault() })}
            >
              <Ticket className="inline h-4 w-4 mr-2" />
              {isSoldOut ? 'Sold Out' : 'Book Now'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant (default)
  return (
    <Link href={`/events/${event.id}`}>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.imageUrl || '/placeholder-event.jpg'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                SOLD OUT
              </span>
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1.5" />
              <span>{new Date(event.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1.5" />
              <span className="truncate">{event.venue?.city}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(minPrice)}
              </span>
              <span className="text-xs text-gray-500 ml-1">from</span>
            </div>
            <span className="text-xs text-gray-500">
              {availableSeats} seats left
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
