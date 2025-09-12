'use client'

import { AnimatedCard, AnimatedCardContent } from '@/components/ui/animated-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { PageTransition } from '@/components/ui/page-transition'
import { sampleClaims, adjusters } from '@/lib/data/claims'
import { formatDate, getTimeStatus } from '@/lib/utils'
import { 
  User, 
  MapPin, 
  Phone, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Camera,
  MessageSquare,
  Navigation,
  Star
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

export function AdjusterInterface() {
  const [selectedAdjusterId, setSelectedAdjusterId] = useState<string>('adj1')
  const [viewMode, setViewMode] = useState<'tasks' | 'claims' | 'performance'>('tasks')

  const selectedAdjuster = adjusters.find(a => a.id === selectedAdjusterId)
  const adjusterClaims = sampleClaims.filter(c => c.assignedAdjusterId === selectedAdjusterId)

  // Create tasks from claims
  const tasks = useMemo(() => {
    const taskList: Array<{
      id: string
      claimId: string
      claimNumber: string
      type: 'contact' | 'inspect' | 'estimate' | 'followup'
      priority: 'high' | 'medium' | 'low'
      dueDate: Date
      status: 'pending' | 'in_progress' | 'completed' | 'overdue'
      description: string
      location?: string
      customer: string
    }> = []

    adjusterClaims.forEach(claim => {
      // First contact task
      if (!claim.customerContactedAt) {
        const isOverdue = new Date() > claim.firstContactDeadline
        taskList.push({
          id: `contact_${claim.id}`,
          claimId: claim.id,
          claimNumber: claim.claimNumber,
          type: 'contact',
          priority: claim.priority,
          dueDate: claim.firstContactDeadline,
          status: isOverdue ? 'overdue' : 'pending',
          description: 'Make initial customer contact within 24 hours',
          customer: claim.policyholderName,
          location: `${claim.city}, ${claim.state}`
        })
      }

      // Inspection task
      if (claim.customerContactedAt && !claim.siteInspectedAt) {
        const inspectionDue = new Date(claim.customerContactedAt)
        inspectionDue.setDate(inspectionDue.getDate() + 2) // 2 days after contact
        
        taskList.push({
          id: `inspect_${claim.id}`,
          claimId: claim.id,
          claimNumber: claim.claimNumber,
          type: 'inspect',
          priority: claim.priority,
          dueDate: inspectionDue,
          status: new Date() > inspectionDue ? 'overdue' : 'pending',
          description: 'Conduct property inspection',
          customer: claim.policyholderName,
          location: claim.propertyAddress
        })
      }

      // Estimate task
      if (claim.siteInspectedAt && !claim.estimateReturnedAt) {
        const estimateDue = new Date(claim.siteInspectedAt)
        estimateDue.setDate(estimateDue.getDate() + 3) // 3 days after inspection
        
        taskList.push({
          id: `estimate_${claim.id}`,
          claimId: claim.id,
          claimNumber: claim.claimNumber,
          type: 'estimate',
          priority: claim.priority,
          dueDate: estimateDue,
          status: new Date() > estimateDue ? 'overdue' : 'pending',
          description: 'Complete damage estimate and submit',
          customer: claim.policyholderName
        })
      }
    })

    return taskList.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const statusOrder = { overdue: 0, pending: 1, in_progress: 2, completed: 3 }
      
      if (a.status !== b.status) {
        return statusOrder[a.status] - statusOrder[b.status]
      }
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return a.dueDate.getTime() - b.dueDate.getTime()
    })
  }, [adjusterClaims])

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'contact': return Phone
      case 'inspect': return Camera
      case 'estimate': return FileText
      case 'followup': return MessageSquare
      default: return Clock
    }
  }

  const getTaskStatus = (task: typeof tasks[0]) => {
    if (task.status === 'overdue') return 'red'
    if (task.status === 'completed') return 'green'
    if (task.priority === 'high') return 'yellow'
    return 'green'
  }

  return (
    <PageTransition>
      <div className="p-4 max-w-[98%] mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Adjuster Interface
          </h1>
          <p className="text-gray-600 mt-2">Task management and claim tracking for adjusters</p>
        </motion.div>

        {/* Adjuster Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedCard className="mb-6" delay={0.1}>
            <AnimatedCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <User className="h-8 w-8 text-blue-600" />
                  </motion.div>
                  <div>
                <select
                  value={selectedAdjusterId}
                  onChange={(e) => setSelectedAdjusterId(e.target.value)}
                  className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none"
                >
                  {adjusters.map(adjuster => (
                    <option key={adjuster.id} value={adjuster.id}>
                      {adjuster.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-600">
                  {selectedAdjuster?.currentWorkload}/{selectedAdjuster?.maxWorkload} claims assigned
                </p>
              </div>
            </div>
            
                <div className="flex space-x-2">
                  {['tasks', 'claims', 'performance'].map((mode, index) => (
                    <motion.button
                      key={mode}
                      onClick={() => setViewMode(mode as typeof viewMode)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                        viewMode === mode 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      {viewMode === mode && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </AnimatedCardContent>
          </AnimatedCard>
        </motion.div>

      {/* Task View */}
      {viewMode === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Priority Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                {tasks.filter(t => t.status === 'overdue' || t.priority === 'high').map(task => {
                  const TaskIcon = getTaskIcon(task.type)
                  const status = getTaskStatus(task)
                  
                  return (
                    <div key={task.id} className="p-4 border-b hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <TaskIcon className="h-5 w-5 mt-1 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">
                              {task.claimNumber}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {task.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 space-x-3">
                              <span>{task.customer}</span>
                              {task.location && (
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {task.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <StatusBadge status={status}>
                            {task.status.toUpperCase()}
                          </StatusBadge>
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {formatDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Today&apos;s Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                {tasks.filter(t => {
                  const today = new Date()
                  const taskDate = new Date(t.dueDate)
                  return taskDate.toDateString() === today.toDateString()
                }).map(task => {
                  const TaskIcon = getTaskIcon(task.type)
                  const status = getTaskStatus(task)
                  
                  return (
                    <div key={task.id} className="p-4 border-b hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <TaskIcon className="h-5 w-5 mt-1 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">
                              {task.claimNumber}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {task.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>{task.customer}</span>
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={status}>
                          {task.priority.toUpperCase()}
                        </StatusBadge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Phone className="h-5 w-5 mr-2" />
                  Start Next Call
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <Navigation className="h-5 w-5 mr-2" />
                  Navigate to Inspection
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <Camera className="h-5 w-5 mr-2" />
                  Upload Photos
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <FileText className="h-5 w-5 mr-2" />
                  Generate Report
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send Update
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Claims View */}
      {viewMode === 'claims' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Claims ({adjusterClaims.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {adjusterClaims.map(claim => {
                  const timeStatus = getTimeStatus(claim.firstContactDeadline, claim.customerContactedAt)
                  
                  return (
                    <div key={claim.id} className="p-4 border-b hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <h3 className="text-sm font-semibold text-gray-900 mr-3">
                              {claim.claimNumber}
                            </h3>
                            <StatusBadge status={timeStatus}>
                              {claim.status.replace('_', ' ').toUpperCase()}
                            </StatusBadge>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              <span>{claim.policyholderName}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{claim.city}, {claim.state}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>DOL: {formatDate(claim.dateOfLoss)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            ${claim.claimAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {claim.priority.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Claim Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress indicators */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Claims Contacted</span>
                    <span className="text-sm text-gray-600">
                      {adjusterClaims.filter(c => c.customerContactedAt).length}/{adjusterClaims.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ 
                        width: `${(adjusterClaims.filter(c => c.customerContactedAt).length / adjusterClaims.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Inspections Complete</span>
                    <span className="text-sm text-gray-600">
                      {adjusterClaims.filter(c => c.siteInspectedAt).length}/{adjusterClaims.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${(adjusterClaims.filter(c => c.siteInspectedAt).length / adjusterClaims.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estimates Submitted</span>
                    <span className="text-sm text-gray-600">
                      {adjusterClaims.filter(c => c.estimateReturnedAt).length}/{adjusterClaims.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ 
                        width: `${(adjusterClaims.filter(c => c.estimateReturnedAt).length / adjusterClaims.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance View */}
      {viewMode === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">98.5%</div>
                  <div className="text-sm text-gray-600">First Contact Compliance</div>
                  <div className="text-xs text-green-600 mt-1">Above target (95%)</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-semibold text-gray-900">2.1</div>
                    <div className="text-xs text-gray-600">Avg Days to Inspection</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-gray-900">4.8</div>
                    <div className="text-xs text-gray-600">Customer Rating</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdjuster?.specialties.map(specialty => (
                      <span key={specialty} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800">
                      Inspection completed for FL-2025-001235
                    </p>
                    <p className="text-xs text-green-600">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-800">
                      Customer contacted for FL-2025-001234
                    </p>
                    <p className="text-xs text-blue-600">Yesterday at 2:30 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-purple-800">
                      Estimate submitted for FL-2025-001238
                    </p>
                    <p className="text-xs text-purple-600">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </PageTransition>
  )
}