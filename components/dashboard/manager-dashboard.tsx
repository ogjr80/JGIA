'use client'

import { AnimatedCard, AnimatedCardContent, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card'
import { AnimatedStatusBadge, AnimatedPriorityIndicator } from '@/components/ui/animated-status-badge'
import { AnimatedCounter, AnimatedProgressBar } from '@/components/ui/animated-counter'
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition'
import { sampleClaims, sampleKPIEvents, adjusters } from '@/lib/data/claims'
import { getTimeStatus, formatDate } from '@/lib/utils'
import { 
  Clock, 
  FileText, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  MapPin,
  Phone
} from 'lucide-react'
import { useMemo } from 'react'
import { motion } from 'framer-motion'

export function ManagerDashboard() {
  const dashboardStats = useMemo(() => {
    const totalClaims = sampleClaims.length
    const claimsInQueue = sampleClaims.filter(c => c.status === 'queue').length
    const claimsAssigned = sampleClaims.filter(c => c.status !== 'queue' && c.status !== 'completed').length
    const claimsCompleted = sampleClaims.filter(c => c.status === 'completed').length
    
    // First Contact Compliance
    const firstContactEvents = sampleKPIEvents.filter(e => e.eventType === 'first_contact')
    const compliantContacts = firstContactEvents.filter(e => e.isCompliant).length
    const complianceRate = firstContactEvents.length > 0 ? (compliantContacts / firstContactEvents.length) * 100 : 0
    
    // Overdue claims (past 24 hours without contact)
    const now = new Date()
    const overdueClaims = sampleClaims.filter(claim => {
      if (claim.customerContactedAt) return false
      const hoursInQueue = (now.getTime() - claim.dateEnteredQueue.getTime()) / (1000 * 60 * 60)
      return hoursInQueue > 24
    }).length
    
    // Approaching deadline claims (within 4 hours)
    const approachingDeadline = sampleClaims.filter(claim => {
      if (claim.customerContactedAt) return false
      const hoursUntilDeadline = (claim.firstContactDeadline.getTime() - now.getTime()) / (1000 * 60 * 60)
      return hoursUntilDeadline <= 4 && hoursUntilDeadline > 0
    }).length

    return {
      totalClaims,
      claimsInQueue,
      claimsAssigned,
      claimsCompleted,
      complianceRate,
      overdueClaims,
      approachingDeadline
    }
  }, [])

  const recentClaims = sampleClaims
    .sort((a, b) => b.dateEnteredQueue.getTime() - a.dateEnteredQueue.getTime())
    .slice(0, 5)

  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Real-time overview of claims management and KPI tracking</p>
        </motion.div>

        {/* KPI Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StaggerItem>
            <AnimatedCard delay={0} className="overflow-hidden">
              <AnimatedCardContent className="p-6">
                <div className="flex items-center">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <FileText className="h-8 w-8 text-blue-600" />
                  </motion.div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Claims</p>
                    <AnimatedCounter 
                      value={dashboardStats.totalClaims}
                      className="text-2xl font-semibold text-gray-900"
                      duration={1.5}
                    />
                  </div>
                </div>
              </AnimatedCardContent>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard delay={0.1} className="overflow-hidden">
              <AnimatedCardContent className="p-6">
                <div className="flex items-center">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </motion.div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">In Queue</p>
                    <AnimatedCounter 
                      value={dashboardStats.claimsInQueue}
                      className="text-2xl font-semibold text-gray-900"
                      duration={1.5}
                    />
                  </div>
                </div>
              </AnimatedCardContent>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard delay={0.2} className="overflow-hidden">
              <AnimatedCardContent className="p-6">
                <div className="flex items-center">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Users className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Assigned</p>
                    <AnimatedCounter 
                      value={dashboardStats.claimsAssigned}
                      className="text-2xl font-semibold text-gray-900"
                      duration={1.5}
                    />
                  </div>
                </div>
              </AnimatedCardContent>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard delay={0.3} className="overflow-hidden">
              <AnimatedCardContent className="p-6">
                <div className="flex items-center">
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </motion.div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <AnimatedCounter 
                      value={dashboardStats.claimsCompleted}
                      className="text-2xl font-semibold text-gray-900"
                      duration={1.5}
                    />
                  </div>
                </div>
              </AnimatedCardContent>
            </AnimatedCard>
          </StaggerItem>
        </StaggerContainer>

        {/* First Contact Compliance & Alerts */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AnimatedCard delay={0.5}>
            <AnimatedCardHeader>
              <AnimatedCardTitle className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                </motion.div>
                First Contact Compliance
              </AnimatedCardTitle>
            </AnimatedCardHeader>
            <AnimatedCardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance Rate</span>
                  <AnimatedStatusBadge 
                    status={dashboardStats.complianceRate >= 95 ? 'green' : dashboardStats.complianceRate >= 80 ? 'yellow' : 'red'}
                    pulse={dashboardStats.complianceRate < 95}
                  >
                    <AnimatedCounter 
                      value={dashboardStats.complianceRate}
                      suffix="%"
                      duration={2}
                    />
                  </AnimatedStatusBadge>
                </div>
                <div className="space-y-2">
                  <AnimatedProgressBar
                    percentage={dashboardStats.complianceRate}
                    color={dashboardStats.complianceRate >= 95 ? 'green' : dashboardStats.complianceRate >= 80 ? 'yellow' : 'red'}
                    duration={2}
                  />
                  <motion.div 
                    className="text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Target: 100% within 24 hours
                  </motion.div>
                </div>
              </div>
            </AnimatedCardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.6}>
            <AnimatedCardHeader>
              <AnimatedCardTitle className="flex items-center">
                <motion.div
                  animate={{ 
                    rotate: dashboardStats.overdueClaims > 0 ? [0, -5, 5, 0] : 0,
                    scale: dashboardStats.overdueClaims > 0 ? [1, 1.05, 1] : 1
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: dashboardStats.overdueClaims > 0 ? Infinity : 0,
                    repeatDelay: 1
                  }}
                >
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                </motion.div>
                Priority Alerts
              </AnimatedCardTitle>
            </AnimatedCardHeader>
            <AnimatedCardContent>
              <div className="space-y-3">
                {dashboardStats.overdueClaims > 0 && (
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)" }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className="w-2 h-2 bg-red-600 rounded-full mr-3"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm font-medium text-red-800">Overdue Claims</span>
                    </div>
                    <AnimatedStatusBadge status="red" pulse>
                      {dashboardStats.overdueClaims}
                    </AnimatedStatusBadge>
                  </motion.div>
                )}
                
                {dashboardStats.approachingDeadline > 0 && (
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)" }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className="w-2 h-2 bg-yellow-600 rounded-full mr-3"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-sm font-medium text-yellow-800">Approaching Deadline</span>
                    </div>
                    <AnimatedStatusBadge status="yellow">
                      {dashboardStats.approachingDeadline}
                    </AnimatedStatusBadge>
                  </motion.div>
                )}
                
                {dashboardStats.overdueClaims === 0 && dashboardStats.approachingDeadline === 0 && (
                  <motion.div 
                    className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    </motion.div>
                    <span className="text-sm font-medium text-green-800">All claims on track</span>
                  </motion.div>
                )}
              </div>
            </AnimatedCardContent>
          </AnimatedCard>
        </motion.div>

        {/* Recent Claims & Adjuster Workload */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <AnimatedCard delay={0.7}>
            <AnimatedCardHeader>
              <AnimatedCardTitle>Recent Claims</AnimatedCardTitle>
            </AnimatedCardHeader>
            <AnimatedCardContent>
              <div className="space-y-4">
                {recentClaims.map((claim, index) => {
                  const timeStatus = getTimeStatus(claim.firstContactDeadline, claim.customerContactedAt)
                  return (
                    <motion.div 
                      key={claim.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {claim.claimNumber}
                          </p>
                          <AnimatedStatusBadge status={timeStatus} className="ml-2">
                            {claim.status.replace('_', ' ').toUpperCase()}
                          </AnimatedStatusBadge>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="mr-3">{claim.city}, {claim.state}</span>
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{claim.policyholderName}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Entered: {formatDate(claim.dateEnteredQueue)}
                        </p>
                      </div>
                      <div className="text-right">
                        <motion.p 
                          className="text-sm font-medium text-gray-900"
                          whileHover={{ scale: 1.05 }}
                        >
                          ${claim.claimAmount.toLocaleString()}
                        </motion.p>
                        {claim.assignedAdjusterName && (
                          <p className="text-xs text-gray-500">{claim.assignedAdjusterName}</p>
                        )}
                        <AnimatedPriorityIndicator priority={claim.priority} className="mt-1" />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatedCardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.8}>
            <AnimatedCardHeader>
              <AnimatedCardTitle>Adjuster Workload</AnimatedCardTitle>
            </AnimatedCardHeader>
            <AnimatedCardContent>
              <div className="space-y-4">
                {adjusters.map((adjuster, index) => {
                  const workloadPercentage = (adjuster.currentWorkload / adjuster.maxWorkload) * 100
                  const status = workloadPercentage >= 90 ? 'red' : workloadPercentage >= 70 ? 'yellow' : 'green'
                  
                  return (
                    <motion.div 
                      key={adjuster.id} 
                      className="space-y-3 p-3 rounded-lg border hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{adjuster.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            <AnimatedCounter value={adjuster.currentWorkload} duration={1} />
                            /<AnimatedCounter value={adjuster.maxWorkload} duration={1} />
                          </span>
                          <AnimatedStatusBadge status={status}>
                            <AnimatedCounter value={workloadPercentage} suffix="%" duration={1.5} />
                          </AnimatedStatusBadge>
                        </div>
                      </div>
                      <AnimatedProgressBar
                        percentage={workloadPercentage}
                        color={status}
                        duration={1.5}
                      />
                      <motion.div 
                        className="flex flex-wrap gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                      >
                        {adjuster.specialties.map((specialty, specialtyIndex) => (
                          <motion.span 
                            key={specialty} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.3 + index * 0.1 + specialtyIndex * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {specialty}
                          </motion.span>
                        ))}
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatedCardContent>
          </AnimatedCard>
        </motion.div>
      </div>
    </PageTransition>
  )
}