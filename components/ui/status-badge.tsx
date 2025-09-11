import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'green' | 'yellow' | 'red'
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-green-100 text-green-800': status === 'green',
          'bg-yellow-100 text-yellow-800': status === 'yellow',
          'bg-red-100 text-red-800': status === 'red',
        },
        className
      )}
    >
      {children}
    </span>
  )
}