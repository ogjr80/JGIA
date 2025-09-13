'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sampleQuestions, WorkflowResponse, Question, loadCompleteQuestionData, convertToLegacyQuestion, getDropdownOptions } from '@/lib/data/questions'
import { useState, useMemo, useEffect } from 'react'
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [autoSave, setAutoSave] = useState(true)
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions)
  const [loading, setLoading] = useState(true)

  // Load complete question data on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questionSystem = await loadCompleteQuestionData()
        const allQuestions: Question[] = []
        
        // Convert all questions from all groups to legacy format
        Object.entries(questionSystem.groups).forEach(([, group]) => {
          group.questions.forEach(question => {
            const legacyQuestion = convertToLegacyQuestion(question, group.name)
            allQuestions.push(legacyQuestion)
          })
        })
        
        console.log('Loaded questions:', allQuestions.length)
        console.log('First few questions:', allQuestions.slice(0, 3))
        
        setQuestions(allQuestions)
        
        // Auto-expand the first section
        if (allQuestions.length > 0) {
          const firstSection = allQuestions[0].sectionName
          if (firstSection) {
            setExpandedSections(new Set([firstSection]))
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Failed to load questions:', error)
        setQuestions(sampleQuestions)
        setLoading(false)
      }
    }
    
    loadQuestions()
  }, [])

  // Group questions by section
  const sectionGroups = useMemo(() => {
    const groups: Record<string, Question[]> = {}
    questions.forEach(question => {
      const sectionName = question.sectionName || 'Default'
      if (!groups[sectionName]) {
        groups[sectionName] = []
      }
      groups[sectionName].push(question)
    })
    
    // Sort questions within each section by display order
    Object.keys(groups).forEach(section => {
      groups[section].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    })
    
    return groups
  }, [questions])

  // Get visible questions based on conditional logic - memoized to re-evaluate when responses change
  const getVisibleQuestions = useMemo(() => {
    return (sectionQuestions: Question[]) => {
      return sectionQuestions.filter(question => {
        // Show level 0 questions by default (no parent)
        if (question.level === 0) {
          return true
        }
        
        // Handle conditional questions with parentQuestionId
        if (question.parentQuestionId) {
          const parentResponse = responses.find(r => r.questionId === question.parentQuestionId)
          if (!parentResponse) {
            console.log(`Question ${question.id} hidden: parent ${question.parentQuestionId} not answered`)
            return false
          }
          
          // Check if the parent's answer matches the trigger condition
          const parentAnswer = parentResponse.responseValue as string
          
          // For questions that start with "> If yes", show if parent answered "Yes"
          if ((question.text || '').startsWith('> If yes') || question.answerType === 'Yes') {
            const shouldShow = parentAnswer === 'Yes'
            console.log(`Question ${question.id} (If yes): parent answered "${parentAnswer}", showing: ${shouldShow}`)
            return shouldShow
          }
          
          // For questions that start with "> If no", show if parent answered "No"  
          if ((question.text || '').startsWith('> If no') || question.answerType === 'No') {
            const shouldShow = parentAnswer === 'No'
            console.log(`Question ${question.id} (If no): parent answered "${parentAnswer}", showing: ${shouldShow}`)
            return shouldShow
          }
          
          // For other conditional questions, show if parent has been answered
          console.log(`Question ${question.id}: parent answered, showing`)
          return true
        }
        
        // Handle explicit conditional logic structure
        if (question.conditionalLogic && question.conditionalLogic.parent_id) {
          const parentResponse = responses.find(r => r.questionId === question.conditionalLogic?.parent_id)
          if (!parentResponse) return false
          
          const triggerValue = question.conditionalLogic.trigger_condition
          const shouldShow = parentResponse.responseValue === triggerValue
          console.log(`Question ${question.id}: parent ${question.conditionalLogic.parent_id} answered "${parentResponse.responseValue}", trigger "${triggerValue}", showing: ${shouldShow}`)
          return shouldShow
        }
        
        // Handle legacy conditional logic structure
        if (question.conditionalLogic && question.conditionalLogic.showIf) {
          return question.conditionalLogic.showIf.every(condition => {
            const response = responses.find(r => r.questionId === condition.questionId)
            if (!response) return false
            
            if (Array.isArray(condition.value)) {
              return condition.value.includes(response.responseValue as string)
            }
            return response.responseValue === condition.value
          })
        }
        
        console.log(`Question ${question.id}: no conditional logic, hiding`)
        return false
      })
    }
  }, [responses]) // Re-evaluate when responses change

  // Get response for a question
  const getResponse = (questionId: string) => {
    return responses.find(r => r.questionId === questionId)?.responseValue || ''
  }

  // Handle input change
  const handleInputChange = (questionId: string, value: string | string[]) => {
    onResponseUpdate(questionId, value)
    // The memoized getVisibleQuestions will automatically re-evaluate when responses change
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

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Questions</h3>
          <p className="text-gray-500">
            Loading the complete question system...
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
    // Filter out informational questions from completion calculation
    const interactiveQuestions = visibleQuestions.filter(q => 
      q.answerType !== 'Manager to complete task' && 
      q.answerType !== 'Review not required' && 
      q.answerType !== 'Review Not Required' &&
      q.answerType !== 'Example'
    )
    const requiredQuestions = interactiveQuestions.filter(q => q.isRequired)
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

    // Handle informational questions (not interactive)
    if (question.answerType === 'Manager to complete task' || 
        question.answerType === 'Review not required' || 
        question.answerType === 'Review Not Required' ||
        question.answerType === 'Example') {
      return (
        <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 italic">
          {question.answerType}
        </div>
      )
    }

    switch (question.questionType) {
      case 'text':
        return (
          <input
            id={fieldId}
            type="text"
            value={response as string || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required={question.isRequired}
          />
        )

      case 'select':
        const dropdownOptions = getDropdownOptions(question)
        console.log(`Rendering select for question ${question.id}:`, {
          options: dropdownOptions,
          currentValue: response,
          questionType: question.questionType
        })
        return (
          <select
            id={fieldId}
            value={response as string || ''}
            onChange={(e) => {
              console.log(`Select changed for question ${question.id}:`, e.target.value)
              handleInputChange(question.id, e.target.value)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            required={question.isRequired}
          >
            <option value="" className="text-gray-500">Select an option...</option>
            {dropdownOptions.map(option => (
              <option key={option} value={option} className="text-gray-900">
                {option}
              </option>
            ))}
          </select>
        )

      case 'multiselect':
        const multiselectOptions = getDropdownOptions(question)
        return (
          <div className="space-y-2">
            {multiselectOptions.map(option => (
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
        
        console.log(`Section ${sectionName}: ${visibleQuestions.length} visible questions out of ${questions.length} total`)
        console.log(`Visible questions:`, visibleQuestions.map(q => ({ id: q.id, text: q.text, level: q.level })))
        
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
                            {question.questionText || question.text}
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
                          <span>Level {question.hierarchyLevel || question.level}</span>
                          <span>Order: {question.displayOrder || 0}</span>
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