'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, MapPin, X, SlidersHorizontal } from 'lucide-react';
import { Event } from '@/types/event';

interface AdvancedFiltersProps {
  events: Event[];
  onFilteredEvents: (filtered: Event[]) => void;
}

export function AdvancedFilters({ events, onFilteredEvents }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateRange: '',
    location: '',
    priceRange: { min: 0, max: 1000 }
  });

  // Extract unique values for filter options
  const categories = useMemo(() => 
    [...new Set(events.map(e => e.category).filter(Boolean))], [events]
  );
  
  const locations = useMemo(() => 
    [...new Set(events.map(e => e.venue?.city).filter(Boolean))], [events]
  );

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !filters.search || 
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = !filters.category || event.category === filters.category;
      
      const matchesLocation = !filters.location || event.venue?.city === filters.location;
      
      // Price filtering logic would go here based on ticketPrices
      
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [events, filters]);

  // Apply filters whenever they change
  useMemo(() => {
    onFilteredEvents(filteredEvents);
  }, [filteredEvents, onFilteredEvents]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      {/* Quick Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          placeholder="Search events, artists, venues..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{filteredEvents.length} events found</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-medium">Advanced Filters</span>
        </button>
      </div>

      {/* Advanced Filters */}
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Date</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                dateRange: '',
                location: '',
                priceRange: { min: 0, max: 1000 }
              })}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
              <span>Clear all filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
