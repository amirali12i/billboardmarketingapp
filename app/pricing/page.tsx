'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Zap, Crown, Building2, ArrowRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { PLANS, ROUTES } from '@/lib/constants'

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const plans = [
    {
      ...PLANS.FREE,
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      buttonVariant: 'secondary' as const,
    },
    {
      ...PLANS.PRO,
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      buttonVariant: 'primary' as const,
    },
    {
      ...PLANS.ENTERPRISE,
      icon: Building2,
      color: 'from-orange-500 to-red-500',
      buttonVariant: 'secondary' as const,
    },
  ]

  const faqs = [
    {
      question: 'Can I change plans later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the charges accordingly.',
    },
    {
      question: 'What happens when I reach my AI generation limit?',
      answer: 'You\'ll be notified when you\'re approaching your limit. You can either upgrade your plan or wait for the monthly reset. Enterprise plans have unlimited AI generations.',
    },
    {
      question: 'Is there a free trial for Pro or Enterprise?',
      answer: 'Yes! We offer a 14-day free trial for both Pro and Enterprise plans. No credit card required. You can cancel anytime before the trial ends.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are processed securely through our payment partners.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with BillboardPro, contact us within 30 days for a full refund.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual billing saves you 20% compared to monthly billing. Contact our sales team for annual pricing options.',
    },
    {
      question: 'What\'s included in team training for Enterprise?',
      answer: 'Enterprise plans include personalized onboarding sessions, training materials, and ongoing support to help your team get the most out of BillboardPro.',
    },
    {
      question: 'Can I export my projects if I cancel?',
      answer: 'Absolutely! You can export all your projects at any time, even after cancellation. Your data is always yours.',
    },
  ]

  const comparisonFeatures = [
    { name: 'Number of Projects', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'AI Generations', free: '10/month', pro: '1000/month', enterprise: 'Unlimited' },
    { name: 'Storage', free: '100MB', pro: '10GB', enterprise: 'Unlimited' },
    { name: 'Export Quality', free: 'HD (1080p)', pro: '8K', enterprise: '8K' },
    { name: 'Watermark', free: 'Yes', pro: 'No', enterprise: 'No' },
    { name: 'Collaborators', free: '0', pro: '10', enterprise: 'Unlimited' },
    { name: 'API Access', free: false, pro: false, enterprise: true },
    { name: 'Custom Domain', free: false, pro: false, enterprise: true },
    { name: 'Premium Templates', free: false, pro: true, enterprise: true },
    { name: 'Priority Support', free: false, pro: true, enterprise: true },
    { name: 'Dedicated Support', free: false, pro: false, enterprise: true },
    { name: 'Team Training', free: false, pro: false, enterprise: true },
    { name: 'Custom SLA', free: false, pro: false, enterprise: true },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header user={user} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your needs. Start free, upgrade anytime.
              No hidden fees, no surprises.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const isPopular = plan.popular
              const isPro = plan.id === 'PRO'
              const isEnterprise = plan.id === 'ENTERPRISE'

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${
                    isPopular ? 'ring-2 ring-purple-500 scale-105' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <div className={`p-8 ${isPopular ? 'pt-16' : ''}`}>
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.nameEn}
                    </h3>

                    {/* Price */}
                    <div className="mb-6">
                      {isEnterprise ? (
                        <>
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            Custom
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Contact us for pricing
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            ${plan.price}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            /{plan.intervalEn}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.featuresEn.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link
                      href={user ? ROUTES.dashboard : (isEnterprise ? ROUTES.contact : ROUTES.signup)}
                      className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                        isPro
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {user
                        ? user.plan === plan.id
                          ? 'Current Plan'
                          : 'Upgrade'
                        : isEnterprise
                        ? 'Contact Sales'
                        : 'Get Started'}
                      {!user && !isEnterprise && (
                        <ArrowRight className="inline-block ml-2 w-4 h-4" />
                      )}
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Compare Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Detailed feature comparison across all plans
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-6 text-gray-900 dark:text-white font-semibold">
                      Feature
                    </th>
                    <th className="text-center py-4 px-6 text-gray-900 dark:text-white font-semibold">
                      Free
                    </th>
                    <th className="text-center py-4 px-6 text-gray-900 dark:text-white font-semibold bg-purple-50 dark:bg-purple-900/20">
                      Pro
                    </th>
                    <th className="text-center py-4 px-6 text-gray-900 dark:text-white font-semibold">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                        {feature.name}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature.free}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center bg-purple-50 dark:bg-purple-900/20">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {feature.pro}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof feature.enterprise === 'boolean' ? (
                          feature.enterprise ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature.enterprise}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <HelpCircle
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of designers creating stunning billboards with BillboardPro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={user ? ROUTES.dashboard : ROUTES.signup}
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                {user ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href={ROUTES.contact}
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
