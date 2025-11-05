import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import prisma from '@/lib/db'

/**
 * PUT /api/user/profile
 * Update user profile
 * Requires authentication
 */
async function handler(
  req: NextRequest,
  context: any,
  auth: { userId: string; userEmail: string; userRole: string; userPlan: string }
) {
  try {
    const body = await req.json()
    const { name } = body

    // Validate name
    if (name !== undefined && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name must be a string' },
        { status: 400 }
      )
    }

    if (name && name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be less than 100 characters' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        name: name || null,
      },
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
        emailVerified: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export const PUT = withAuth(handler)
