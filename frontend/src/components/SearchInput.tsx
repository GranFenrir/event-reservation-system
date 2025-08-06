'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '@/services/api';
import { Event } from '@/types/event';

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className = "" }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Search events with debounce
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => eventsAPI.search(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const events = searchResults?.data?.events || [];

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEventSelect = (event: Event) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/events/${event.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query) {
      setIsOpen(false);
      router.push(`/events?search=${encodeURIComponent(query)}`);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search events..."
          className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          ) : events.length > 0 ? (
            <>
              {events.slice(0, 5).map((event: Event) => (
                <button
                  key={event.id}
                  onClick={() => handleEventSelect(event)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()} • {event.venue?.name || 'TBD'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {events.length > 5 && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/events?search=${encodeURIComponent(query)}`);
                  }}
                  className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 text-center"
                >
                  View all {events.length} results
                </button>
              )}
            </>
          ) : query.length > 2 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No events found for "{query}"
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              Type at least 3 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
}
