import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/middleware'
import prisma from '@/lib/db'

/**
 * GET /api/admin/stats
 * Get platform statistics and analytics
 * Requires ADMIN role
 */
async function handler(
  req: NextRequest,
  context: any,
  auth: { userId: string; userEmail: string; userRole: string; userPlan: string }
) {
  try {
    // Get total counts
    const [
      totalUsers,
      totalProjects,
      totalSessions,
      totalApiKeys,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.session.count(),
      prisma.apiKey.count(),
    ])

    // Get user counts by plan
    const usersByPlan = await prisma.user.groupBy({
      by: ['plan'],
      _count: {
        id: true,
      },
    })

    // Get user counts by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
    })

    // Get project counts by status
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    })

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Get recent projects (last 30 days)
    const recentProjects = await prisma.project.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Get total AI usage
    const aiUsage = await prisma.user.aggregate({
      _sum: {
        aiUsageCount: true,
      },
    })

    // Get total storage used
    const storageUsed = await prisma.user.aggregate({
      _sum: {
        storageUsed: true,
      },
    })

    // Get recent usage logs (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentUsageLogs = await prisma.usageLog.groupBy({
      by: ['action'],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    })

    // Get top users by project count
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        projectsCount: true,
        aiUsageCount: true,
        plan: true,
      },
      orderBy: {
        projectsCount: 'desc',
      },
      take: 10,
    })

    // Calculate growth rates
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const usersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    })

    const projectsLastMonth = await prisma.project.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    })

    const userGrowthRate = usersLastMonth > 0
      ? ((recentUsers - usersLastMonth) / usersLastMonth) * 100
      : 0

    const projectGrowthRate = projectsLastMonth > 0
      ? ((recentProjects - projectsLastMonth) / projectsLastMonth) * 100
      : 0

    // Active sessions
    const activeSessions = await prisma.session.count({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    return NextResponse.json({
      overview: {
        totalUsers,
        totalProjects,
        totalSessions,
        totalApiKeys,
        activeSessions,
        recentUsers,
        recentProjects,
        totalAiUsage: aiUsage._sum.aiUsageCount || 0,
        totalStorageUsed: storageUsed._sum.storageUsed || 0,
      },
      growth: {
        userGrowthRate: Math.round(userGrowthRate * 10) / 10,
        projectGrowthRate: Math.round(projectGrowthRate * 10) / 10,
      },
      distribution: {
        usersByPlan: usersByPlan.reduce((acc, curr) => {
          acc[curr.plan] = curr._count.id
          return acc
        }, {} as Record<string, number>),
        usersByRole: usersByRole.reduce((acc, curr) => {
          acc[curr.role] = curr._count.id
          return acc
        }, {} as Record<string, number>),
        projectsByStatus: projectsByStatus.reduce((acc, curr) => {
          acc[curr.status] = curr._count.id
          return acc
        }, {} as Record<string, number>),
      },
      recentActivity: recentUsageLogs.map((log) => ({
        action: log.action,
        count: log._count.id,
      })),
      topUsers,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

export const GET = withAdmin(handler)
