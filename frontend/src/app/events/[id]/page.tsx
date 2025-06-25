'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, Users, Clock, Tag, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { eventsAPI, reservationsAPI, paymentsAPI } from '@/lib/api';
import { Event } from '@/types/event';
import toast from 'react-hot-toast';



interface Seat {
  id: string;
  seatNumber: string;
  row: string;
  section: string;
  isAvailable: boolean;
  ticketTypeId: string;
}

interface ReservationData {
  eventId: string;
  seats: number;
  totalAmount: number;
}

interface PaymentData {
  reservationId: string;
  amount: number;
  paymentMethod: string;
}

interface Reservation {
  id: string;
  eventId: string;
  seats: number;
  totalAmount: number;
}

interface APIError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const eventId = params.id as string;
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [showCheckout, setShowCheckout] = useState(false);  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Fetch event details
  const { data: event, isLoading: eventLoading, error: eventError } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await eventsAPI.getById(eventId);
      return response.data as Event;
    },
  });

  // For the mock API, we'll generate mock seats since the API doesn't provide them
  const generateMockSeats = () => {
    if (!event) return [];
    const seats = [];
    const sections = ['Orchestra', 'Mezzanine', 'Balcony'];
    let seatId = 1;
    
    for (const section of sections) {
      for (let row = 1; row <= 5; row++) {
        for (let seatNum = 1; seatNum <= 10; seatNum++) {
          seats.push({
            id: `seat-${seatId}`,
            seatNumber: seatNum.toString(),
            row: String.fromCharCode(64 + row), // A, B, C, D, E
            section,
            isAvailable: Math.random() > 0.3, // 70% available
            ticketTypeId: 'standard'
          });
          seatId++;
        }
      }
    }
    return seats;
  };

  const seats = event ? generateMockSeats() : [];  // Create reservation mutation
  const createReservationMutation = useMutation<Reservation, APIError, ReservationData>({
    mutationFn: async (reservationData: ReservationData) => {
      const response = await reservationsAPI.create(reservationData);
      return response.data as Reservation;
    },
    onSuccess: (reservation: Reservation) => {
      toast.success('Reservation created successfully!');
      // Proceed to payment
      processPayment(reservation);
    },
    onError: (error: APIError) => {
      const message = error?.response?.data?.message || 'Failed to create reservation';
      toast.error(message);
      setIsProcessingPayment(false);
    },
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const response = await paymentsAPI.process(paymentData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Payment successful! Your tickets have been confirmed.');
      queryClient.invalidateQueries({ queryKey: ['user-reservations'] });
      router.push('/dashboard');
    },
    onError: (error: APIError) => {
      const message = error?.response?.data?.message || 'Payment failed';
      toast.error(message);
      setIsProcessingPayment(false);
    },
  });
  useEffect(() => {
    // Mock ticket prices since the API doesn't provide them
    setSelectedTicketType('standard');
  }, [event]);

  const handleSeatClick = (seatId: string, seatStatus: string) => {
    if (seatStatus === 'sold') return;

    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getSelectedTicketPrice = () => {
    // Use the event price from mock API
    return event?.price || 0;
  };

  const getTotalPrice = () => {
    return selectedSeats.length * getSelectedTicketPrice();
  };

  const handleReservation = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to make a reservation');
      router.push('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setShowCheckout(true);
  };
  const processPayment = async (reservation: Reservation) => {
    try {
      const paymentData: PaymentData = {
        reservationId: reservation.id,
        amount: getTotalPrice(),
        paymentMethod: 'stripe', // Default to Stripe
      };

      await processPaymentMutation.mutateAsync(paymentData);
    } catch (error) {
      console.error('Payment processing error:', error);
    }
  };
  const handlePayment = async () => {
    if (!user) return;

    setIsProcessingPayment(true);

    try {
      const reservationData: ReservationData = {
        eventId,
        seats: selectedSeats.length,
        totalAmount: getTotalPrice(),
      };

      await createReservationMutation.mutateAsync(reservationData);
    } catch (error) {
      console.error('Reservation creation error:', error);
      setIsProcessingPayment(false);
    }
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-200 hover:bg-green-300 border-green-400 cursor-pointer';
      case 'selected': return 'bg-blue-500 border-blue-600 text-white cursor-pointer';
      case 'sold': return 'bg-red-200 border-red-300 cursor-not-allowed';
      case 'reserved': return 'bg-yellow-200 border-yellow-300 cursor-not-allowed';
      default: return 'bg-gray-200 border-gray-300';
    }
  };
    const getSeatStatus = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) return 'selected';
    if (!seat.isAvailable) return 'sold';
    return 'available';
  };

  const groupSeatsBySection = () => {
    if (!seats) return {};
    const sections: { [key: string]: Seat[] } = {};
    seats.forEach((seat: Seat) => {
      if (!sections[seat.section]) {
        sections[seat.section] = [];
      }
      sections[seat.section].push(seat);
    });
    return sections;
  };
  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-xl text-red-600">Event not found</div>
          <button 
            onClick={() => router.push('/events')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <p className="text-gray-600 mb-4">{event.description}</p>              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>2 hours</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{event.availableSeats} of {event.totalSeats} seats available</span>
                </div>
              </div>

              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-gray-600" />
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Seats</h2>
                {/* Ticket Type Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Type
                </label>
                <select
                  value={selectedTicketType}
                  onChange={(e) => setSelectedTicketType(e.target.value)}
                  className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard - ${event.price}</option>
                </select>
              </div>

              {/* Stage */}
              <div className="text-center mb-8">
                <div className="bg-gray-800 text-white py-3 px-6 rounded-lg inline-block">
                  🎭 STAGE
                </div>
              </div>
              
              {/* Seat Map */}
              <div className="space-y-8">
                {Object.entries(groupSeatsBySection()).map(([sectionName, sectionSeats]) => (
                  <div key={sectionName} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      {sectionName}
                    </h3>
                      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(20, 1fr)' }}>
                      {sectionSeats
                        .sort((a: Seat, b: Seat) => a.row?.localeCompare(b.row) || parseInt(a.seatNumber) - parseInt(b.seatNumber))
                        .map((seat: Seat) => {
                          const seatStatus = getSeatStatus(seat);
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id, seatStatus)}
                              className={`w-8 h-8 text-xs border-2 rounded ${getSeatColor(seatStatus)} transition-colors`}
                              disabled={seatStatus === 'sold'}
                              title={`${seat.row}${seat.seatNumber} - ${seatStatus}`}
                            >
                              {seat.seatNumber}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-200 border border-green-400 rounded mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded mr-2"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-200 border border-red-300 rounded mr-2"></div>
                  <span>Sold</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded mr-2"></div>
                  <span>Reserved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Seats:</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket Type:</span>
                  <span className="font-medium">Standard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per ticket:</span>
                  <span className="font-medium">${getSelectedTicketPrice()}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">${getTotalPrice()}</span>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Selected Seats:</h4>
                  <div className="text-sm text-gray-600">
                    {selectedSeats.map(seatId => {
                      const seat = seats.find(s => s.id === seatId);
                      return seat ? `${seat.section} ${seat.row}${seat.seatNumber}` : seatId;
                    }).join(', ')}
                  </div>
                </div>
              )}

              <button
                onClick={handleReservation}
                disabled={selectedSeats.length === 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {selectedSeats.length === 0 ? 'Select Seats' : `Reserve ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
        
        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Checkout</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Event:</span>
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seats:</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold text-green-600">${getTotalPrice()}</span>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-yellow-500 mr-2" />
                    <p className="text-sm text-yellow-800">
                      Please log in to complete your purchase
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  disabled={isProcessingPayment}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                {isAuthenticated ? (
                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Now
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
