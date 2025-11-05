'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Plus, FolderOpen, Clock, Star, Trash2, MoreVertical, Search,
  Grid, List, Filter, Download, Share2, Copy, Eye, TrendingUp,
  Users, Target, Zap, BarChart3, Calendar, ArrowRight, Sparkles,
  Box, Palette, FileImage, Image as ImageIcon, AlertCircle
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Empty from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'

interface Project {
  id: string
  name: string
  description?: string | null
  thumbnail?: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  visibility: 'PRIVATE' | 'PUBLIC' | 'UNLISTED'
  width: number
  height: number
  viewsCount: number
  downloadsCount: number
  createdAt: string
  updatedAt: string
  _count?: {
    versions: number
    collaborators: number
  }
}

interface User {
  id: string
  email: string
  name: string | null
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  projectsCount: number
  aiUsageCount: number
  storageUsed: number
}

interface DashboardData {
  user: User
  stats: {
    totalProjects: number
    thisMonth: number
    totalViews: number
    totalDownloads: number
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState<'all' | 'recent' | 'starred'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isProjectsLoading, setIsProjectsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [dashboardStats, setDashboardStats] = useState({
    totalProjects: 0,
    thisMonth: 0,
    totalViews: 0,
    totalDownloads: 0
  })

  // Fetch user data and stats
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/signin')
            return
          }
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setUser(data.user)
        setDashboardStats({
          totalProjects: data.user.projectsCount || 0,
          thisMonth: 0, // Will be calculated from projects
          totalViews: 0, // Will be calculated from projects
          totalDownloads: 0 // Will be calculated from projects
        })
      } catch (err: any) {
        console.error('Error fetching user data:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsProjectsLoading(true)
      try {
        const params = new URLSearchParams({
          page: '1',
          limit: '20',
          sortBy: 'updatedAt',
          sortOrder: 'desc'
        })

        if (searchQuery) {
          params.append('search', searchQuery)
        }

        if (filter === 'recent') {
          params.set('sortBy', 'updatedAt')
        }

        const response = await fetch(`/api/projects?${params.toString()}`)

        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }

        const data = await response.json()
        setProjects(data.data.projects || [])

        // Calculate stats from projects
        const totalViews = data.data.projects.reduce((sum: number, p: Project) => sum + p.viewsCount, 0)
        const totalDownloads = data.data.projects.reduce((sum: number, p: Project) => sum + p.downloadsCount, 0)

        // Count projects created this month
        const now = new Date()
        const thisMonth = data.data.projects.filter((p: Project) => {
          const createdDate = new Date(p.createdAt)
          return createdDate.getMonth() === now.getMonth() &&
                 createdDate.getFullYear() === now.getFullYear()
        }).length

        setDashboardStats(prev => ({
          ...prev,
          totalViews,
          totalDownloads,
          thisMonth
        }))
      } catch (err: any) {
        console.error('Error fetching projects:', err)
        setError(err.message)
      } finally {
        setIsProjectsLoading(false)
      }
    }

    if (user) {
      fetchProjects()
    }
  }, [user, searchQuery, filter])

  const stats = [
    {
      label: 'کل پروژه‌ها',
      value: dashboardStats.totalProjects.toString(),
      change: '+12%',
      trend: 'up',
      icon: FolderOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'این ماه',
      value: dashboardStats.thisMonth.toString(),
      change: '+25%',
      trend: 'up',
      icon: Calendar,
      color: 'from-green-500 to-teal-500'
    },
    {
      label: 'بازدید کل',
      value: dashboardStats.totalViews >= 1000
        ? `${(dashboardStats.totalViews / 1000).toFixed(1)}K`
        : dashboardStats.totalViews.toString(),
      change: '+18%',
      trend: 'up',
      icon: Eye,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'دانلودها',
      value: dashboardStats.totalDownloads.toString(),
      change: '+8%',
      trend: 'up',
      icon: Download,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const quickActions = [
    {
      title: 'پروژه جدید',
      description: 'شروع از صفحه خالی',
      icon: Plus,
      color: 'from-primary-500 to-accent-500',
      href: '/editor'
    },
    {
      title: 'از قالب',
      description: '500+ قالب آماده',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      href: '/editor?tab=templates'
    },
    {
      title: 'AI Designer',
      description: 'طراحی با هوش مصنوعی',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-500',
      href: '/editor?ai=true'
    },
    {
      title: 'نمایش 3D',
      description: 'پیش‌نمایش سه‌بعدی',
      icon: Box,
      color: 'from-blue-500 to-cyan-500',
      href: '/preview-3d'
    }
  ]


  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">خطا</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button variant="primary" onClick={() => router.push('/signin')}>
              ورود به حساب
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                داشبورد
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                خوش آمدید، {user?.name || user?.email}
              </p>
              {user && (
                <Badge
                  variant={user.plan === 'FREE' ? 'secondary' : user.plan === 'PRO' ? 'primary' : 'success'}
                  size="sm"
                  className="mt-2"
                >
                  {user.plan === 'FREE' ? 'رایگان' : user.plan === 'PRO' ? 'حرفه‌ای' : 'سازمانی'}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="md">
                <Share2 className="w-5 h-5" />
                اشتراک‌گذاری
              </Button>
              <Link href="/editor">
                <Button variant="primary" size="md">
                  <Plus className="w-5 h-5" />
                  پروژه جدید
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            شروع سریع
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link href={action.href}>
                  <Card
                    className="p-6 cursor-pointer group"
                    hover
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              پروژه‌های من
            </h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  همه
                </button>
                <button
                  onClick={() => setFilter('recent')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === 'recent'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  اخیر
                </button>
                <button
                  onClick={() => setFilter('starred')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === 'starred'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  ستاره‌دار
                </button>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid/List */}
          {isProjectsLoading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-4">
                  <Skeleton variant="rectangular" height="12rem" className="mb-4" />
                  <Skeleton variant="text" width="80%" className="mb-2" />
                  <Skeleton variant="text" width="60%" />
                </Card>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <Empty
              icon={FolderOpen}
              title="هنوز پروژه‌ای ندارید"
              description="اولین بیلبورد خود را با استفاده از قالب‌های آماده یا AI طراحی کنید"
              action={{
                label: 'ایجاد پروژه جدید',
                onClick: () => window.location.href = '/editor',
                icon: <Plus className="w-5 h-5" />
              }}
              secondaryAction={{
                label: 'مشاهده قالب‌ها',
                onClick: () => window.location.href = '/editor?tab=templates'
              }}
            />
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Card className="p-4 group cursor-pointer" hover>
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-4 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                      </div>
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                          <Eye className="w-5 h-5 text-white" />
                        </button>
                        <Link href={`/editor?project=${project.id}`}>
                          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                            <FileImage className="w-5 h-5 text-white" />
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Box className="w-4 h-4" />
                        {project.width}×{project.height}
                      </span>
                      {project._count && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {project._count.versions} نسخه
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {project.viewsCount} بازدید
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {project.downloadsCount} دانلود
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          project.status === 'PUBLISHED' ? 'success' :
                          project.status === 'ARCHIVED' ? 'secondary' :
                          'warning'
                        }
                        size="sm"
                      >
                        {project.status === 'PUBLISHED' ? 'منتشر شده' :
                         project.status === 'ARCHIVED' ? 'بایگانی شده' :
                         'پیش‌نویس'}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(project.updatedAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
