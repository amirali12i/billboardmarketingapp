import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { withAuth } from '@/lib/middleware'
import { canPerformAction } from '@/lib/plans'
import { rateLimit } from '@/lib/rate-limit'

const duplicateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  includeCollaborators: z.boolean().default(false),
})

/**
 * POST /api/projects/[id]/duplicate - Duplicate a project
 */
export const POST = withAuth(
  async (req: NextRequest, { params }: { params: { id: string } }, auth) => {
    try {
      const projectId = params.id

      // Rate limiting
      const rateCheck = await rateLimit(req as any, {
        interval: 60 * 1000,
        maxRequests: 5, // Duplicating is heavy, so lower limit
      })

      if (!rateCheck.success) {
        return NextResponse.json(
          { error: 'Too many requests', resetTime: rateCheck.reset },
          { status: 429 }
        )
      }

      // Parse and validate request body
      const body = await req.json().catch(() => ({}))
      const validation = duplicateProjectSchema.safeParse(body)

      if (!validation.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        )
      }

      const { name, includeCollaborators } = validation.data

      // Get original project
      const originalProject = await db.project.findUnique({
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

      if (!originalProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      // Check if user has access to this project
      const hasAccess =
        originalProject.userId === auth.userId ||
        originalProject.visibility === 'PUBLIC' ||
        originalProject.collaborators.some((c) => c.userId === auth.userId)

      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
          },
          { status: 403 }
        )
      }

      // Create duplicated project
      const duplicatedProject = await db.project.create({
        data: {
          name: name || `${originalProject.name} (Copy)`,
          description: originalProject.description,
          width: originalProject.width,
          height: originalProject.height,
          userId: auth.userId,
          data: originalProject.data,
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

      // Create initial version for duplicated project
      await db.projectVersion.create({
        data: {
          projectId: duplicatedProject.id,
          version: 1,
          data: duplicatedProject.data,
          createdById: auth.userId,
        },
      })

      // Copy collaborators if requested (only if user is the owner)
      if (includeCollaborators && originalProject.userId === auth.userId) {
        const collaboratorsData = originalProject.collaborators.map((c) => ({
          projectId: duplicatedProject.id,
          userId: c.userId,
          role: c.role,
        }))

        if (collaboratorsData.length > 0) {
          await db.projectCollaborator.createMany({
            data: collaboratorsData,
          })
        }
      }

      // Log usage
      await db.usageLog.create({
        data: {
          userId: auth.userId,
          action: 'PROJECT_CREATE',
          metadata: JSON.stringify({
            projectId: duplicatedProject.id,
            projectName: duplicatedProject.name,
            duplicatedFrom: projectId,
            timestamp: new Date().toISOString(),
          }),
        },
      })

      return NextResponse.json(
        {
          success: true,
          data: duplicatedProject,
          message: 'Project duplicated successfully',
        },
        { status: 201 }
      )
    } catch (error: any) {
      console.error('Duplicate project error:', error)
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
