import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import '../src/index.css';

// Dynamically import the App component with no SSR
const AdminApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg font-semibold text-gray-900">Loading Admin Panel...</div>
      </div>
    </div>
  ),
});

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-900">Loading...</div>
        </div>
      </div>
    );
  }

  return <AdminApp />;
}
