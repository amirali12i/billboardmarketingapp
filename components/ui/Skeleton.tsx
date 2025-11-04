'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, animation = 'pulse', style, ...props }, ref) => {
    const baseStyles = 'bg-gray-200 dark:bg-gray-700'

    const variants = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-lg'
    }

    const animations = {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer',
      none: ''
    }

    const defaultDimensions = {
      text: { width: '100%', height: '1rem' },
      circular: { width: '2.5rem', height: '2.5rem' },
      rectangular: { width: '100%', height: '10rem' }
    }

    return (
      <div
        ref={ref}
        className={clsx(baseStyles, variants[variant], animations[animation], className)}
        style={{
          width: width || defaultDimensions[variant].width,
          height: height || defaultDimensions[variant].height,
          ...style
        }}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
