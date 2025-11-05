'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Calendar,
  Crown,
  Zap,
  Building2,
  FolderKanban,
  Database,
  Activity,
  Shield,
  ArrowRight,
  Edit,
  Check,
  X,
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import { ROUTES, PLANS } from '@/lib/constants'
import { useToast } from '@/components/ToastProvider'

export default function ProfilePage() {
  const router = useRouter()
  const toast = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
  })

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data?.user) {
          router.push(ROUTES.signin)
          return
        }
        setUser(data.user)
        setEditForm({ name: data.user.name || '' })
      })
      .catch(() => router.push(ROUTES.signin))
      .finally(() => setLoading(false))
  }, [router])

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      const data = await res.json()
      setUser(data.user)
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch (err: any) {
      toast.error('Failed to update profile', err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header user={null} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const planIcons: Record<string, any> = {
    FREE: Zap,
    PRO: Crown,
    ENTERPRISE: Building2,
  }

  const PlanIcon = planIcons[user.plan] || Zap
  const planDetails = PLANS[user.plan as keyof typeof PLANS]

  const stats = [
    {
      label: 'Projects',
      value: user.projectsCount || 0,
      limit: planDetails.limits.projects === -1 ? '∞' : planDetails.limits.projects,
      icon: FolderKanban,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'AI Generations',
      value: user.aiUsageCount || 0,
      limit: planDetails.limits.aiGenerations === -1 ? '∞' : planDetails.limits.aiGenerations,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Storage Used',
      value: formatBytes(user.storageUsed || 0),
      limit: planDetails.limits.storage === -1 ? '∞' : formatBytes(planDetails.limits.storage),
      icon: Database,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                {(user.name || user.email)[0].toUpperCase()}
              </div>
              {user.emailVerified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false)
                        setEditForm({ name: user.name || '' })
                      }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.name || 'Unnamed User'}
                    </h1>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      title="Edit profile"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                      {user.emailVerified && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {user.role === 'ADMIN' && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full text-xs font-medium">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Plan Badge */}
            <div className="flex flex-col items-center gap-2">
              <div className={`p-4 rounded-xl bg-gradient-to-r ${
                user.plan === 'FREE' ? 'from-blue-500 to-cyan-500' :
                user.plan === 'PRO' ? 'from-purple-500 to-pink-500' :
                'from-orange-500 to-red-500'
              }`}>
                <PlanIcon className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {user.plan}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Usage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Usage Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              const isUnlimited = stat.limit === '∞'
              const percentage = isUnlimited ? 0 : (parseInt(stat.value) / parseInt(stat.limit as string)) * 100

              return (
                <div key={stat.label}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {stat.value} {!isUnlimited && `/ ${stat.limit}`}
                      </p>
                    </div>
                  </div>
                  {!isUnlimited && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Plan Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Current Plan: {planDetails.nameEn}
            </h2>
            {user.plan !== 'ENTERPRISE' && (
              <Link
                href={ROUTES.pricing}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                Upgrade Plan
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planDetails.featuresEn.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {user.planExpiry && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your plan expires on {new Date(user.planExpiry).toLocaleDateString()}
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
