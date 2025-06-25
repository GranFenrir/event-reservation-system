/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@event-reservation/shared',
    'react-admin',
    'ra-core',
    'ra-ui-materialui',
    'ra-data-simple-rest',
    '@mui/material',
    '@mui/icons-material',
    '@mui/system',
    '@mui/lab',
  ],
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Disable server-side rendering for the admin app
  output: 'standalone',
};

module.exports = nextConfig;
