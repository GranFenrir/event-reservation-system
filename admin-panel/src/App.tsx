import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  Users, 
  Settings,
  Menu,
  X,
  Home,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Events } from './components/Events';
import { Reservations } from './components/Reservations';
import { Payments } from './components/Payments';
import { checkServicesHealth } from './services/microservices';

type ActiveTab = 'dashboard' | 'events' | 'reservations' | 'payments' | 'users';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [servicesHealth, setServicesHealth] = useState({
    event: false,
    reservation: false,
    payment: false,
    mail: false,
    reporting: false,
  });
  const [healthCheckLoading, setHealthCheckLoading] = useState(true);

  // Check services health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        setHealthCheckLoading(true);
        const health = await checkServicesHealth();
        setServicesHealth(health);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setHealthCheckLoading(false);
      }
    };

    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <Events />;
      case 'reservations':
        return <Reservations />;
      case 'payments':
        return <Payments />;
      case 'users':
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Users Management</h1>
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
                <p className="text-gray-600">User management functionality will be available soon.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const healthyServices = Object.values(servicesHealth).filter(Boolean).length;
  const totalServices = Object.keys(servicesHealth).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo/Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={20} />
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => {
              setActiveTab('dashboard');
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon={<Calendar size={20} />}
            label="Events"
            active={activeTab === 'events'}
            onClick={() => {
              setActiveTab('events');
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Reservations"
            active={activeTab === 'reservations'}
            onClick={() => {
              setActiveTab('reservations');
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon={<CreditCard size={20} />}
            label="Payments"
            active={activeTab === 'payments'}
            onClick={() => {
              setActiveTab('payments');
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon={<User size={20} />}
            label="Users"
            active={activeTab === 'users'}
            onClick={() => {
              setActiveTab('users');
              setSidebarOpen(false);
            }}
          />
        </nav>

        {/* Service Health Status */}
        <div className="border-t border-gray-200 p-4">
          <div className="text-xs font-medium text-gray-600 mb-2">Service Health</div>
          {healthCheckLoading ? (
            <div className="text-xs text-gray-500">Checking...</div>
          ) : (
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                healthyServices === totalServices ? 'bg-green-500' : 
                healthyServices > totalServices / 2 ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-600">
                {healthyServices}/{totalServices} services healthy
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button className="w-full flex items-center px-2 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="px-4 py-2 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600">
                <Bell size={20} />
              </button>
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
