export interface Question {
  id: string
  questionText: string
  questionType: 'text' | 'select' | 'multiselect' | 'textarea' | 'date' | 'checkbox' | 'file'
  parentQuestionId?: string
  hierarchyLevel: number
  sectionName: string
  displayOrder: number
  conditionalLogic?: {
    showIf: {
      questionId: string
      value: string | string[]
    }[]
  }
  validationRules?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  colorCode: 'yellow' | 'blue' | 'green' | 'orange' | 'red'
  isRequired: boolean
  dropdownOptions?: string[]
  placeholder?: string
  helpText?: string
}

export interface WorkflowResponse {
  id: string
  claimId: string
  questionId: string
  questionText: string
  responseValue: string | string[]
  parentQuestionId?: string
  hierarchyLevel: number
  sectionName: string
  respondedBy: string
  respondedAt: Date
}

// Sample questions based on the PRD workflow sections
export const sampleQuestions: Question[] = [
  // Section 1: Claim Representation
  {
    id: 'claim_rep_001',
    questionText: 'Is Claim Represented',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'Claim Representation',
    displayOrder: 1,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: [
      'Yes - Attorney Represented',
      'Yes - Public Adjuster Represented',
      'Yes - Attorney and Public Adjuster Attorney',
      'No - Claim is not represented.'
    ]
  },

  // Section 2: Setup & First Contact
  {
    id: 'setup_001',
    questionText: 'Date and time of first customer contact',
    questionType: 'date',
    hierarchyLevel: 1,
    sectionName: 'Setup & First Contact',
    displayOrder: 2,
    colorCode: 'yellow',
    isRequired: true,
    helpText: 'Must be within 24 hours of claim assignment'
  },
  {
    id: 'setup_002',
    questionText: 'Method of first contact',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'Setup & First Contact',
    displayOrder: 3,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: ['Phone Call', 'Email', 'Text Message', 'In Person']
  },
  {
    id: 'setup_003',
    questionText: 'Customer response to first contact',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'Setup & First Contact',
    displayOrder: 4,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: ['Answered', 'Voicemail Left', 'No Answer', 'Busy Signal', 'Invalid Number']
  },
  {
    id: 'setup_004',
    questionText: 'If voicemail left, provide details',
    questionType: 'textarea',
    parentQuestionId: 'setup_003',
    hierarchyLevel: 2,
    sectionName: 'Setup & First Contact',
    displayOrder: 5,
    colorCode: 'blue',
    isRequired: false,
    conditionalLogic: {
      showIf: [{ questionId: 'setup_003', value: ['Voicemail Left'] }]
    },
    placeholder: 'Describe the voicemail message left...'
  },

  // Section 3: Customer Contact & Representation
  {
    id: 'contact_001',
    questionText: 'Is the policyholder represented by a public adjuster?',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'Customer Contact & Representation',
    displayOrder: 6,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: ['Yes', 'No', 'Unknown']
  },
  {
    id: 'contact_002',
    questionText: 'Public adjuster company name',
    questionType: 'text',
    parentQuestionId: 'contact_001',
    hierarchyLevel: 2,
    sectionName: 'Customer Contact & Representation',
    displayOrder: 7,
    colorCode: 'blue',
    isRequired: true,
    conditionalLogic: {
      showIf: [{ questionId: 'contact_001', value: ['Yes'] }]
    }
  },
  {
    id: 'contact_003',
    questionText: 'Public adjuster contact information',
    questionType: 'textarea',
    parentQuestionId: 'contact_001',
    hierarchyLevel: 2,
    sectionName: 'Customer Contact & Representation',
    displayOrder: 8,
    colorCode: 'blue',
    isRequired: true,
    conditionalLogic: {
      showIf: [{ questionId: 'contact_001', value: ['Yes'] }]
    },
    placeholder: 'Name, phone, email, license number...'
  },
  {
    id: 'contact_004',
    questionText: 'Is the policyholder represented by an attorney?',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'Customer Contact & Representation',
    displayOrder: 9,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: ['Yes', 'No', 'Unknown']
  },
  {
    id: 'contact_005',
    questionText: 'Attorney contact information',
    questionType: 'textarea',
    parentQuestionId: 'contact_004',
    hierarchyLevel: 2,
    sectionName: 'Customer Contact & Representation',
    displayOrder: 10,
    colorCode: 'blue',
    isRequired: true,
    conditionalLogic: {
      showIf: [{ questionId: 'contact_004', value: ['Yes'] }]
    },
    placeholder: 'Law firm name, attorney name, contact details...'
  },

  // Section 4: EagleView Requirements
  {
    id: 'eagle_001',
    questionText: 'Is EagleView report required for this claim?',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'EagleView Requirements',
    displayOrder: 11,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: ['Yes', 'No', 'Pending Determination']
  },
  {
    id: 'eagle_002',
    questionText: 'EagleView report request date',
    questionType: 'date',
    parentQuestionId: 'eagle_001',
    hierarchyLevel: 2,
    sectionName: 'EagleView Requirements',
    displayOrder: 12,
    colorCode: 'blue',
    isRequired: true,
    conditionalLogic: {
      showIf: [{ questionId: 'eagle_001', value: ['Yes'] }]
    }
  },
  {
    id: 'eagle_003',
    questionText: 'EagleView report status',
    questionType: 'select',
    parentQuestionId: 'eagle_001',
    hierarchyLevel: 2,
    sectionName: 'EagleView Requirements',
    displayOrder: 13,
    colorCode: 'blue',
    isRequired: true,
    conditionalLogic: {
      showIf: [{ questionId: 'eagle_001', value: ['Yes'] }]
    },
    dropdownOptions: ['Requested', 'In Progress', 'Completed', 'Failed - Retry Needed', 'Not Available']
  },

  // Section 5: Ladder Assist Approval
  {
    id: 'ladder_001',
    questionText: 'Is ladder assist required for inspection?',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'Ladder Assist Approval',
    displayOrder: 14,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: ['Yes', 'No', 'To Be Determined']
  },
  {
    id: 'ladder_002',
    questionText: 'Reason for ladder assist requirement',
    questionType: 'multiselect',
    parentQuestionId: 'ladder_001',
    hierarchyLevel: 2,
    sectionName: 'Ladder Assist Approval',
    displayOrder: 15,
    colorCode: 'blue',
    isRequired: true,
    conditionalLogic: {
      showIf: [{ questionId: 'ladder_001', value: ['Yes'] }]
    },
    dropdownOptions: ['Safety Concerns', 'Height Restrictions', 'Equipment Requirements', 'Property Access Issues', 'Other']
  },
  {
    id: 'ladder_003',
    questionText: 'Ladder assist approval status',
    questionType: 'select',
    parentQuestionId: 'ladder_001',
    hierarchyLevel: 2,
    sectionName: 'Ladder Assist Approval',
    displayOrder: 16,
    colorCode: 'blue',
    isRequired: true,
    conditionalLogic: {
      showIf: [{ questionId: 'ladder_001', value: ['Yes'] }]
    },
    dropdownOptions: ['Pending Approval', 'Approved', 'Denied', 'Alternative Solution Required']
  },

  // Section 6: Inspection Scheduling
  {
    id: 'inspect_001',
    questionText: 'Initial inspection date and time',
    questionType: 'date',
    hierarchyLevel: 1,
    sectionName: 'Inspection Scheduling',
    displayOrder: 17,
    colorCode: 'yellow',
    isRequired: true
  },
  {
    id: 'inspect_002',
    questionText: 'Inspection type',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'Inspection Scheduling',
    displayOrder: 18,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: ['Interior Only', 'Exterior Only', 'Interior & Exterior', 'Remote/Virtual', 'Re-inspection']
  },
  {
    id: 'inspect_003',
    questionText: 'Special access requirements',
    questionType: 'multiselect',
    hierarchyLevel: 1,
    sectionName: 'Inspection Scheduling',
    displayOrder: 19,
    colorCode: 'blue',
    isRequired: false,
    dropdownOptions: ['Key Required', 'Tenant Coordination', 'Business Hours Only', 'Security System', 'Pet Present', 'None']
  },

  // Section 7: Documentation Requirements
  {
    id: 'doc_001',
    questionText: 'Required documentation checklist',
    questionType: 'multiselect',
    hierarchyLevel: 1,
    sectionName: 'Documentation Requirements',
    displayOrder: 20,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: [
      'Policy Declaration Page',
      'Proof of Loss',
      'Contractor Estimates',
      'Photos of Damage',
      'Weather Report',
      'Police Report (if applicable)',
      'Receipts for Temporary Repairs'
    ]
  },
  {
    id: 'doc_002',
    questionText: 'Missing documentation items',
    questionType: 'multiselect',
    hierarchyLevel: 2,
    sectionName: 'Documentation Requirements',
    displayOrder: 21,
    colorCode: 'orange',
    isRequired: false,
    dropdownOptions: [
      'Policy Declaration Page',
      'Proof of Loss',
      'Contractor Estimates',
      'Photos of Damage',
      'Weather Report',
      'Police Report',
      'Receipts for Temporary Repairs'
    ]
  },

  // Section 8: QA Review Process
  {
    id: 'qa_001',
    questionText: 'Initial estimate completion status',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'QA Review Process',
    displayOrder: 22,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: ['Complete', 'In Progress', 'Pending Information', 'On Hold']
  },
  {
    id: 'qa_002',
    questionText: 'QA review required?',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'QA Review Process',
    displayOrder: 23,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: ['Yes - Standard Review', 'Yes - Complex Claim Review', 'No - Standard Processing', 'Escalated Review Required']
  },
  {
    id: 'qa_003',
    questionText: 'QA reviewer assigned',
    questionType: 'select',
    parentQuestionId: 'qa_002',
    hierarchyLevel: 2,
    sectionName: 'QA Review Process',
    displayOrder: 24,
    colorCode: 'blue',
    isRequired: true,
    conditionalLogic: {
      showIf: [{ questionId: 'qa_002', value: ['Yes - Standard Review', 'Yes - Complex Claim Review', 'Escalated Review Required'] }]
    },
    dropdownOptions: ['Manager 1', 'Manager 2', 'Senior Reviewer', 'External QA Team']
  },

  // Section 9: Status Reporting
  {
    id: 'status_001',
    questionText: 'Current claim status',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'Status Reporting',
    displayOrder: 25,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: [
      'Initial Contact Made',
      'Inspection Scheduled',
      'Inspection Complete',
      'Estimate In Progress',
      'Estimate Complete',
      'Under Review',
      'Approved',
      'Denied',
      'Closed'
    ]
  },
  {
    id: 'status_002',
    questionText: 'Next action required',
    questionType: 'select',
    hierarchyLevel: 1,
    sectionName: 'Status Reporting',
    displayOrder: 26,
    colorCode: 'yellow',
    isRequired: true,
    dropdownOptions: [
      'Schedule Inspection',
      'Complete Documentation',
      'Submit for QA Review',
      'Await Customer Response',
      'Process Payment',
      'Close Claim',
      'Escalate to Manager'
    ]
  },
  {
    id: 'status_003',
    questionText: 'Estimated completion date',
    questionType: 'date',
    hierarchyLevel: 1,
    sectionName: 'Status Reporting',
    displayOrder: 27,
    colorCode: 'blue',
    isRequired: true
  }
]

