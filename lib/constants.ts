// BillboardPro - Professional Billboard Marketing Platform
// Brand Identity & Configuration

export const BRAND = {
  name: 'BillboardPro',
  tagline: 'Professional Billboard Design & Marketing Platform',
  description: 'Create stunning billboard designs with AI-powered tools and 3D visualization',
  shortDescription: 'Design. Visualize. Market.',

  // Contact & Social
  email: 'support@billboardpro.com',
  phone: '+1 (555) 123-4567',
  address: 'San Francisco, CA',

  social: {
    twitter: 'https://twitter.com/billboardpro',
    facebook: 'https://facebook.com/billboardpro',
    instagram: 'https://instagram.com/billboardpro',
    linkedin: 'https://linkedin.com/company/billboardpro',
    youtube: 'https://youtube.com/@billboardpro'
  },

  // URLs
  website: 'https://billboardpro.com',
  blog: 'https://blog.billboardpro.com',
  docs: 'https://docs.billboardpro.com',
  support: 'https://support.billboardpro.com',
}

export const APP_CONFIG = {
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,

  // File uploads
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  maxImagesPerProject: 50,

  // Rate limiting
  rateLimits: {
    auth: { requests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
    api: { requests: 30, windowMs: 60 * 1000 }, // 30 requests per minute
    upload: { requests: 5, windowMs: 60 * 1000 }, // 5 uploads per minute
  },

  // Session
  sessionDuration: 30 * 24 * 60 * 60 * 1000, // 30 days

  // Features
  features: {
    aiGeneration: true,
    threeDVisualization: true,
    collaboration: true,
    templates: true,
    export: true,
  }
}

export const PLANS = {
  FREE: {
    id: 'FREE',
    name: 'رایگان',
    nameEn: 'Free',
    price: 0,
    currency: 'تومان',
    currencyEn: 'IRT',
    interval: 'ماه',
    intervalEn: 'month',
    features: [
      '5 پروژه',
      '10 تولید AI',
      '100 مگابایت فضای ذخیره‌سازی',
      'خروجی HD (1080p)',
      'واترمارک',
      'پشتیبانی ایمیل'
    ],
    featuresEn: [
      '5 Projects',
      '10 AI Generations',
      '100MB Storage',
      'HD Export (1080p)',
      'Watermark',
      'Email Support'
    ],
    limits: {
      projects: 5,
      aiGenerations: 10,
      storage: 100 * 1024 * 1024, // 100MB
      exportQuality: 'HD',
      watermark: true,
      collaborators: 0,
      apiAccess: false,
    }
  },
  PRO: {
    id: 'PRO',
    name: 'حرفه‌ای',
    nameEn: 'Professional',
    price: 299000,
    currency: 'تومان',
    currencyEn: 'IRT',
    interval: 'ماه',
    intervalEn: 'month',
    popular: true,
    features: [
      'پروژه‌های نامحدود',
      '1000 تولید AI در ماه',
      '10 گیگابایت ذخیره‌سازی',
      'خروجی 8K',
      'بدون واترمارک',
      '10 همکار',
      'پشتیبانی اولویت‌دار',
      'قالب‌های حرفه‌ای'
    ],
    featuresEn: [
      'Unlimited Projects',
      '1000 AI Generations/month',
      '10GB Storage',
      '8K Export',
      'No Watermark',
      '10 Collaborators',
      'Priority Support',
      'Premium Templates'
    ],
    limits: {
      projects: -1, // unlimited
      aiGenerations: 1000,
      storage: 10 * 1024 * 1024 * 1024, // 10GB
      exportQuality: '8K',
      watermark: false,
      collaborators: 10,
      apiAccess: false,
    }
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'سازمانی',
    nameEn: 'Enterprise',
    price: 0, // Custom pricing
    currency: 'تماس بگیرید',
    currencyEn: 'Contact Us',
    interval: '',
    intervalEn: '',
    features: [
      'همه چیز نامحدود',
      'AI نامحدود',
      'ذخیره‌سازی نامحدود',
      'دامنه سفارشی',
      'دسترسی API',
      'همکاران نامحدود',
      'پشتیبانی اختصاصی 24/7',
      'آموزش تیمی',
      'SLA سفارشی'
    ],
    featuresEn: [
      'Everything Unlimited',
      'Unlimited AI',
      'Unlimited Storage',
      'Custom Domain',
      'API Access',
      'Unlimited Collaborators',
      'Dedicated 24/7 Support',
      'Team Training',
      'Custom SLA'
    ],
    limits: {
      projects: -1,
      aiGenerations: -1,
      storage: -1,
      exportQuality: '8K',
      watermark: false,
      collaborators: -1,
      apiAccess: true,
    }
  }
}

export const ADMIN_CREDENTIALS = {
  email: 'admin@billboard.com',
  password: 'Billboard 2025',
  name: 'System Administrator',
  role: 'ADMIN',
  plan: 'ENTERPRISE'
}

export const ROUTES = {
  home: '/',
  signin: '/signin',
  signup: '/signup',
  dashboard: '/dashboard',
  adminDashboard: '/admin',
  profile: '/profile',
  settings: '/settings',
  pricing: '/pricing',
  help: '/help',
  docs: '/docs',
  blog: '/blog',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
}

export const NAV_LINKS = [
  { label: 'خانه', labelEn: 'Home', href: ROUTES.home },
  { label: 'قیمت‌گذاری', labelEn: 'Pricing', href: ROUTES.pricing },
  { label: 'قالب‌ها', labelEn: 'Templates', href: '/templates' },
  { label: 'راهنما', labelEn: 'Help', href: ROUTES.help },
  { label: 'بلاگ', labelEn: 'Blog', href: ROUTES.blog },
]

export const FOOTER_LINKS = {
  product: {
    title: 'محصول',
    titleEn: 'Product',
    links: [
      { label: 'ویژگی‌ها', labelEn: 'Features', href: '/#features' },
      { label: 'قیمت‌گذاری', labelEn: 'Pricing', href: ROUTES.pricing },
      { label: 'قالب‌ها', labelEn: 'Templates', href: '/templates' },
      { label: 'به‌روزرسانی‌ها', labelEn: 'Updates', href: '/updates' },
    ]
  },
  company: {
    title: 'شرکت',
    titleEn: 'Company',
    links: [
      { label: 'درباره ما', labelEn: 'About', href: ROUTES.about },
      { label: 'بلاگ', labelEn: 'Blog', href: ROUTES.blog },
      { label: 'شغل‌ها', labelEn: 'Careers', href: '/careers' },
      { label: 'تماس', labelEn: 'Contact', href: ROUTES.contact },
    ]
  },
  support: {
    title: 'پشتیبانی',
    titleEn: 'Support',
    links: [
      { label: 'راهنما', labelEn: 'Help Center', href: ROUTES.help },
      { label: 'مستندات', labelEn: 'Documentation', href: ROUTES.docs },
      { label: 'وضعیت سرویس', labelEn: 'Status', href: '/status' },
      { label: 'API', labelEn: 'API', href: '/api' },
    ]
  },
  legal: {
    title: 'قانونی',
    titleEn: 'Legal',
    links: [
      { label: 'حریم خصوصی', labelEn: 'Privacy', href: ROUTES.privacy },
      { label: 'شرایط استفاده', labelEn: 'Terms', href: ROUTES.terms },
      { label: 'امنیت', labelEn: 'Security', href: '/security' },
      { label: 'کوکی‌ها', labelEn: 'Cookies', href: '/cookies' },
    ]
  }
}
