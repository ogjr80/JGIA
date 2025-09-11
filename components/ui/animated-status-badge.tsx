'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedStatusBadgeProps {
  status: 'green' | 'yellow' | 'red'
  children: React.ReactNode
  className?: string
  pulse?: boolean
}

export function AnimatedStatusBadge({ status, children, className, pulse = false }: AnimatedStatusBadgeProps) {
  const statusConfig = {
    green: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      shadow: 'shadow-green-100'
    },
    yellow: {
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      shadow: 'shadow-yellow-100'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-800', 
      border: 'border-red-200',
      shadow: 'shadow-red-100'
    }
  }

  const config = statusConfig[status]

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.bg,
        config.text,
        config.border,
        pulse && 'animate-pulse',
        className
      )}
      style={{
        boxShadow: pulse ? `0 0 0 4px ${config.shadow}` : undefined
      }}
    >
      {pulse && (
        <motion.span
          className="w-2 h-2 rounded-full bg-current mr-1.5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {children}
    </motion.span>
  )
}

interface AnimatedPriorityIndicatorProps {
  priority: 'high' | 'medium' | 'low'
  className?: string
}

export function AnimatedPriorityIndicator({ priority, className }: AnimatedPriorityIndicatorProps) {
  const priorityConfig = {
    high: { color: '#ef4444', label: 'HIGH', intensity: 1 },
    medium: { color: '#f59e0b', label: 'MED', intensity: 0.7 },
    low: { color: '#10b981', label: 'LOW', intensity: 0.4 }
  }

  const config = priorityConfig[priority]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn('flex items-center', className)}
    >
      <motion.div
        className="w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: config.color }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [config.intensity, 1, config.intensity]
        }}
        transition={{ 
          duration: 2,
          repeat: priority === 'high' ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      <span className="text-xs font-medium text-gray-600">
        {config.label}
      </span>
    </motion.div>
  )
}