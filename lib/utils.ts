import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function getTimeStatus(targetTime: Date, actualTime?: Date): 'green' | 'yellow' | 'red' {
  const now = actualTime || new Date()
  const hoursRemaining = (targetTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (actualTime && actualTime <= targetTime) return 'green' // Completed on time
  if (hoursRemaining > 4) return 'green' // More than 4 hours remaining
  if (hoursRemaining > 0) return 'yellow' // Less than 4 hours but not overdue
  return 'red' // Overdue
}