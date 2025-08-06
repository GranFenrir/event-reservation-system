'use client';

import { TrendingUp, Users, Calendar, MapPin } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function EventStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Events"
        value="124"
        change="+12% this month"
        trend="up"
        icon={<Calendar className="h-6 w-6 text-blue-600" />}
      />
      <StatsCard
        title="Total Attendees"
        value="8,549"
        change="+25% this month"
        trend="up"
        icon={<Users className="h-6 w-6 text-blue-600" />}
      />
      <StatsCard
        title="Cities Covered"
        value="15"
        change="3 new cities"
        trend="up"
        icon={<MapPin className="h-6 w-6 text-blue-600" />}
      />
      <StatsCard
        title="Avg. Rating"
        value="4.8"
        change="Maintained"
        trend="neutral"
        icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
      />
    </div>
  );
}
