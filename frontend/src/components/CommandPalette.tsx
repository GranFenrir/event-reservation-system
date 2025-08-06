'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Music, 
  Briefcase, 
  Gamepad2, 
  Smile,
  Clock,
  TrendingUp,
  Users,
  Command
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '@/services/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category: string;
  color?: string;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search events
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['command-search', query],
    queryFn: () => eventsAPI.search(query),
    enabled: query.length > 2,
  });

  const events = searchResults?.data?.events || [];

  // Quick actions
  const quickActions = [
    { 
      id: 'browse-events', 
      label: 'Browse all events', 
      icon: Calendar, 
      action: () => router.push('/events'),
      category: 'Navigation'
    },
    { 
      id: 'my-bookings', 
      label: 'My reservations', 
      icon: Users, 
      action: () => router.push('/reservations'),
      category: 'Account'
    },
    { 
      id: 'trending', 
      label: 'Trending events', 
      icon: TrendingUp, 
      action: () => router.push('/events?sort=trending'),
      category: 'Discovery'
    },
    { 
      id: 'this-week', 
      label: 'Events this week', 
      icon: Clock, 
      action: () => router.push('/events?date=this-week'),
      category: 'Discovery'
    },
  ];

  // Categories
  const categories = [
    { id: 'music', label: 'Music Events', icon: Music, color: 'text-pink-500 bg-pink-50' },
    { id: 'conference', label: 'Conferences', icon: Briefcase, color: 'text-blue-500 bg-blue-50' },
    { id: 'sports', label: 'Sports Events', icon: Gamepad2, color: 'text-green-500 bg-green-50' },
    { id: 'comedy', label: 'Comedy Shows', icon: Smile, color: 'text-yellow-500 bg-yellow-50' },
  ];

  // Combine all items
  const allItems: CommandItem[] = [
    ...quickActions,
    ...categories.map(cat => ({
      id: `category-${cat.id}`,
      label: cat.label,
      icon: cat.icon,
      action: () => router.push(`/events?category=${cat.id}`),
      category: 'Categories',
      color: cat.color
    })),
    ...events.slice(0, 5).map((event: any) => ({
      id: `event-${event.id}`,
      label: event.title,
      sublabel: `${new Date(event.startDate).toLocaleDateString()} • ${event.venue?.city}`,
      icon: MapPin,
      action: () => router.push(`/events/${event.id}`),
      category: 'Events'
    }))
  ];

  const filteredItems = query 
    ? allItems.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  // Handle smooth closing
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      setQuery(''); // Reset query on close
      setSelectedIndex(0);
    }, 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredItems.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev === 0 ? filteredItems.length - 1 : prev - 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].action();
            handleClose();
          }
          break;
        case 'Escape':
          handleClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, handleClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Animated Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={handleClose} 
      />
      
      {/* Command Palette with Entrance Animation */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
        <div className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 ${
          isOpen && !isClosing
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}>
          {/* Header with Breathing Animation */}
          <div className="flex items-center px-6 py-4 border-b border-gray-100">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 mr-4 transition-transform duration-200 hover:scale-110" />
              {/* Subtle pulse animation when searching */}
              {(query && isSearching) && (
                <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-ping" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search events, categories, or actions..."
              className="flex-1 text-lg bg-transparent border-none outline-none placeholder-gray-400 transition-all duration-200 focus:placeholder-gray-300"
            />
            <div className="flex items-center space-x-2 text-xs text-gray-400 transition-opacity duration-200 hover:opacity-70">
              <kbd className="px-2 py-1 bg-gray-100 rounded font-mono transition-colors duration-200 hover:bg-gray-200">⌘</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded font-mono transition-colors duration-200 hover:bg-gray-200">K</kbd>
            </div>
          </div>

          {/* Results with Staggered Animation */}
          <div className="max-h-96 overflow-y-auto">
            {isSearching && query ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <div className="relative inline-block">
                  <Search className="h-8 w-8 text-blue-500 animate-spin" />
                  <div className="absolute inset-0 h-8 w-8 border-2 border-blue-500/30 rounded-full animate-pulse" />
                </div>
                <p className="text-sm mt-2 animate-pulse">Searching...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="py-2">
                {/* Group by category */}
                {Object.entries(
                  filteredItems.reduce((acc, item) => {
                    const category = item.category || 'Other';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(item);
                    return acc;
                  }, {} as Record<string, CommandItem[]>)
                ).map(([category, items], categoryIndex) => (
                  <div 
                    key={category} 
                    className={`mb-1 animate-in slide-in-from-top-4 fade-in duration-300`}
                    style={{ animationDelay: `${categoryIndex * 50}ms` }}
                  >
                    <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider transform transition-all duration-200 hover:text-gray-700">
                      {category}
                    </div>
                    {items.map((item: CommandItem, index: number) => {
                      const globalIndex = filteredItems.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            item.action();
                            handleClose();
                          }}
                          className={`w-full px-6 py-3 flex items-center space-x-4 text-left transition-all duration-200 hover:bg-gray-50 hover:translate-x-1 group ${
                            globalIndex === selectedIndex 
                              ? 'bg-blue-50 border-r-2 border-blue-500 shadow-sm' 
                              : ''
                          }`}
                          style={{ animationDelay: `${(categoryIndex * 50) + (index * 25)}ms` }}
                        >
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
                            item.color || 'bg-gray-100 group-hover:bg-gray-200'
                          } ${globalIndex === selectedIndex ? 'shadow-sm' : ''}`}>
                            <Icon className={`h-5 w-5 transition-all duration-200 group-hover:scale-110 ${
                              item.color ? item.color.split(' ')[0] : 'text-gray-600'
                            } ${globalIndex === selectedIndex ? 'text-blue-600' : ''}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate transition-colors duration-200 group-hover:text-blue-600">
                              {item.label}
                            </div>
                            {item.sublabel && (
                              <div className="text-sm text-gray-500 truncate transition-colors duration-200 group-hover:text-gray-600">
                                {item.sublabel}
                              </div>
                            )}
                          </div>
                          {globalIndex === selectedIndex && (
                            <div className="text-blue-500 animate-in fade-in zoom-in duration-200">
                              <Command className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="px-6 py-8 text-center text-gray-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="relative">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-pulse" />
                  <div className="absolute -inset-2 bg-gray-200/50 rounded-full animate-ping opacity-20" />
                </div>
                <p className="text-lg font-medium animate-in fade-in duration-500 delay-200">No results found</p>
                <p className="text-sm animate-in fade-in duration-500 delay-300">Try searching for events, categories, or actions</p>
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="relative">
                  <Command className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-bounce" />
                  <div className="absolute -inset-1 bg-blue-500/10 rounded-full animate-pulse" />
                </div>
                <p className="text-lg font-medium animate-in fade-in duration-500 delay-200">Start typing to search</p>
                <p className="text-sm animate-in fade-in duration-500 delay-300">Find events, browse categories, or run actions</p>
              </div>
            )}
          </div>

          {/* Animated Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-bottom-4 fade-in duration-300 delay-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 group">
                  <kbd className="px-1.5 py-1 bg-white rounded shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105">↑</kbd>
                  <kbd className="px-1.5 py-1 bg-white rounded shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105">↓</kbd>
                  <span className="transition-colors duration-200 group-hover:text-gray-700">Navigate</span>
                </div>
                <div className="flex items-center space-x-1 group">
                  <kbd className="px-1.5 py-1 bg-white rounded shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105">↵</kbd>
                  <span className="transition-colors duration-200 group-hover:text-gray-700">Select</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 group">
                <kbd className="px-1.5 py-1 bg-white rounded shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105">ESC</kbd>
                <span className="transition-colors duration-200 group-hover:text-gray-700">Close</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced hook with animations and better UX
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle opening with slight delay for smooth animation
  const openCommandPalette = () => {
    setMounted(true);
    setTimeout(() => setIsOpen(true), 10);
  };

  // Handle closing with animation completion
  const closeCommandPalette = () => {
    setIsOpen(false);
    setTimeout(() => setMounted(false), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return {
    isOpen: mounted && isOpen,
    openCommandPalette,
    closeCommandPalette,
  };
}
