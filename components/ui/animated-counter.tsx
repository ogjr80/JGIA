'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({ value, duration = 1, className, prefix = '', suffix = '' }: AnimatedCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, value, { duration })
    return controls.stop
  }, [count, value, duration])

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}

interface AnimatedProgressBarProps {
  percentage: number
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'purple'
  duration?: number
  className?: string
}

export function AnimatedProgressBar({ 
  percentage, 
  color = 'blue', 
  duration = 1.2, 
  className 
}: AnimatedProgressBarProps) {
  const colorClasses = {
    green: 'bg-green-600',
    yellow: 'bg-yellow-600', 
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600'
  }

  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2', className)}>
      <motion.div
        className={`h-2 rounded-full ${colorClasses[color]}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ 
          duration,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.2
        }}
      />
    </div>
  )
}