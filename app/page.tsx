'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap, Sparkles, Box, Palette, Globe, TrendingUp, Star, Check,
  ArrowRight, Users, Shield, Rocket, Target, Clock, BarChart3,
  Play, ChevronRight
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BRAND, PLANS } from '@/lib/constants'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch current user
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user || null))
      .finally(() => setLoading(false))
  }, [])

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Design',
      description: 'Generate stunning billboard designs with advanced AI technology',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Box,
      title: '3D Visualization',
      description: 'Preview your billboards in realistic 3D environments',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'Professional Templates',
      description: 'Access hundreds of customizable professional templates',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Multi-language support with RTL layouts',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track performance and optimize your campaigns',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team in real-time',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  const stats = [
    { value: '10K+', label: 'Billboards Created' },
    { value: '99%', label: 'Customer Satisfaction' },
    { value: '5x', label: 'Faster Production' },
    { value: '24/7', label: 'Support Available' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechCorp',
      image: 'SJ',
      content: 'BillboardPro transformed our advertising workflow. We create campaigns 5x faster now!'
    },
    {
      name: 'Michael Chen',
      role: 'Creative Lead',
      company: 'DesignStudio',
      image: 'MC',
      content: 'The AI features are incredible. It\'s like having a professional designer on demand.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO',
      company: 'AdAgency Plus',
      image: 'ER',
      content: 'Game-changer for our agency. Clients love the 3D previews and quick turnaround.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                AI + 3D Powered Platform
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                Design Billboards
                <br />
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  With AI Power
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {BRAND.description}. Create professional advertising campaigns in minutes, not hours.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={user ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {['BG', 'RP', 'YL', 'GB'].map((initials, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-sm font-bold"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Loved by 10,000+ users
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl transform rotate-6 opacity-20 blur-3xl" />
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">BillboardPro</p>
                          <p className="text-sm text-gray-500">AI Designer</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                        Active
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-32 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-xl flex items-center justify-center">
                        <Box className="w-12 h-12 text-primary-500" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">+285% Performance</span>
                      </div>
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Powerful <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create stunning billboard designs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:-translate-y-1"
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

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Loved by <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Professionals</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our customers have to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Simple <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the perfect plan for your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[PLANS.FREE, PLANS.PRO, PLANS.ENTERPRISE].map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 ${
                  plan.popular
                    ? 'border-primary-500 shadow-2xl scale-105'
                    : 'border-gray-200 dark:border-gray-700 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.nameEn}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {typeof plan.price === 'number' ? `$${plan.price}` : plan.currencyEn}
                  </span>
                  {typeof plan.price === 'number' && (
                    <span className="text-gray-600 dark:text-gray-400">/{plan.intervalEn}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.featuresEn.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={`block w-full py-3 rounded-xl font-bold text-center transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-xl hover:scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline font-semibold"
            >
              View detailed pricing
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 text-center shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of professionals creating stunning billboards with AI
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={user ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
