/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['grammy'],
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/webhook/:path*',
        destination: '/api/webhook/:path*',
      },
    ];
  },
};

module.exports = nextConfig;