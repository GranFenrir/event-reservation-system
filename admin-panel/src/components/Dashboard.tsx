import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  CreditCard,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { reportingService, checkServicesHealth } from '../services/microservices';

interface DashboardStats {
  totalEvents: number;
  totalReservations: number;
  totalRevenue: number;
  totalUsers: number;
  recentReports: any[];
}

interface SalesData {
  period: {
    startDate: string;
    endDate: string;
  };
  totalSales: number;
  transactionCount: number;
  averageTransaction: number;
  salesByDay: Array<{
    date: string;
    amount: number;
    transactions: number;
  }>;
}

interface EventsData {
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  eventsByCategory: Array<{
    category: string;
    count: number;
  }>;
  popularEvents: Array<{
    name: string;
    reservations: number;
  }>;
}

interface ServiceHealth {
  event: boolean;
  reservation: boolean;
  payment: boolean;
  mail: boolean;
  reporting: boolean;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center mt-2 text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className={`text-${color}-500`}>
        {icon}
      </div>
    </div>
  </div>
);

const ServiceHealthCard: React.FC<{ health: ServiceHealth; onRefresh: () => void }> = ({ 
  health, 
  onRefresh 
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Service Health</h3>
      <button
        onClick={onRefresh}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
      >
        <RefreshCw size={16} />
      </button>
    </div>
    <div className="space-y-3">
      {Object.entries(health).map(([service, isHealthy]) => (
        <div key={service} className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 capitalize">
            {service.replace('-', ' ')} Service
          </span>
          <div className="flex items-center">
            {isHealthy ? (
              <CheckCircle className="text-green-500" size={16} />
            ) : (
              <AlertCircle className="text-red-500" size={16} />
            )}
            <span className={`ml-2 text-sm ${
              isHealthy ? 'text-green-600' : 'text-red-600'
            }`}>
              {isHealthy ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export const Dashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth>({
    event: false,
    reservation: false,
    payment: false,
    mail: false,
    reporting: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, sales, events, health] = await Promise.allSettled([
        reportingService.getDashboardAnalytics(),
        reportingService.getSalesAnalytics(),
        reportingService.getEventsAnalytics(),
        checkServicesHealth(),
      ]);

      if (dashboard.status === 'fulfilled') {
        setDashboardStats(dashboard.value);
      }

      if (sales.status === 'fulfilled') {
        setSalesData(sales.value);
      }

      if (events.status === 'fulfilled') {
        setEventsData(events.value);
      }

      if (health.status === 'fulfilled') {
        setServiceHealth(health.value);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={dashboardStats?.totalEvents || 0}
            change={5.2}
            icon={<Calendar size={24} />}
            color="blue"
          />
          <StatCard
            title="Total Reservations"
            value={dashboardStats?.totalReservations || 0}
            change={12.1}
            icon={<Users size={24} />}
            color="green"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(dashboardStats?.totalRevenue || 0).toLocaleString()}`}
            change={8.3}
            icon={<CreditCard size={24} />}
            color="purple"
          />
          <StatCard
            title="Active Users"
            value={dashboardStats?.totalUsers || 0}
            change={-2.4}
            icon={<Activity size={24} />}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData?.salesByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Events by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventsData?.eventsByCategory || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(eventsData?.eventsByCategory || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Events</h3>
            <div className="space-y-3">
              {(eventsData?.popularEvents || []).map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 truncate">
                    {event.name}
                  </span>
                  <span className="text-sm text-blue-600 font-semibold">
                    {event.reservations}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Health */}
          <ServiceHealthCard health={serviceHealth} onRefresh={fetchData} />

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>New event created</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>Payment processed</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>Reservation confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
