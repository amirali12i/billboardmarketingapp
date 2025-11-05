import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/middleware'
import { canPerformAction } from '@/lib/plans'
import { rateLimit } from '@/lib/rate-limit'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(500).optional(),
  width: z.number().min(100).max(10000).default(1920),
  height: z.number().min(100).max(10000).default(1080),
  templateId: z.string().optional(),
  data: z.any().optional(),
})

const listProjectsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * GET /api/projects - List user's projects with pagination
 */
export const GET = withAuth(async (req: NextRequest, context, auth) => {
  try {
    // Rate limiting
    const rateCheck = await rateLimit(req as any, {
      interval: 60 * 1000, // 1 minute
      maxRequests: 30,
    })

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests', resetTime: rateCheck.reset },
        { status: 429 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const queryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') as any || undefined,
      sortBy: (searchParams.get('sortBy') || 'updatedAt') as any,
      sortOrder: (searchParams.get('sortOrder') || 'desc') as any,
    }

    const validation = listProjectsSchema.safeParse(queryParams)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { page, limit, search, status, sortBy, sortOrder } = validation.data

    // Build where clause
    const where: any = {
      userId: auth.userId,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    // Get total count
    const total = await db.project.count({ where })

    // Get projects
    const projects = await db.project.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        status: true,
        visibility: true,
        width: true,
        height: true,
        viewsCount: true,
        downloadsCount: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            versions: true,
            collaborators: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
    })
  } catch (error: any) {
    console.error('List projects error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
})

/**
 * POST /api/projects - Create a new project
 */
export const POST = withAuth(async (req: NextRequest, context, auth) => {
  try {
    // Rate limiting
    const rateCheck = await rateLimit(req as any, {
      interval: 60 * 1000, // 1 minute
      maxRequests: 10,
    })

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests', resetTime: rateCheck.reset },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validation = createProjectSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, description, width, height, templateId, data } = validation.data

    // Get current user to check limits
    const user = await db.user.findUnique({
      where: { id: auth.userId },
      select: {
        plan: true,
        projectsCount: true,
        storageUsed: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user can create more projects
    const canCreate = await canPerformAction(auth.userId, 'PROJECT_CREATE')

    if (!canCreate.allowed) {
      return NextResponse.json(
        {
          error: 'Project limit reached',
          message: canCreate.reason,
          limit: canCreate.limit,
          current: canCreate.current,
          plan: user.plan,
        },
        { status: 403 }
      )
    }

    // Create project
    const project = await db.project.create({
      data: {
        name,
        description,
        width,
        height,
        userId: auth.userId,
        data: JSON.stringify(data || {}),
        status: 'DRAFT',
        visibility: 'PRIVATE',
      },
      select: {
        id: true,
        name: true,
        description: true,
        width: true,
        height: true,
        status: true,
        visibility: true,
        thumbnail: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Update user's project count
    await db.user.update({
      where: { id: auth.userId },
      data: {
        projectsCount: {
          increment: 1,
        },
      },
    })

    // Create initial version
    await db.projectVersion.create({
      data: {
        projectId: project.id,
        version: 1,
        data: project.data,
        createdById: auth.userId,
      },
    })

    // Log usage
    await db.usageLog.create({
      data: {
        userId: auth.userId,
        action: 'PROJECT_CREATE',
        metadata: JSON.stringify({
          projectId: project.id,
          projectName: name,
          timestamp: new Date().toISOString(),
        }),
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create project error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
})
