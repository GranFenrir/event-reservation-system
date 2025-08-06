'use client';

import { Calendar, Search, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  type: 'no-events' | 'no-search-results' | 'error' | 'no-favorites';
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onRetry?: () => void;
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  actionText, 
  actionHref,
  onRetry 
}: EmptyStateProps) {
  const configs = {
    'no-events': {
      icon: Calendar,
      title: title || 'No Events Available',
      description: description || 'There are currently no events scheduled. Check back later for exciting new events!',
      actionText: actionText || 'Browse All Categories',
      actionHref: actionHref || '/events'
    },
    'no-search-results': {
      icon: Search,
      title: title || 'No Events Found',
      description: description || "We couldn't find any events matching your search. Try adjusting your filters or search terms.",
      actionText: actionText || 'Clear Filters',
    },
    'error': {
      icon: AlertCircle,
      title: title || 'Something Went Wrong',
      description: description || 'We encountered an error loading events. Please try again.',
      actionText: actionText || 'Retry',
    },
    'no-favorites': {
      icon: Calendar,
      title: title || 'No Favorite Events Yet',
      description: description || 'Start exploring events and add them to your favorites for quick access.',
      actionText: actionText || 'Discover Events',
      actionHref: actionHref || '/events'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {config.title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {config.description}
        </p>

        <div className="space-y-3">
          {(config as any).actionHref && (
            <Link
              href={(config as any).actionHref}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {config.actionText}
            </Link>
          )}
          
          {onRetry && type === 'error' && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {config.actionText}
            </button>
          )}
          
          {type === 'no-search-results' && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {config.actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
