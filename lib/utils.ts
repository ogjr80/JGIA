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

// Calculate how long a claim has been in the system since dateEnteredQueue
export function calculateClaimAge(dateEnteredQueue: Date): string {
  const now = new Date()
  const diffInMilliseconds = now.getTime() - dateEnteredQueue.getTime()
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)
  const remainingHours = diffInHours % 24
  
  if (diffInDays > 0) {
    return `${diffInDays}d ${remainingHours}h`
  }
  return `${diffInHours}h`
}

// Get workflow status for different stages
export function getWorkflowStageStatus(
  stageStartTime: Date, 
  stageCompletedTime?: Date, 
  currentTime: Date = new Date()
): 'green' | 'yellow' | 'red' {
  // If stage is completed, determine if it was completed within 24 hours
  if (stageCompletedTime) {
    const hoursToComplete = (stageCompletedTime.getTime() - stageStartTime.getTime()) / (1000 * 60 * 60)
    return hoursToComplete <= 24 ? 'green' : 'red'
  }
  
  // If stage is not completed, check current progress
  const hoursElapsed = (currentTime.getTime() - stageStartTime.getTime()) / (1000 * 60 * 60)
  
  if (hoursElapsed > 24) return 'red'    // Past 24 hours
  if (hoursElapsed > 18) return 'yellow' // Past 18 hours
  return 'green'                         // Within 18 hours
}

// Format time duration for display
export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.floor(hours * 60)
    return `${minutes}m`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = Math.floor(hours % 24)
  
  if (days > 0) {
    return `${days}d ${remainingHours}h`
  }
  return `${Math.floor(hours)}h`
}