'use client'

import { AnimatedCard, AnimatedCardContent, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card'
import { AnimatedStatusBadge, AnimatedPriorityIndicator } from '@/components/ui/animated-status-badge'
import { AnimatedCounter, AnimatedProgressBar } from '@/components/ui/animated-counter'
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition'
import { sampleClaims, sampleKPIEvents, adjusters } from '@/lib/data/claims'
import { getTimeStatus, formatDate, calculateClaimAge, getWorkflowStageStatus } from '@/lib/utils'
import { 
  Clock, 
  FileText, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  MapPin,
  Phone,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  MessageSquare
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

export function ManagerDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortField, setSortField] = useState<string>('dateEnteredQueue')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedClaims, setSelectedClaims] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

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

  // Filtered and sorted claims
  const filteredAndSortedClaims = useMemo(() => {
    let filtered = sampleClaims.filter(claim => {
      const matchesSearch = searchTerm === '' || 
        claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.policyholderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.state.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || claim.status === filterStatus
      const matchesPriority = filterPriority === 'all' || claim.priority === filterPriority
      
      return matchesSearch && matchesStatus && matchesPriority
    })

    // Sort claims
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof typeof a]
      let bValue: any = b[sortField as keyof typeof b]
      
      if (aValue instanceof Date && bValue instanceof Date) {
        aValue = aValue.getTime()
        bValue = bValue.getTime()
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchTerm, filterStatus, filterPriority, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectClaim = (claimId: string) => {
    setSelectedClaims(prev => 
      prev.includes(claimId) 
        ? prev.filter(id => id !== claimId)
        : [...prev, claimId]
    )
  }

  const handleSelectAll = () => {
    if (selectedClaims.length === filteredAndSortedClaims.length) {
      setSelectedClaims([])
    } else {
      setSelectedClaims(filteredAndSortedClaims.map(claim => claim.id))
    }
  }

  const recentClaims = sampleClaims
    .sort((a, b) => b.dateEnteredQueue.getTime() - a.dateEnteredQueue.getTime())
    .slice(0, 5)

  return (
    <PageTransition>
      <div className="p-4 max-w-[98%] mx-auto">
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

        {/* Claims Management Table */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <AnimatedCard delay={0.7}>
            <AnimatedCardHeader>
              <AnimatedCardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span>All Claims ({filteredAndSortedClaims.length})</span>
                  {selectedClaims.length > 0 && (
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {selectedClaims.length} selected
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-6 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Status Legend:</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span className="text-gray-600">On Track (≤18h)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span className="text-gray-600">Warning (18-24h)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span className="text-gray-600">Overdue (&gt;24h)</span>
                  </div>
                </div>
              </AnimatedCardTitle>
              
              {/* Enhanced Toolbar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search claims, names, locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                    />
                  </div>
                  
                  {/* Filters */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                      showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                  
                  {/* Quick Filters */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="queue">Queue</option>
                      <option value="assigned">Assigned</option>
                      <option value="contacted">Contacted</option>
                      <option value="inspected">Inspected</option>
                      <option value="qa_approved">QA Approved</option>
                      <option value="completed">Completed</option>
                    </select>
                    
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Bulk Actions */}
                  {selectedClaims.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        <MessageSquare className="h-4 w-4" />
                        <span>Send Reminder</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                        <Edit className="h-4 w-4" />
                        <span>Bulk Update</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <button className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                    <Bell className="h-4 w-4" />
                    <span>Alerts ({dashboardStats.overdueClaims})</span>
                  </button>
                </div>
              </div>
              
              {/* Advanced Filters Panel */}
              {showFilters && (
                <motion.div 
                  className="mt-4 p-4 bg-white border border-gray-200 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <div className="flex space-x-2">
                        <input type="date" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        <input type="date" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adjuster</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">All Adjusters</option>
                        {adjusters.map(adj => (
                          <option key={adj.id} value={adj.id}>{adj.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                      <div className="flex space-x-2">
                        <input type="number" placeholder="Min" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        <input type="number" placeholder="Max" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatedCardHeader>
            <AnimatedCardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse min-w-[1800px]">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="text-center py-2 px-2 font-medium border border-gray-600 w-8">
                        <input
                          type="checkbox"
                          checked={selectedClaims.length === filteredAndSortedClaims.length && filteredAndSortedClaims.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th 
                        className="text-left py-2 px-2 font-medium border border-gray-600 cursor-pointer hover:bg-gray-700"
                        onClick={() => handleSort('claimNumber')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Claim #</span>
                          {sortField === 'claimNumber' && (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left py-2 px-2 font-medium border border-gray-600 cursor-pointer hover:bg-gray-700"
                        onClick={() => handleSort('dateEnteredQueue')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Entered Assignment Queue</span>
                          {sortField === 'dateEnteredQueue' && (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">First Contact Status</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Inspection Status</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">QA First File Review</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Manager File Review</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">QA Approved Date</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Claim Revisions</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Supplement</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Aged</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Clear Alarm</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">XactAnalysis Status</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Customer Contacted</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Planned Inspection</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Site Inspected</th>
                      <th className="text-center py-2 px-2 font-medium border border-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedClaims.map((claim, index) => {
                      const claimAge = calculateClaimAge(claim.dateEnteredQueue)
                      
                      // Calculate status for each workflow stage
                      const firstContactStatus = claim.firstContactStartedAt 
                        ? getWorkflowStageStatus(claim.firstContactStartedAt, claim.customerContactedAt)
                        : 'red'
                      
                      const inspectionStatus = claim.inspectionStartedAt && claim.customerContactedAt
                        ? getWorkflowStageStatus(claim.inspectionStartedAt, claim.siteInspectedAt)
                        : undefined
                      
                      const qaReviewStatus = claim.qaReviewStartedAt && claim.siteInspectedAt
                        ? getWorkflowStageStatus(claim.qaReviewStartedAt, claim.qaApprovedAt)
                        : undefined
                      
                      const managerReviewStatus = claim.managerReviewStartedAt && claim.qaApprovedAt
                        ? getWorkflowStageStatus(claim.managerReviewStartedAt, claim.reviewedAt)
                        : undefined
                      
                      const claimRevisionStatus = claim.claimRevisionStartedAt && claim.reviewedAt
                        ? getWorkflowStageStatus(claim.claimRevisionStartedAt)
                        : undefined

                      // Determine XactAnalysis status based on claim status
                      const xactStatus = claim.status === 'completed' ? 'Delivered' : 
                                       claim.status === 'qa_approved' ? 'Returned' :
                                       claim.status === 'reviewed' ? 'Returned' : 'Delivered'

                  return (
                        <motion.tr 
                      key={claim.id} 
                          className="hover:bg-gray-50 transition-colors even:bg-gray-25"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                        >
                          {/* Checkbox */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            <input
                              type="checkbox"
                              checked={selectedClaims.includes(claim.id)}
                              onChange={() => handleSelectClaim(claim.id)}
                              className="rounded"
                            />
                          </td>
                          
                          {/* Claim Number */}
                          <td className="py-1 px-2 border border-gray-200 font-medium text-blue-600">
                            {claim.claimNumber}
                          </td>
                          
                          {/* Entered Assignment Queue */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            {formatDate(claim.dateEnteredQueue).replace(/,/g, '').replace(/\s+/g, ' ')}
                          </td>
                          
                          {/* First Contact Status */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              firstContactStatus === 'green' ? 'bg-green-500 text-white' :
                              firstContactStatus === 'yellow' ? 'bg-yellow-500 text-white' :
                              'bg-red-500 text-white'
                            }`}>
                              {claim.customerContactedAt ? '24 Hour Contact' : 
                               firstContactStatus === 'yellow' ? 'Planned Contact' : '24 Hour Contact'}
                            </div>
                          </td>
                          
                          {/* Inspection Status */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            {inspectionStatus ? (
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                inspectionStatus === 'green' ? 'bg-green-500 text-white' :
                                inspectionStatus === 'yellow' ? 'bg-yellow-500 text-white' :
                                'bg-red-500 text-white'
                              }`}>
                                {claim.siteInspectedAt ? 'Inspection Complete' : 'Planned Inspection'}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          
                          {/* QA First File Review */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            {qaReviewStatus ? (
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                qaReviewStatus === 'green' ? 'bg-green-500 text-white' :
                                qaReviewStatus === 'yellow' ? 'bg-yellow-500 text-white' :
                                'bg-red-500 text-white'
                              }`}>
                                {claim.qaApprovedAt ? 'QA Review Complete' : 'QA Manager Review'}
                        </div>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          
                          {/* Manager File Review */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            {managerReviewStatus ? (
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                managerReviewStatus === 'green' ? 'bg-green-500 text-white' :
                                managerReviewStatus === 'yellow' ? 'bg-yellow-500 text-white' :
                                'bg-red-500 text-white'
                              }`}>
                                {claim.reviewedAt ? 'Manager Review' : 'QA Manager Review'}
                        </div>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          
                          {/* QA Approved Date */}
                          <td className="py-1 px-2 border border-gray-200 text-center text-xs">
                            {claim.qaApprovedAt ? formatDate(claim.qaApprovedAt).replace(/,/g, '').replace(/\s+/g, ' ') : '—'}
                          </td>
                          
                          {/* Claim Revisions */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            {claimRevisionStatus ? (
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                claimRevisionStatus === 'green' ? 'bg-green-500 text-white' :
                                claimRevisionStatus === 'yellow' ? 'bg-yellow-500 text-white' :
                                'bg-red-500 text-white'
                              }`}>
                                Estimate Return
                        </div>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          
                          {/* Supplement */}
                          <td className="py-1 px-2 border border-gray-200 text-center text-xs">
                            EST
                          </td>
                          
                          {/* Aged */}
                          <td className="py-1 px-2 border border-gray-200 text-center font-medium">
                            {claimAge}
                          </td>
                          
                          {/* Clear Alarm */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            <div className="px-2 py-1 rounded text-xs font-medium bg-green-500 text-white">
                              {claim.customerContactedAt ? '24 Hour Contact' : 'Planned Inspection'}
                      </div>
                          </td>
                          
                          {/* XactAnalysis Status */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              xactStatus === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                              xactStatus === 'Returned' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {xactStatus}
                            </span>
                          </td>
                          
                          {/* Customer Contacted */}
                          <td className="py-1 px-2 border border-gray-200 text-center text-xs">
                            {claim.customerContactedAt ? `CC: ${calculateClaimAge(claim.customerContactedAt)}` : 'CC: Pending'}
                          </td>
                          
                          {/* Planned Inspection */}
                          <td className="py-1 px-2 border border-gray-200 text-center text-xs">
                            {claim.siteInspectedAt ? `PI: ${calculateClaimAge(claim.siteInspectedAt)}` : 'PI: Pending'}
                          </td>
                          
                          {/* Site Inspected */}
                          <td className="py-1 px-2 border border-gray-200 text-center text-xs">
                            {claim.siteInspectedAt ? `SI: ${calculateClaimAge(claim.siteInspectedAt)}` : 'SI: Pending'}
                          </td>
                          
                          {/* Actions */}
                          <td className="py-1 px-2 border border-gray-200 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <button 
                                className="p-1 hover:bg-blue-100 rounded text-blue-600"
                                title="View Details"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                              <button 
                                className="p-1 hover:bg-green-100 rounded text-green-600"
                                title="Edit Claim"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button 
                                className="p-1 hover:bg-orange-100 rounded text-orange-600"
                                title="Send Message"
                              >
                                <MessageSquare className="h-3 w-3" />
                              </button>
                      </div>
                          </td>
                        </motion.tr>
                  )
                })}
                  </tbody>
                </table>
              </div>
            </AnimatedCardContent>
          </AnimatedCard>
        </motion.div>

        {/* Adjuster Workload */}
        <motion.div 
          className="grid grid-cols-1 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
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