'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  Database,
  Activity,
  Clock,
  Shield,
  Zap,
  Crown,
  Building2,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import { ROUTES } from '@/lib/constants'
import { useRouter } from 'next/navigation'

interface Stats {
  overview: {
    totalUsers: number
    totalProjects: number
    totalSessions: number
    totalApiKeys: number
    activeSessions: number
    recentUsers: number
    recentProjects: number
    totalAiUsage: number
    totalStorageUsed: number
  }
  growth: {
    userGrowthRate: number
    projectGrowthRate: number
  }
  distribution: {
    usersByPlan: Record<string, number>
    usersByRole: Record<string, number>
    projectsByStatus: Record<string, number>
  }
  recentActivity: Array<{ action: string; count: number }>
  topUsers: Array<{
    id: string
    email: string
    name: string | null
    projectsCount: number
    aiUsageCount: number
    plan: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch current user
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data?.user) {
          router.push(ROUTES.signin)
          return
        }
        if (data.user.role !== 'ADMIN') {
          router.push(ROUTES.dashboard)
          return
        }
        setUser(data.user)
      })
      .catch(() => router.push(ROUTES.signin))
  }, [router])

  useEffect(() => {
    if (!user) return

    // Fetch stats
    fetch('/api/admin/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats')
        return res.json()
      })
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header user={user} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header user={user} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load statistics</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.overview.totalUsers.toLocaleString(),
      change: stats.growth.userGrowthRate,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      subtitle: `${stats.overview.recentUsers} new this month`,
    },
    {
      title: 'Total Projects',
      value: stats.overview.totalProjects.toLocaleString(),
      change: stats.growth.projectGrowthRate,
      icon: FolderKanban,
      color: 'from-purple-500 to-pink-500',
      subtitle: `${stats.overview.recentProjects} created this month`,
    },
    {
      title: 'Active Sessions',
      value: stats.overview.activeSessions.toLocaleString(),
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      subtitle: `${stats.overview.totalSessions} total sessions`,
    },
    {
      title: 'AI Generations',
      value: stats.overview.totalAiUsage.toLocaleString(),
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      subtitle: 'Total AI usage',
    },
    {
      title: 'Storage Used',
      value: formatBytes(stats.overview.totalStorageUsed),
      icon: Database,
      color: 'from-indigo-500 to-purple-500',
      subtitle: 'Total storage',
    },
    {
      title: 'API Keys',
      value: stats.overview.totalApiKeys.toLocaleString(),
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      subtitle: 'Active API keys',
    },
  ]

  const planIcons: Record<string, any> = {
    FREE: Zap,
    PRO: Crown,
    ENTERPRISE: Building2,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Platform overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {card.change !== undefined && (
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        card.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {card.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(card.change)}%
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {card.value}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {card.subtitle}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* User Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Users by Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Users by Plan
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.distribution.usersByPlan).map(([plan, count]) => {
                const Icon = planIcons[plan] || Users
                const total = stats.overview.totalUsers
                const percentage = ((count / total) * 100).toFixed(1)
                return (
                  <div key={plan}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {plan}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity (7 days)
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {activity.action.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {activity.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No recent activity
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Users
            </h3>
            <Link
              href="/admin/users"
              className="text-sm text-purple-500 hover:text-purple-600 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    User
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Plan
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Projects
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    AI Usage
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topUsers.map((user, idx) => {
                  const PlanIcon = planIcons[user.plan] || Users
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name || 'Unnamed User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                          <PlanIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {user.plan}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {user.projectsCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {user.aiUsageCount}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.45 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Link
            href="/admin/users"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Users className="w-8 h-8 text-purple-500 mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Manage Users
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View, edit, and manage user accounts
            </p>
          </Link>

          <Link
            href={ROUTES.dashboard}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <FolderKanban className="w-8 h-8 text-blue-500 mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              View Projects
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browse all platform projects
            </p>
          </Link>

          <Link
            href={ROUTES.settings}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Shield className="w-8 h-8 text-red-500 mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              System Settings
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure platform settings
            </p>
          </Link>
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
