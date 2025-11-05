import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  userId?: string
  userEmail?: string
  userPlan?: string
}

/**
 * Middleware to verify user authentication
 * Returns the user session data or throws an error
 */
export async function requireAuth(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    return {
      error: 'Unauthorized',
      status: 401,
      response: NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      ),
    }
  }

  return {
    session,
    userId: session.userId,
    userEmail: session.email,
    userPlan: session.plan,
  }
}

/**
 * Middleware to check if user has a specific plan
 */
export async function requirePlan(req: NextRequest, allowedPlans: string[]) {
  const auth = await requireAuth(req)

  if ('error' in auth) {
    return auth
  }

  if (!allowedPlans.includes(auth.userPlan!)) {
    return {
      error: 'Forbidden',
      status: 403,
      response: NextResponse.json(
        {
          error: 'Forbidden - Upgrade your plan to access this feature',
          requiredPlan: allowedPlans,
          currentPlan: auth.userPlan,
        },
        { status: 403 }
      ),
    }
  }

  return auth
}

/**
 * Wrapper to handle API route authentication
 */
export function withAuth(
  handler: (
    req: NextRequest,
    context: { params?: any },
    auth: { userId: string; userEmail: string; userPlan: string }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params?: any }) => {
    const auth = await requireAuth(req)

    if ('error' in auth) {
      return auth.response
    }

    return handler(req, context, {
      userId: auth.userId!,
      userEmail: auth.userEmail!,
      userPlan: auth.userPlan!,
    })
  }
}

/**
 * Wrapper to handle API routes that require specific plan
 */
export function withPlan(
  allowedPlans: string[],
  handler: (
    req: NextRequest,
    context: { params?: any },
    auth: { userId: string; userEmail: string; userPlan: string }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params?: any }) => {
    const auth = await requirePlan(req, allowedPlans)

    if ('error' in auth) {
      return auth.response
    }

    return handler(req, context, {
      userId: auth.userId!,
      userEmail: auth.userEmail!,
      userPlan: auth.userPlan!,
    })
  }
}
