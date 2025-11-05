import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/middleware'
import prisma from '@/lib/db'

/**
 * PUT /api/admin/users/[id]
 * Update user details (role, plan, etc.)
 * Requires ADMIN role
 */
async function putHandler(
  req: NextRequest,
  context: { params: { id: string } },
  auth: { userId: string; userEmail: string; userRole: string; userPlan: string }
) {
  try {
    const { id } = context.params
    const body = await req.json()
    const { role, plan, planExpiry, emailVerified } = body

    // Validate inputs
    const validRoles = ['USER', 'ADMIN']
    const validPlans = ['FREE', 'PRO', 'ENTERPRISE']

    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be USER or ADMIN' },
        { status: 400 }
      )
    }

    if (plan && !validPlans.includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be FREE, PRO, or ENTERPRISE' },
        { status: 400 }
      )
    }

    // Don't allow admin to demote themselves
    if (id === auth.userId && role === 'USER') {
      return NextResponse.json(
        { error: 'You cannot demote yourself from admin' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: any = {}

    if (role !== undefined) updateData.role = role
    if (plan !== undefined) updateData.plan = plan
    if (planExpiry !== undefined) {
      updateData.planExpiry = planExpiry ? new Date(planExpiry) : null
    }
    if (emailVerified !== undefined) {
      updateData.emailVerified = emailVerified ? new Date() : null
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
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
      },
    })

    // Log the action
    await prisma.usageLog.create({
      data: {
        userId: auth.userId,
        action: 'ADMIN_UPDATE_USER',
        metadata: JSON.stringify({
          targetUserId: id,
          changes: updateData,
        }),
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete user account
 * Requires ADMIN role
 */
async function deleteHandler(
  req: NextRequest,
  context: { params: { id: string } },
  auth: { userId: string; userEmail: string; userRole: string; userPlan: string }
) {
  try {
    const { id } = context.params

    // Don't allow admin to delete themselves
    if (id === auth.userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (cascade will delete related records)
    await prisma.user.delete({
      where: { id },
    })

    // Log the action
    await prisma.usageLog.create({
      data: {
        userId: auth.userId,
        action: 'ADMIN_DELETE_USER',
        metadata: JSON.stringify({
          deletedUserId: id,
          deletedUserEmail: existingUser.email,
          deletedUserRole: existingUser.role,
        }),
      },
    })

    return NextResponse.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: existingUser.id,
        email: existingUser.email,
      },
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

export const PUT = withAdmin(putHandler)
export const DELETE = withAdmin(deleteHandler)