// Sample workflow responses
export const sampleWorkflowResponses: WorkflowResponse[] = [
  {
    id: 'resp_001',
    claimId: '1',
    questionId: 'setup_001',
    questionText: 'Date and time of first customer contact',
    responseValue: '2025-01-10T14:30:00Z',
    hierarchyLevel: 1,
    sectionName: 'Setup & First Contact',
    respondedBy: 'Sarah Johnson',
    respondedAt: new Date('2025-01-10T14:30:00Z')
  },
  {
    id: 'resp_002',
    claimId: '1',
    questionId: 'setup_002',
    questionText: 'Method of first contact',
    responseValue: 'Phone Call',
    hierarchyLevel: 1,
    sectionName: 'Setup & First Contact',
    respondedBy: 'Sarah Johnson',
    respondedAt: new Date('2025-01-10T14:30:00Z')
  },
  {
    id: 'resp_003',
    claimId: '1',
    questionId: 'setup_003',
    questionText: 'Customer response to first contact',
    responseValue: 'Answered',
    hierarchyLevel: 1,
    sectionName: 'Setup & First Contact',
    respondedBy: 'Sarah Johnson',
    respondedAt: new Date('2025-01-10T14:30:00Z')
  },
  {
    id: 'resp_004',
    claimId: '2',
    questionId: 'contact_001',
    questionText: 'Is the policyholder represented by a public adjuster?',
    responseValue: 'No',
    hierarchyLevel: 1,
    sectionName: 'Customer Contact & Representation',
    respondedBy: 'Mike Rodriguez',
    respondedAt: new Date('2025-01-10T16:00:00Z')
  }
]