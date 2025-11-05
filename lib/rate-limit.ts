import { NextRequest } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  interval: number // in milliseconds
  maxRequests: number
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  }
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const key = `${ip}`

  const now = Date.now()
  const resetTime = now + config.interval

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime,
    }

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: resetTime,
    }
  }

  store[key].count++

  if (store[key].count > config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: store[key].resetTime,
    }
  }

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - store[key].count,
    reset: store[key].resetTime,
  }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 60 * 1000) // Run every minute
