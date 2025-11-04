'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  gradient?: boolean
  glass?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, gradient = false, glass = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl border transition-all'

    const variantStyles = clsx({
      'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700': !glass && !gradient,
      'glass-dark border-white/10': glass,
      'bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/20': gradient,
      'hover:shadow-2xl hover:-translate-y-1 cursor-pointer': hover
    })

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4 } : {}}
        className={clsx(baseStyles, variantStyles, className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export default Card
