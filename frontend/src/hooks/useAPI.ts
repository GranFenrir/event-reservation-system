import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsAPI, reservationsAPI, paymentsAPI, seatsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Event } from '@/types/event';

// Error type for API responses
interface APIError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Events hooks
export const useEvents = () => {
  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await eventsAPI.getAll();
      return Array.isArray(response.data) ? response.data : [];
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsAPI.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully!');
    },
    onError: (error: APIError) => {
      toast.error(error.response?.data?.message || 'Failed to create event');
    },
  });
};

// Reservations hooks
export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationsAPI.getAll().then(res => res.data),
  });
};

export const useReservation = (id: string) => {
  return useQuery({
    queryKey: ['reservations', id],
    queryFn: () => reservationsAPI.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['seats'] });
      toast.success('Reservation created successfully!');
    },
    onError: (error: APIError) => {
      toast.error(
        error.response?.data?.message || 'Failed to create reservation'
      );
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationsAPI.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['seats'] });
      toast.success('Reservation cancelled successfully!');
    },
    onError: (error: APIError) => {
      toast.error(
        error.response?.data?.message || 'Failed to cancel reservation'
      );
    },
  });
};

// Seats hooks
export const useEventSeats = (eventId: string) => {
  return useQuery({
    queryKey: ['seats', eventId],
    queryFn: () => seatsAPI.getByEvent(eventId).then(res => res.data),
    enabled: !!eventId,
  });
};

export const useLockSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seatsAPI.lock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats'] });
    },
    onError: (error: APIError) => {
      toast.error(error.response?.data?.message || 'Failed to lock seats');
    },
  });
};

export const useUnlockSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seatsAPI.unlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats'] });
    },
    onError: (error: APIError) => {
      toast.error(error.response?.data?.message || 'Failed to unlock seats');
    },
  });
};

// Payments hooks
export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsAPI.process,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['seats'] });
      toast.success('Payment processed successfully!');
    },
    onError: (error: APIError) => {
      toast.error(error.response?.data?.message || 'Payment failed');
    },
  });
};
