'use client';

import { useState } from 'react';
import { Heart, Share2, BookmarkPlus, Play, Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/types/event';
import { formatCurrency } from '@/utils';

interface ModernEventCardProps {
  event: Event;
  variant?: 'default' | 'featured' | 'minimal';
}

export function ModernEventCard({ event, variant = 'default' }: ModernEventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const minPrice = event.ticketPrices?.length > 0 
    ? Math.min(...event.ticketPrices.map(tp => parseFloat(tp.price)))
    : 0;

  if (variant === 'featured') {
    return (
      <div className="group relative">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 border border-white/50">
          
          {/* Image Section */}
          <div className="relative h-64 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
            
            <img
              src={event.imageUrl || '/placeholder-event.jpg'}
              alt={event.title}
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-12 h-12 rounded-2xl backdrop-blur-xl transition-all duration-300 flex items-center justify-center shadow-lg ${
                  isLiked 
                    ? 'bg-red-500/90 text-white shadow-red-500/25' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-12 h-12 rounded-2xl backdrop-blur-xl transition-all duration-300 flex items-center justify-center shadow-lg ${
                  isBookmarked 
                    ? 'bg-blue-500/90 text-white shadow-blue-500/25' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <BookmarkPlus className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button className="w-12 h-12 rounded-2xl backdrop-blur-xl bg-white/20 text-white hover:bg-white/30 transition-all duration-300 flex items-center justify-center shadow-lg">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                <Play className="h-8 w-8 text-purple-600 ml-1" />
              </button>
            </div>

            {/* Category Badge */}
            <div className="absolute bottom-4 left-4 z-20">
              <span className="px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xl text-white text-sm font-medium border border-white/20">
                {event.category}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Title & Description */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
              {event.title}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
              {event.description}
            </p>

            {/* Event Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">DATE</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(event.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">VENUE</div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {event.venue?.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">STARTING FROM</div>
                <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {formatCurrency(minPrice)}
                </div>
              </div>
              
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-lg" />
      </div>
    );
  }

  // Default minimal card
  return (
    <div className="group relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-purple-200/50 transition-all duration-500 overflow-hidden border border-gray-100/50 hover:border-purple-200/50">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl || '/placeholder-event.jpg'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-10 h-10 rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
          <span className="text-sm font-bold text-purple-600">
            {formatCurrency(minPrice)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
            {new Date(event.startDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span className="truncate">{event.venue?.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Users className="h-3 w-3 mr-1" />
            <span>{event.totalSeats - event.soldSeats} left</span>
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
