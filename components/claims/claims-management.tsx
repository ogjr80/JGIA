'use client'

import { AnimatedCard, AnimatedCardContent, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card'
import { AnimatedStatusBadge, AnimatedPriorityIndicator } from '@/components/ui/animated-status-badge'
import { PageTransition } from '@/components/ui/page-transition'
import { sampleClaims, adjusters } from '@/lib/data/claims'
import { formatDate, getTimeStatus } from '@/lib/utils'
import { 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  User,
  Eye,
  Edit,
  FileText
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ClaimsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [adjusterFilter, setAdjusterFilter] = useState<string>('all')
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null)

  const filteredClaims = useMemo(() => {
    return sampleClaims.filter(claim => {
      const matchesSearch = 
        claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.policyholderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.city.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || claim.status === statusFilter
      const matchesAdjuster = adjusterFilter === 'all' || claim.assignedAdjusterId === adjusterFilter
      
      return matchesSearch && matchesStatus && matchesAdjuster
    })
  }, [searchTerm, statusFilter, adjusterFilter])

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'queue', label: 'In Queue' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'inspected', label: 'Inspected' },
    { value: 'estimate_returned', label: 'Estimate Returned' },
    { value: 'qa_approved', label: 'QA Approved' },
    { value: 'completed', label: 'Completed' }
  ]

  const selectedClaimData = selectedClaim ? sampleClaims.find(c => c.id === selectedClaim) : null

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
            Claims Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all insurance claims</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedCard className="mb-6" delay={0.1}>
            <AnimatedCardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </motion.div>
                  <motion.input
                    type="text"
                    placeholder="Search claims, names, cities..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  />
                </div>
                
                <motion.select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </motion.select>
                
                <motion.select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={adjusterFilter}
                  onChange={(e) => setAdjusterFilter(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <option value="all">All Adjusters</option>
                  {adjusters.map(adjuster => (
                    <option key={adjuster.id} value={adjuster.id}>
                      {adjuster.name}
                    </option>
                  ))}
                </motion.select>
                
                <motion.button 
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </motion.button>
              </div>
            </AnimatedCardContent>
          </AnimatedCard>
        </motion.div>

        {/* Claims List */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatedCard delay={0.3}>
            <AnimatedCardHeader>
              <AnimatedCardTitle>
                <motion.span
                  key={filteredClaims.length} // Re-animate when count changes
                  initial={{ scale: 1.2, color: "#3b82f6" }}
                  animate={{ scale: 1, color: "#111827" }}
                  transition={{ duration: 0.3 }}
                >
                  Claims List ({filteredClaims.length})
                </motion.span>
              </AnimatedCardTitle>
            </AnimatedCardHeader>
            <AnimatedCardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {filteredClaims.map((claim, index) => {
                    const timeStatus = getTimeStatus(claim.firstContactDeadline, claim.customerContactedAt)
                    const isSelected = selectedClaim === claim.id
                    
                    return (
                      <motion.div
                        key={claim.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05,
                          layout: { duration: 0.2 }
                        }}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                          isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500 shadow-sm' : ''
                        }`}
                        onClick={() => setSelectedClaim(claim.id)}
                        whileHover={{ 
                          scale: 1.01, 
                          x: isSelected ? 0 : 4,
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-2">
                              <motion.h3 
                                className="text-sm font-semibold text-gray-900 mr-3"
                                whileHover={{ scale: 1.02 }}
                              >
                                {claim.claimNumber}
                              </motion.h3>
                              <AnimatedStatusBadge status={timeStatus}>
                                {claim.status.replace('_', ' ').toUpperCase()}
                              </AnimatedStatusBadge>
                            </div>
                            
                            <div className="space-y-1 text-xs text-gray-600">
                              <motion.div 
                                className="flex items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.1 }}
                              >
                                <User className="h-3 w-3 mr-1" />
                                <span>{claim.policyholderName}</span>
                              </motion.div>
                              <motion.div 
                                className="flex items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.15 }}
                              >
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{claim.propertyAddress}, {claim.city}, {claim.state}</span>
                              </motion.div>
                              <motion.div 
                                className="flex items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>DOL: {formatDate(claim.dateOfLoss)}</span>
                              </motion.div>
                              {claim.assignedAdjusterName && (
                                <motion.div 
                                  className="flex items-center"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 + 0.25 }}
                                >
                                  <User className="h-3 w-3 mr-1" />
                                  <span>Assigned: {claim.assignedAdjusterName}</span>
                                </motion.div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <motion.div 
                              className="flex items-center text-sm font-medium text-gray-900 mb-1"
                              whileHover={{ scale: 1.05 }}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              {claim.claimAmount.toLocaleString()}
                            </motion.div>
                            <AnimatedPriorityIndicator priority={claim.priority} />
                          </div>
                        </div>
                        
                        {/* First Contact Deadline */}
                        <motion.div 
                          className="mt-3 pt-3 border-t border-gray-100"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 + 0.3 }}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">First Contact Deadline:</span>
                            <motion.span 
                              className={`font-medium ${
                                timeStatus === 'red' ? 'text-red-600' : 
                                timeStatus === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                              }`}
                              animate={timeStatus === 'red' ? { scale: [1, 1.05, 1] } : {}}
                              transition={timeStatus === 'red' ? { duration: 2, repeat: Infinity } : {}}
                            >
                              {formatDate(claim.firstContactDeadline)}
                            </motion.span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                
                {filteredClaims.length === 0 && (
                  <motion.div 
                    className="p-8 text-center text-gray-500"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No claims found matching your criteria.</p>
                  </motion.div>
                )}
              </div>
            </AnimatedCardContent>
          </AnimatedCard>

          {/* Claim Details */}
          <AnimatedCard delay={0.4}>
            <AnimatedCardHeader>
              <AnimatedCardTitle className="flex items-center justify-between">
                <span>Claim Details</span>
                <AnimatePresence>
                  {selectedClaimData && (
                    <motion.div 
                      className="flex space-x-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.button 
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button 
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </AnimatedCardTitle>
            </AnimatedCardHeader>
            <AnimatedCardContent>
              <AnimatePresence mode="wait">
                {selectedClaimData ? (
                  <motion.div 
                    key={selectedClaimData.id}
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                {/* Basic Information */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Claim Number:</span>
                      <p className="font-medium">{selectedClaimData.claimNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">XactAnalysis ID:</span>
                      <p className="font-medium">{selectedClaimData.xactAnalysisId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date of Loss:</span>
                      <p className="font-medium">{formatDate(selectedClaimData.dateOfLoss)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Claim Amount:</span>
                      <p className="font-medium">${selectedClaimData.claimAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Policyholder Information */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Policyholder</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedClaimData.policyholderName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedClaimData.policyholderPhone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{selectedClaimData.policyholderEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {selectedClaimData.propertyAddress}, {selectedClaimData.city}, {selectedClaimData.state} {selectedClaimData.zipCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Entered Queue</span>
                      <span className="text-sm text-gray-600">{formatDate(selectedClaimData.dateEnteredQueue)}</span>
                    </div>
                    
                    {selectedClaimData.customerContactedAt && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Customer Contacted</span>
                        <span className="text-sm text-gray-600">{formatDate(selectedClaimData.customerContactedAt)}</span>
                      </div>
                    )}
                    
                    {selectedClaimData.siteInspectedAt && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Site Inspected</span>
                        <span className="text-sm text-gray-600">{formatDate(selectedClaimData.siteInspectedAt)}</span>
                      </div>
                    )}
                    
                    {selectedClaimData.estimateReturnedAt && (
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium">Estimate Returned</span>
                        <span className="text-sm text-gray-600">{formatDate(selectedClaimData.estimateReturnedAt)}</span>
                      </div>
                    )}
                    
                    {selectedClaimData.qaApprovedAt && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium">QA Approved</span>
                        <span className="text-sm text-gray-600">{formatDate(selectedClaimData.qaApprovedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                    {/* Actions */}
                    <motion.div 
                      className="pt-4 border-t"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Start Workflow
                        </motion.button>
                        <motion.button 
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          View History
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-center py-12 text-gray-500"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    </motion.div>
                    <p>Select a claim to view details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatedCardContent>
          </AnimatedCard>
        </motion.div>
      </div>
    </PageTransition>
  )
}