'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  className?: string
  children: React.ReactNode
  delay?: number
  hover?: boolean
  onClick?: () => void
}

export function AnimatedCard({ className, children, delay = 0, hover = true, onClick }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth feel
      }}
      whileHover={hover ? { 
        y: -2, 
        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn('bg-white shadow rounded-lg cursor-pointer transition-shadow', className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedCardContentProps {
  className?: string
  children: React.ReactNode
}

export function AnimatedCardContent({ className, children }: AnimatedCardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

interface AnimatedCardHeaderProps {
  className?: string
  children: React.ReactNode
}

export function AnimatedCardHeader({ className, children }: AnimatedCardHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  )
}

interface AnimatedCardTitleProps {
  className?: string
  children: React.ReactNode
}

export function AnimatedCardTitle({ className, children }: AnimatedCardTitleProps) {
  return (
    <h3 className={cn('text-lg font-medium text-gray-900', className)}>
      {children}
    </h3>
  )
}