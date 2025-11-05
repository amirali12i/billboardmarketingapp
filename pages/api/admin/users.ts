import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/middleware'
import prisma from '@/lib/db'

/**
 * GET /api/admin/users
 * List all users with pagination and filters
 * Requires ADMIN role
 */
async function handler(
  req: NextRequest,
  context: any,
  auth: { userId: string; userEmail: string; userRole: string; userPlan: string }
) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const plan = searchParams.get('plan') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ]
    }

    if (role) {
      where.role = role
    }

    if (plan) {
      where.plan = plan
    }

    // Get total count
    const total = await prisma.user.count({ where })

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        plan: true,
        planExpiry: true,
        projectsCount: true,
        aiUsageCount: true,
        storageUsed: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        emailVerified: true,
        _count: {
          select: {
            projects: true,
            sessions: true,
            apiKeys: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export const GET = withAdmin(handler)
