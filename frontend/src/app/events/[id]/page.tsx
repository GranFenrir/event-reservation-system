'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, Clock, Users, Star, Share2, Heart } from 'lucide-react';
import { eventsAPI } from '@/services/api';
import { Event } from '@/types/event';
import { formatCurrency } from '@/utils';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      console.log('🔍 Fetching event details for ID:', eventId);
      const response = await eventsAPI.getById(eventId);
      console.log('✅ Event API Response:', response.data);
      return response.data;
    },
    enabled: !!eventId,
  });

  // Extract event from the microservice response structure
  const event: Event | null = apiResponse?.data || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300"></div>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.startDate);
  const eventEndDate = new Date(event.endDate);
  const availableSeats = event.totalSeats - event.soldSeats;
  const isEventFull = availableSeats <= 0;
  
  // Get selected ticket price
  const selectedTicket = event.ticketPrices.find(ticket => ticket.id === selectedTicketType);
  const totalPrice = selectedTicket ? parseFloat(selectedTicket.price) * ticketQuantity : 0;

  const handleBooking = () => {
    if (!selectedTicketType) {
      alert('Please select a ticket type');
      return;
    }
    
    // TODO: Implement booking logic with reservation service
    console.log('Booking:', {
      eventId: event.id,
      ticketType: selectedTicketType,
      quantity: ticketQuantity,
      totalPrice
    });
    alert('Booking functionality will be implemented with the reservation service!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="h-96 relative overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Event Title Overlay */}
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex items-center text-white text-lg">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="mr-6">
                {eventDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <Clock className="h-5 w-5 mr-2" />
              <span>
                {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {event.description}
              </p>

              {/* Event Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">{eventDate.toDateString()}</p>
                        <p className="text-sm text-gray-500">
                          {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                          {eventEndDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">{event.venue?.name}</p>
                        <p className="text-sm text-gray-500">
                          {event.venue?.address}, {event.venue?.city}, {event.venue?.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">
                          {availableSeats} seats available
                        </p>
                        <p className="text-sm text-gray-500">
                          {event.soldSeats} of {event.totalSeats} sold
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Category & Status</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    {isEventFull && (
                      <div>
                        <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book Tickets</h3>
              
              {isEventFull ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">This event is sold out</p>
                  <p className="text-sm text-gray-500">Check back for cancellations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Ticket Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Type
                    </label>
                    <div className="space-y-2">
                      {event.ticketPrices.map((ticket) => (
                        <label key={ticket.id} className="flex items-center">
                          <input
                            type="radio"
                            name="ticketType"
                            value={ticket.id}
                            checked={selectedTicketType === ticket.id}
                            onChange={(e) => setSelectedTicketType(e.target.value)}
                            className="mr-3"
                          />
                          <div className="flex-1 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{ticket.name}</p>
                              <p className="text-sm text-gray-500">{ticket.description}</p>
                            </div>
                            <span className="font-bold text-green-600">
                              {formatCurrency(parseFloat(ticket.price))}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <select
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  {/* Total Price */}
                  {selectedTicket && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!selectedTicketType}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4 pt-4 border-t">
                <button className="flex-1 flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Heart className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button className="flex-1 flex items-center justify-center py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
