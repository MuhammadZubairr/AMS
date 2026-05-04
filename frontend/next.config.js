/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimization settings
  compress: true,
  poweredByHeader: false,

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Rewrites for API calls (optional: helps with CORS)
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
        {
          source: '/health/:path*',
          destination: `${apiUrl}/health/:path*`,
        },
      ],
    };
  },

  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Build optimization
  swcMinify: true,

  // Experimental features (optional)
  experimental: {
    optimizePackageImports: ['lodash-es', 'date-fns'],
  },
};

module.exports = nextConfig;
