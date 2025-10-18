/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🐳 Configuration Docker optimisée
  output: 'standalone',
  
  // 🖼️ Configuration des images
  images: {
    domains: ['images.unsplash.com', 'localhost', '127.0.0.1', 'apilogodouman.genea.space', 'logodouman-backend'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4002',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'apilogodouman.genea.space',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'logodouman-backend',
        port: '4002',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: false,
  },
  
  // 🔧 Configuration ESLint et TypeScript pour Docker
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'pages', 'components', 'lib', 'src'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // 🌐 Configuration des rewrites pour l'API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002'}/:path*`,
      },
    ];
  },
  
  // 🔄 Configuration des redirections
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },
  
  // 🔒 Configuration des headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
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
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_SITE_URL || process.env.CORS_ORIGIN || 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  
  // 🔧 Configuration expérimentale
  experimental: {
    // Optimisations pour Docker
    outputFileTracingRoot: '/app',
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // 📦 Configuration Webpack pour Docker
  webpack: (config, { isServer }) => {
    // Optimisations pour l'environnement containerisé
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@prisma/client');
    }
    
    return config;
  },
  
  // 🌍 Variables d'environnement publiques
  env: {
    CUSTOM_KEY: 'logodouman',
    DOCKER_ENV: process.env.DOCKER_ENV || 'true',
  },
  
  // ⚡ Configuration des performances
  compress: true,
  poweredByHeader: false,
  
  // 🔍 Configuration de traçabilité
  trailingSlash: false,
  
  // 📱 Configuration PWA (si nécessaire)
  swcMinify: true,
}

module.exports = nextConfig
