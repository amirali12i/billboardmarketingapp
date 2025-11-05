'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap, Twitter, Facebook, Instagram, Linkedin, Youtube, Mail,
  ArrowRight, Heart, MapPin, Phone
} from 'lucide-react'
import { BRAND, FOOTER_LINKS } from '@/lib/constants'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  const socialLinks = [
    { icon: Twitter, href: BRAND.social.twitter, label: 'Twitter' },
    { icon: Facebook, href: BRAND.social.facebook, label: 'Facebook' },
    { icon: Instagram, href: BRAND.social.instagram, label: 'Instagram' },
    { icon: Linkedin, href: BRAND.social.linkedin, label: 'LinkedIn' },
    { icon: Youtube, href: BRAND.social.youtube, label: 'YouTube' },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h3 className="text-2xl font-display font-bold text-white">
                Stay Updated
              </h3>
              <p className="mt-2 text-primary-100">
                Get the latest updates, tips, and exclusive offers delivered to your inbox.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:flex-shrink-0">
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm w-64"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {subscribed ? (
                    <>
                      <Heart className="w-5 h-5" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {BRAND.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{BRAND.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{BRAND.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                  {BRAND.email}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                    title={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
              {FOOTER_LINKS.product.titleEn}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.product.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
              {FOOTER_LINKS.company.titleEn}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
              {FOOTER_LINKS.support.titleEn}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
              {FOOTER_LINKS.legal.titleEn}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for creative professionals
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
