import axios from 'axios';

// Microservice endpoints
const SERVICES = {
  EVENT_SERVICE: process.env.NEXT_PUBLIC_EVENT_SERVICE_URL || 'http://localhost:3001',
  RESERVATION_SERVICE: process.env.NEXT_PUBLIC_RESERVATION_SERVICE_URL || 'http://localhost:3002',
  PAYMENT_SERVICE: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost:3003',
  MAIL_SERVICE: process.env.NEXT_PUBLIC_MAIL_SERVICE_URL || 'http://localhost:3004',
  REPORTING_SERVICE: process.env.NEXT_PUBLIC_REPORTING_SERVICE_URL || 'http://localhost:3005',
};

// Create axios instances for each service
const createServiceClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth interceptor
  client.interceptors.request.use(
    config => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  return client;
};

export const serviceClients = {
  event: createServiceClient(SERVICES.EVENT_SERVICE),
  reservation: createServiceClient(SERVICES.RESERVATION_SERVICE),
  payment: createServiceClient(SERVICES.PAYMENT_SERVICE),
  mail: createServiceClient(SERVICES.MAIL_SERVICE),
  reporting: createServiceClient(SERVICES.REPORTING_SERVICE),
};

// Reporting Service API
export class ReportingService {
  private client = serviceClients.reporting;

  async getDashboardAnalytics() {
    try {
      const response = await this.client.get('/api/v1/reports/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }

  async getSalesAnalytics(startDate?: string, endDate?: string) {
    try {
      const params: { startDate?: string; endDate?: string } = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await this.client.get('/api/v1/reports/analytics/sales', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  }

  async getEventsAnalytics() {
    try {
      const response = await this.client.get('/api/v1/reports/analytics/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching events analytics:', error);
      throw error;
    }
  }

  async getReports(params?: any) {
    try {
      const response = await this.client.get('/api/v1/reports', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  async generateReport(reportData: any) {
    try {
      const response = await this.client.post('/api/v1/reports/generate', reportData);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

// Event Service API
export class EventService {
  private client = serviceClients.event;

  async getEvents(params?: any) {
    try {
      const response = await this.client.get('/api/v1/events', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async getEvent(id: string) {
    try {
      const response = await this.client.get(`/api/v1/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  async createEvent(eventData: any) {
    try {
      const response = await this.client.post('/api/v1/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(id: string, eventData: any) {
    try {
      const response = await this.client.patch(`/api/v1/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(id: string) {
    try {
      await this.client.delete(`/api/v1/events/${id}`);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  async getVenues(params?: any) {
    try {
      const response = await this.client.get('/api/v1/venues', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venues:', error);
      throw error;
    }
  }
}

// Reservation Service API
export class ReservationService {
  private client = serviceClients.reservation;

  async getReservations(params?: any) {
    try {
      const response = await this.client.get('/reservations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }

  async getReservation(id: string) {
    try {
      const response = await this.client.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reservation:', error);
      throw error;
    }
  }

  async updateReservation(id: string, data: any) {
    try {
      const response = await this.client.patch(`/reservations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }

  async cancelReservation(id: string, reason: string) {
    try {
      const response = await this.client.post('/reservations/cancel', { 
        reservationId: id, 
        reason 
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }
}

// Payment Service API
export class PaymentService {
  private client = serviceClients.payment;

  async getPayments(params?: any) {
    try {
      const response = await this.client.get('/payments', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  async getPayment(id: string) {
    try {
      const response = await this.client.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  async processRefund(paymentId: string, amount: number, reason: string) {
    try {
      const response = await this.client.post('/payments/refund', {
        paymentId,
        amount,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }
}

// Service instances
export const reportingService = new ReportingService();
export const eventService = new EventService();
export const reservationService = new ReservationService();
export const paymentService = new PaymentService();

// Health check for all services
export const checkServicesHealth = async () => {
  const healthChecks = await Promise.allSettled([
    serviceClients.event.get('/api/v1/health'),
    serviceClients.reservation.get('/health'),
    serviceClients.payment.get('/health'),
    serviceClients.mail.get('/health'),
    serviceClients.reporting.get('/api/v1/health'),
  ]);

  return {
    event: healthChecks[0].status === 'fulfilled',
    reservation: healthChecks[1].status === 'fulfilled',
    payment: healthChecks[2].status === 'fulfilled',
    mail: healthChecks[3].status === 'fulfilled',
    reporting: healthChecks[4].status === 'fulfilled',
  };
};
