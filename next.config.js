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
  // i18n support
  i18n: {
    locales: ['en', 'fa'],
    defaultLocale: 'en',
    localeDetection: true,
  },
}

module.exports = nextConfig
