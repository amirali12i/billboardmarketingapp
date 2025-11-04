/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable experimental features for performance
  experimental: {
    optimizeCss: true,
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // RTL support
  i18n: {
    locales: ['fa', 'en'],
    defaultLocale: 'fa',
    localeDetection: true,
  },
}

module.exports = nextConfig
