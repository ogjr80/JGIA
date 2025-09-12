'use client'

import { AnimatedCard, AnimatedCardContent, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card'
import { PageTransition } from '@/components/ui/page-transition'
import { sampleClaims } from '@/lib/data/claims'
import { sampleQuestions, sampleWorkflowResponses, WorkflowResponse } from '@/lib/data/questions'
import { useState } from 'react'
import { WorkflowForm } from './workflow-form'
import { 
  FileText, 
  User, 
  MapPin,
  Calendar
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

export function WorkflowManager() {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const [responses, setResponses] = useState<WorkflowResponse[]>(sampleWorkflowResponses)

  const selectedClaim = selectedClaimId ? sampleClaims.find(c => c.id === selectedClaimId) : null
  const claimResponses = responses.filter(r => r.claimId === selectedClaimId)

  const handleResponseUpdate = (questionId: string, value: string | string[]) => {
    if (!selectedClaimId) return

    const existingResponse = responses.find(r => r.claimId === selectedClaimId && r.questionId === questionId)
    const question = sampleQuestions.find(q => q.id === questionId)
    
    if (!question) return

    if (existingResponse) {
      // Update existing response
      setResponses(prev => prev.map(r => 
        r.id === existingResponse.id 
          ? { ...r, responseValue: value, respondedAt: new Date() }
          : r
      ))
    } else {
      // Create new response
      const newResponse: WorkflowResponse = {
        id: `resp_${Date.now()}`,
        claimId: selectedClaimId,
        questionId,
        questionText: question.questionText,
        responseValue: value,
        parentQuestionId: question.parentQuestionId,
        hierarchyLevel: question.hierarchyLevel,
        sectionName: question.sectionName,
        respondedBy: 'Current User', // In real app, get from auth
        respondedAt: new Date()
      }
      setResponses(prev => [...prev, newResponse])
    }
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
            Workflow Management
          </h1>
          <p className="text-gray-600 mt-2">Dynamic claim workflow with hierarchical questions</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Claim Selection */}
          <AnimatedCard delay={0.1}>
            <AnimatedCardHeader>
              <AnimatedCardTitle>Select Claim</AnimatedCardTitle>
            </AnimatedCardHeader>
            <AnimatedCardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              {sampleClaims.map((claim) => {
                const isSelected = selectedClaimId === claim.id
                const hasResponses = responses.some(r => r.claimId === claim.id)
                
                return (
                  <div
                    key={claim.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => setSelectedClaimId(claim.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          <h3 className="text-sm font-semibold text-gray-900">
                            {claim.claimNumber}
                          </h3>
                          {hasResponses && (
                            <div className="ml-2 w-2 h-2 bg-green-500 rounded-full" title="Has responses"></div>
                          )}
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
                          {claim.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            </AnimatedCardContent>
          </AnimatedCard>

          {/* Workflow Form */}
          <div className="lg:col-span-2">
          {selectedClaim ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Claim Info Header */}
              <AnimatedCard className="mb-6" delay={0.2}>
                <AnimatedCardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedClaim.claimNumber}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedClaim.policyholderName} • {selectedClaim.city}, {selectedClaim.state}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${selectedClaim.claimAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Status: {selectedClaim.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                </AnimatedCardContent>
              </AnimatedCard>

              {/* Dynamic Workflow Form */}
              <WorkflowForm
                claimId={selectedClaimId}
                responses={claimResponses}
                onResponseUpdate={handleResponseUpdate}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <AnimatedCard delay={0.2}>
                <AnimatedCardContent className="p-12 text-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Claim</h3>
                  <p className="text-gray-500">
                    Choose a claim from the list to start or continue the workflow process.
                  </p>
                </AnimatedCardContent>
              </AnimatedCard>
            </motion.div>
          )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}