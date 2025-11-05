import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Rate limiting
    const rateCheck = await rateLimit(req as any, {
      interval: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // Max 5 signup attempts
    })

    if (!rateCheck.success) {
      return res.status(429).json({
        error: 'Too many requests',
        resetTime: rateCheck.reset,
      })
    }

    // Validate input
    const validation = signupSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors,
      })
    }

    const { email, password, name } = validation.data

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
        plan: 'FREE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        createdAt: true,
      },
    })

    // Create session
    await createSession(user.id, user.email, user.role, user.plan)

    // Log usage
    await db.usageLog.create({
      data: {
        userId: user.id,
        action: 'PROJECT_CREATE',
        metadata: {
          email: user.email,
          timestamp: new Date().toISOString(),
        },
      },
    })

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}
