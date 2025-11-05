import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { db } from './db'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days

export interface SessionPayload {
  userId: string
  email: string
  plan: string
  expiresAt: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(userId: string, email: string, plan: string): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  const token = await new SignJWT({ userId, email, plan, expiresAt: expiresAt.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET)

  // Store session in database
  await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return token
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Check if session exists in database
    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      plan: payload.plan as string,
      expiresAt: new Date(payload.expiresAt as string),
    }
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) {
    return null
  }

  return verifySession(token)
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (token) {
    await db.session.delete({ where: { token } }).catch(() => {})
  }

  cookieStore.delete('session')
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get('session')?.value

  if (!token) {
    return NextResponse.next()
  }

  const session = await verifySession(token)

  if (!session) {
    const response = NextResponse.next()
    response.cookies.delete('session')
    return response
  }

  // Extend session if it's going to expire soon
  const expiresAt = new Date(session.expiresAt)
  const now = new Date()
  const timeUntilExpiry = expiresAt.getTime() - now.getTime()
  const sevenDays = 7 * 24 * 60 * 60 * 1000

  if (timeUntilExpiry < sevenDays) {
    const newToken = await createSession(session.userId, session.email, session.plan)
    const response = NextResponse.next()
    response.cookies.set('session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + SESSION_DURATION),
      path: '/',
    })
    return response
  }

  return NextResponse.next()
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      plan: true,
      planExpiry: true,
      projectsCount: true,
      aiUsageCount: true,
      storageUsed: true,
      createdAt: true,
    },
  })

  return user
}
