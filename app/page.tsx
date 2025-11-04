'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Palette,
  Zap,
  Globe,
  ArrowRight,
  Check,
  Box,
  Cpu,
  Layers,
  TrendingUp,
  Star,
  Play,
} from 'lucide-react'

const Billboard3D = lazy(() => import('@/components/Billboard3D'))

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const features = [
    {
      icon: Sparkles,
      title: 'هوش مصنوعی پیشرفته',
      description: 'تولید خودکار تصاویر و متن‌های تبلیغاتی با کیفیت حرفه‌ای',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Box,
      title: 'نمایش سه‌بعدی',
      description: 'پیش‌نمایش واقع‌گرایانه بیلبورد در محیط 3D',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'قالب‌های آماده',
      description: 'دسترسی به صدها قالب حرفه‌ای و قابل تنظیم',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'سرعت بالا',
      description: 'طراحی و صادرسازی در عرض دقایق، نه ساعت‌ها',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Globe,
      title: 'پشتیبانی از فارسی',
      description: 'طراحی کامل برای زبان فارسی و راست‌چین',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Layers,
      title: 'ابزارهای حرفه‌ای',
      description: 'مدیریت لایه، فیلترها و افکت‌های پیشرفته',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'بیلبورد طراحی شده' },
    { value: '99%', label: 'رضایت مشتریان' },
    { value: '5x', label: 'سرعت تولید' },
    { value: '24/7', label: 'پشتیبانی' }
  ]

  const pricingPlans = [
    {
      name: 'رایگان',
      price: '0',
      features: [
        '5 طرح در ماه',
        'قالب‌های پایه',
        'خروجی با کیفیت استاندارد',
        'پشتیبانی ایمیل'
      ],
      cta: 'شروع رایگان',
      popular: false
    },
    {
      name: 'حرفه‌ای',
      price: '299,000',
      features: [
        'طرح‌های نامحدود',
        'تمام قالب‌ها و ابزارها',
        'هوش مصنوعی پیشرفته',
        'خروجی 4K',
        'نمایش 3D',
        'پشتیبانی اولویت‌دار',
        'حذف واترمارک'
      ],
      cta: 'شروع آزمایشی 14 روزه',
      popular: true
    },
    {
      name: 'سازمانی',
      price: 'تماس بگیرید',
      features: [
        'همه امکانات حرفه‌ای',
        'مدیریت تیم',
        'برند کیت سفارشی',
        'API دسترسی',
        'آموزش اختصاصی',
        'پشتیبانی 24/7',
        'قراردادهای سفارشی'
      ],
      cta: 'تماس با فروش',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">
                بیلبورد مارکتینگ
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                امکانات
              </Link>
              <Link href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                قیمت‌ها
              </Link>
              <Link href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                نظرات
              </Link>
              <Link
                href="/editor"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
              >
                شروع کنید
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-block">
                <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium inline-flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  هوش مصنوعی + نمایش 3D
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight"
              >
                طراحی بیلبورد با
                <span className="gradient-text"> قدرت هوش مصنوعی</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                پلتفرم پیشرفته طراحی بیلبورد با هوش مصنوعی که کمپین‌های تبلیغاتی شما را در عرض دقایق به واقعیت تبدیل می‌کند. با نمایش سه‌بعدی و قالب‌های حرفه‌ای.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link
                  href="/editor"
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2"
                >
                  شروع رایگان
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  تماشای دمو
                </button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white dark:border-gray-900"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    بیش از 10,000 مشتری راضی
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              {mounted && (
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                  }
                >
                  <Billboard3D />
                </Suspense>
              )}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">نرخ تبدیل</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">+285%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              امکانات <span className="gradient-text">پیشرفته</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              ابزارهای حرفه‌ای برای ساخت بیلبوردهای تاثیرگذار
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              پلن <span className="gradient-text">مناسب</span> خود را انتخاب کنید
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              قیمت‌گذاری شفاف و منصفانه برای هر اندازه کسب‌وکار
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 ${
                  plan.popular
                    ? 'ring-4 ring-primary-500 shadow-2xl scale-105'
                    : 'shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    محبوب‌ترین
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== 'تماس بگیرید' && (
                    <span className="text-gray-600 dark:text-gray-400"> تومان/ماه</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-xl hover:scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              آماده شروع هستید؟
            </h2>
            <p className="text-xl text-white/90 mb-8">
              همین حالا بیلبورد حرفه‌ای خود را با هوش مصنوعی طراحی کنید
            </p>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
            >
              شروع رایگان - بدون نیاز به کارت اعتباری
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <Box className="w-6 h-6" />
                </div>
                <span className="text-xl font-display font-bold">بیلبورد مارکتینگ</span>
              </div>
              <p className="text-gray-400">
                پلتفرم پیشرفته طراحی بیلبورد با هوش مصنوعی
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">محصول</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">امکانات</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">قیمت‌ها</Link></li>
                <li><Link href="/editor" className="hover:text-white transition-colors">ویرایشگر</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">شرکت</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">درباره ما</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">بلاگ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">تماس با ما</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">قانونی</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">حریم خصوصی</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">شرایط استفاده</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 بیلبورد مارکتینگ. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
