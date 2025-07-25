/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration Docker optimisée
  output: 'standalone',
  
  // Configuration expérimentale
  experimental: {
    // Désactivé car deprecated dans Next.js 14
    // appDir: true,
  },
  
  // Configuration des images pour Docker
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Configuration ESLint et TypeScript pour Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuration pour les redirections
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'admin_token',
          },
        ],
      },
    ];
  },
  
  // Configuration des headers de sécurité
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.CORS_ORIGIN || 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  
  // Configuration pour Docker
  env: {
    DOCKER_ENV: process.env.DOCKER_ENV || 'false',
  },
  
  // Configuration du serveur pour Docker
  serverRuntimeConfig: {
    // Variables côté serveur uniquement
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'http://backend:4002' 
      : 'http://localhost:4002',
  },
  
  publicRuntimeConfig: {
    // Variables exposées côté client
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002',
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig
