'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sampleQuestions, WorkflowResponse, Question } from '@/lib/data/questions'
import { useState, useMemo } from 'react'
import { 
  ChevronDown, 
  ChevronRight, 
  Save, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkflowFormProps {
  claimId: string | null
  responses: WorkflowResponse[]
  onResponseUpdate: (questionId: string, value: string | string[]) => void
}

export function WorkflowForm({ claimId, responses, onResponseUpdate }: WorkflowFormProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Setup & First Contact']))
  const [autoSave, setAutoSave] = useState(true)

  // Group questions by section
  const sectionGroups = useMemo(() => {
    const groups: Record<string, Question[]> = {}
    sampleQuestions.forEach(question => {
      if (!groups[question.sectionName]) {
        groups[question.sectionName] = []
      }
      groups[question.sectionName].push(question)
    })
    
    // Sort questions within each section by display order
    Object.keys(groups).forEach(section => {
      groups[section].sort((a, b) => a.displayOrder - b.displayOrder)
    })
    
    return groups
  }, [])

  // Get visible questions based on conditional logic
  const getVisibleQuestions = (sectionQuestions: Question[]) => {
    return sectionQuestions.filter(question => {
      if (!question.conditionalLogic) return true
      
      return question.conditionalLogic.showIf.every(condition => {
        const response = responses.find(r => r.questionId === condition.questionId)
        if (!response) return false
        
        if (Array.isArray(condition.value)) {
          return condition.value.includes(response.responseValue as string)
        }
        return response.responseValue === condition.value
      })
    })
  }

  // Get response for a question
  const getResponse = (questionId: string) => {
    return responses.find(r => r.questionId === questionId)?.responseValue || ''
  }

  // Handle input change
  const handleInputChange = (questionId: string, value: string | string[]) => {
    onResponseUpdate(questionId, value)
  }

  // Early return if no claim selected (after all hooks)
  if (!claimId) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Claim Selected</h3>
          <p className="text-gray-500">
            Please select a claim to begin the workflow process.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Toggle section expansion
  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName)
    } else {
      newExpanded.add(sectionName)
    }
    setExpandedSections(newExpanded)
  }

  // Get section completion status
  const getSectionStatus = (sectionQuestions: Question[]) => {
    const visibleQuestions = getVisibleQuestions(sectionQuestions)
    const requiredQuestions = visibleQuestions.filter(q => q.isRequired)
    const answeredRequired = requiredQuestions.filter(q => {
      const response = getResponse(q.id)
      return response && response !== ''
    })
    
    if (answeredRequired.length === requiredQuestions.length) return 'complete'
    if (answeredRequired.length > 0) return 'partial'
    return 'pending'
  }

  // Render form field based on question type
  const renderFormField = (question: Question) => {
    const response = getResponse(question.id)
    const fieldId = `field_${question.id}`

    switch (question.questionType) {
      case 'text':
        return (
          <input
            id={fieldId}
            type="text"
            value={response as string || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={question.isRequired}
          />
        )

      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={response as string || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={question.isRequired}
          />
        )

      case 'select':
        return (
          <select
            id={fieldId}
            value={response as string || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={question.isRequired}
          >
            <option value="">Select an option...</option>
            {question.dropdownOptions?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.dropdownOptions?.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={Array.isArray(response) ? response.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(response) ? response : []
                    if (e.target.checked) {
                      handleInputChange(question.id, [...currentValues, option])
                    } else {
                      handleInputChange(question.id, currentValues.filter(v => v !== option))
                    }
                  }}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'date':
        return (
          <input
            id={fieldId}
            type="datetime-local"
            value={response as string || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={question.isRequired}
          />
        )

      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              id={fieldId}
              type="checkbox"
              checked={response === 'true'}
              onChange={(e) => handleInputChange(question.id, e.target.checked ? 'true' : 'false')}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{question.questionText}</span>
          </label>
        )

      default:
        return (
          <input
            id={fieldId}
            type="text"
            value={response as string || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Auto-save indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Auto-save responses</span>
          </label>
          {autoSave && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Auto-saving enabled</span>
            </div>
          )}
        </div>
        
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Save className="h-4 w-4 mr-2" />
          Save Progress
        </button>
      </div>

      {/* Workflow Sections */}
      {Object.entries(sectionGroups).map(([sectionName, questions]) => {
        const isExpanded = expandedSections.has(sectionName)
        const visibleQuestions = getVisibleQuestions(questions)
        const sectionStatus = getSectionStatus(questions)
        
        if (visibleQuestions.length === 0) return null

        return (
          <Card key={sectionName} className="overflow-hidden">
            <div 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(sectionName)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 mr-2" />
                  ) : (
                    <ChevronRight className="h-5 w-5 mr-2" />
                  )}
                  <span>{sectionName}</span>
                  <div className="ml-3 flex items-center">
                    {sectionStatus === 'complete' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {sectionStatus === 'partial' && (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    {sectionStatus === 'pending' && (
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{visibleQuestions.filter(q => getResponse(q.id)).length}/{visibleQuestions.length}</span>
                </div>
              </CardTitle>
              </CardHeader>
            </div>
            
            {isExpanded && (
              <CardContent className="pt-0">
                <div className="space-y-6">
                  {visibleQuestions.map((question) => {
                    const hasResponse = !!getResponse(question.id)
                    
                    return (
                      <div 
                        key={question.id}
                        className={cn(
                          "p-4 rounded-lg border-l-4 transition-colors",
                          {
                            'border-l-yellow-400 bg-yellow-50': question.colorCode === 'yellow',
                            'border-l-blue-400 bg-blue-50': question.colorCode === 'blue',
                            'border-l-green-400 bg-green-50': question.colorCode === 'green',
                            'border-l-orange-400 bg-orange-50': question.colorCode === 'orange',
                            'border-l-red-400 bg-red-50': question.colorCode === 'red',
                          }
                        )}
                      >
                        <div className="mb-3">
                          <label 
                            htmlFor={`field_${question.id}`}
                            className="block text-sm font-medium text-gray-900 mb-1"
                          >
                            {question.questionText}
                            {question.isRequired && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                            {hasResponse && (
                              <CheckCircle className="inline h-4 w-4 text-green-500 ml-2" />
                            )}
                          </label>
                          {question.helpText && (
                            <p className="text-xs text-gray-600 mb-2">
                              {question.helpText}
                            </p>
                          )}
                        </div>
                        
                        {question.questionType !== 'checkbox' && (
                          <div className="mb-2">
                            {renderFormField(question)}
                          </div>
                        )}
                        
                        {question.questionType === 'checkbox' && (
                          <div className="mb-2">
                            {renderFormField(question)}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Level {question.hierarchyLevel}</span>
                          <span>Order: {question.displayOrder}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}