import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifyPassword, createSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
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
      interval: 15 * 60 * 1000,
      maxRequests: 10, // Max 10 login attempts
    })

    if (!rateCheck.success) {
      return res.status(429).json({
        error: 'Too many requests',
        resetTime: rateCheck.reset,
      })
    }

    // Validate input
    const validation = signinSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors,
      })
    }

    const { email, password } = validation.data

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Create session
    await createSession(user.id, user.email, user.role, user.plan)

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        avatar: user.avatar,
      },
    })
  } catch (error: any) {
    console.error('Signin error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}
