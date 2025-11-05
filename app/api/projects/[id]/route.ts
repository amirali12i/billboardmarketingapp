import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/middleware'
import { rateLimit } from '@/lib/rate-limit'

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  data: z.any().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC', 'UNLISTED']).optional(),
  thumbnail: z.string().url().optional(),
  createVersion: z.boolean().default(false),
})

/**
 * GET /api/projects/[id] - Get single project details
 */
export const GET = withAuth(
  async (req: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const projectId = params.id

      // Rate limiting
      const rateCheck = await rateLimit(req as any, {
        interval: 60 * 1000,
        maxRequests: 60,
      })

      if (!rateCheck.success) {
        return NextResponse.json(
          { error: 'Too many requests', resetTime: rateCheck.reset },
          { status: 429 }
        )
      }

      // Get project with all details
      const project = await db.project.findUnique({
        where: { id: projectId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          versions: {
            select: {
              id: true,
              version: true,
              createdAt: true,
              createdBy: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              version: 'desc',
            },
            take: 10,
          },
          collaborators: {
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
              addedAt: true,
            },
          },
          _count: {
            select: {
              versions: true,
              collaborators: true,
            },
          },
        },
      })

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      // Check if user has access to this project
      const hasAccess =
        project.userId === auth.userId ||
        project.visibility === 'PUBLIC' ||
        project.collaborators.some((c) => c.user.id === auth.userId)

      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Increment view count if not the owner
      if (project.userId !== auth.userId) {
        await db.project.update({
          where: { id: projectId },
          data: {
            viewsCount: {
              increment: 1,
            },
          },
        })
      }

      return NextResponse.json({
        success: true,
        data: project,
      })
    } catch (error: any) {
      console.error('Get project error:', error)
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 }
      )
    }
  }
)

/**
 * PUT /api/projects/[id] - Update project
 */
export const PUT = withAuth(
  async (req: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const projectId = params.id

      // Rate limiting
      const rateCheck = await rateLimit(req as any, {
        interval: 60 * 1000,
        maxRequests: 30,
      })

      if (!rateCheck.success) {
        return NextResponse.json(
          { error: 'Too many requests', resetTime: rateCheck.reset },
          { status: 429 }
        )
      }

      // Parse and validate request body
      const body = await req.json()
      const validation = updateProjectSchema.safeParse(body)

      if (!validation.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        )
      }

      const { createVersion, ...updateData } = validation.data

      // Convert data field to JSON string if present
      if (updateData.data) {
        updateData.data = JSON.stringify(updateData.data)
      }

      // Get existing project
      const existingProject = await db.project.findUnique({
        where: { id: projectId },
        include: {
          collaborators: {
            select: {
              userId: true,
              role: true,
            },
          },
        },
      })

      if (!existingProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      // Check if user has permission to edit
      const isOwner = existingProject.userId === auth.userId
      const isEditor = existingProject.collaborators.some(
        (c) => c.userId === auth.userId && (c.role === 'EDITOR' || c.role === 'ADMIN')
      )

      if (!isOwner && !isEditor) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Update project
      const updatedProject = await db.project.update({
        where: { id: projectId },
        data: {
          ...updateData,
          updatedAt: new Date(),
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

      // Create version if requested and data changed
      if (createVersion && updateData.data) {
        const latestVersion = await db.projectVersion.findFirst({
          where: { projectId },
          orderBy: { version: 'desc' },
          select: { version: true },
        })

        await db.projectVersion.create({
          data: {
            projectId,
            version: (latestVersion?.version || 0) + 1,
            data: updateData.data,
            createdById: auth.userId,
          },
        })
      }

      // Log usage
      await db.usageLog.create({
        data: {
          userId: auth.userId,
          action: 'PROJECT_UPDATE',
          metadata: JSON.stringify({
            projectId,
            projectName: updatedProject.name,
            timestamp: new Date().toISOString(),
          }),
        },
      })

      return NextResponse.json({
        success: true,
        data: updatedProject,
      })
    } catch (error: any) {
      console.error('Update project error:', error)
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 }
      )
    }
  }
)

/**
 * DELETE /api/projects/[id] - Delete project (soft delete)
 */
export const DELETE = withAuth(
  async (req: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const projectId = params.id

      // Rate limiting
      const rateCheck = await rateLimit(req as any, {
        interval: 60 * 1000,
        maxRequests: 20,
      })

      if (!rateCheck.success) {
        return NextResponse.json(
          { error: 'Too many requests', resetTime: rateCheck.reset },
          { status: 429 }
        )
      }

      // Get existing project
      const existingProject = await db.project.findUnique({
        where: { id: projectId },
        select: {
          userId: true,
          name: true,
        },
      })

      if (!existingProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      // Only owner can delete
      if (existingProject.userId !== auth.userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Soft delete by archiving
      await db.project.update({
        where: { id: projectId },
        data: {
          status: 'ARCHIVED',
          updatedAt: new Date(),
        },
      })

      // Decrement user's project count
      await db.user.update({
        where: { id: auth.userId },
        data: {
          projectsCount: {
            decrement: 1,
          },
        },
      })

      // Log usage
      await db.usageLog.create({
        data: {
          userId: auth.userId,
          action: 'PROJECT_DELETE',
          metadata: JSON.stringify({
            projectId,
            projectName: existingProject.name,
            timestamp: new Date().toISOString(),
          }),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Project deleted successfully',
      })
    } catch (error: any) {
      console.error('Delete project error:', error)
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 }
      )
    }
  }
)
