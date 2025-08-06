import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id: string) => api.get(`/events/${id}`),
  search: (query: string) => api.get(`/events?search=${encodeURIComponent(query)}`),
  create: (eventData: Record<string, unknown>) => api.post('/events', eventData),
  update: (id: string, eventData: Record<string, unknown>) => api.put(`/events/${id}`, eventData),
  delete: (id: string) => api.delete(`/events/${id}`),
};

// Reservations API
export const reservationsAPI = {
  getAll: () => api.get('/reservations'),
  getById: (id: string) => api.get(`/reservations/${id}`),
  getUserReservations: () => api.get('/reservations/user'),
  create: (reservationData: Record<string, unknown>) => api.post('/reservations', reservationData),
  update: (id: string, reservationData: Record<string, unknown>) => api.put(`/reservations/${id}`, reservationData),
  delete: (id: string) => api.delete(`/reservations/${id}`),
  cancel: (id: string) => api.patch(`/reservations/${id}/cancel`),
};

// Payments API
export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  getById: (id: string) => api.get(`/payments/${id}`),
  process: (paymentData: Record<string, unknown>) => api.post('/payments', paymentData),
  refund: (id: string) => api.post(`/payments/${id}/refund`),
};

// Seats API (for seat locking/unlocking)
export const seatsAPI = {
  getByEvent: (eventId: string) => api.get(`/events/${eventId}/seats`),
  lock: (seatData: { eventId: string; seatIds: string[] }) => 
    api.post('/seats/lock', seatData),
  unlock: (seatData: { eventId: string; seatIds: string[] }) => 
    api.post('/seats/unlock', seatData),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: Record<string, unknown>) => api.put('/users/profile', userData),
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    api.put('/users/change-password', passwordData),
};

export default api;
