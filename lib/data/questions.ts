import { getRealDropdownOptions, shouldUseRealDropdown } from './real_dropdown_mapping';

export interface DropdownData {
  raw_value: string;
  parsed_options: string[];
  option_count: number;
}

export interface ConditionalLogic {
  // New fields from complete data
  parent_id?: string;
  trigger_condition?: string;
  level?: number;
  parent_text?: string;
  question_text?: string;
  // Legacy fields for backward compatibility
  parentId?: string;
  triggerCondition?: string;
  showIf?: {
    questionId: string
    value: string | string[]
  }[]
}

export interface Question {
  id: string
  // New fields from complete data
  text?: string
  level?: number
  colorCode?: string
  isConditional?: boolean
  parentQuestionId?: string
  answerType?: string
  dropdownData?: Record<string, DropdownData>
  conditionalLogic?: ConditionalLogic
  // Legacy fields for backward compatibility
  questionText?: string
  questionType?: 'text' | 'select' | 'multiselect' | 'textarea' | 'date' | 'checkbox' | 'file'
  hierarchyLevel?: number
  sectionName?: string
  displayOrder?: number
  validationRules?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  isRequired?: boolean
  dropdownOptions?: string[]
  placeholder?: string
  helpText?: string
}

export interface QuestionGroup {
  id: string;
  name: string;
  questions: Question[];
}

export interface QuestionSystemMetadata {
  total_groups: number;
  total_questions: number;
  total_conditional_relationships: number;
}

export interface QuestionSystem {
  version: string;
  description: string;
  metadata: QuestionSystemMetadata;
  groups: Record<string, QuestionGroup>;
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

// Load complete question data
let completeQuestionData: QuestionSystem | null = null;

export async function loadCompleteQuestionData(): Promise<QuestionSystem> {
  if (completeQuestionData) {
    return completeQuestionData;
  }
  
  try {
    const response = await fetch('/data/complete_questions_data.json');
    const data = await response.json();
    completeQuestionData = data;
    return data;
  } catch (error) {
    console.error('Failed to load complete question data:', error);
    // Fallback to sample data
    return {
      version: "1.0.0",
      description: "Sample Question System",
      metadata: {
        total_groups: 1,
        total_questions: sampleQuestions.length,
        total_conditional_relationships: 0
      },
      groups: {
        "sample": {
          id: "sample",
          name: "Sample Questions",
          questions: sampleQuestions
        }
      }
    };
  }
}

// Get dropdown options from column D for a question
export function getDropdownOptions(question: Question): string[] {
  console.log(`Getting dropdown options for question ${question.id}:`, {
    answerType: question.answerType,
    text: question.text,
    dropdownData: question.dropdownData
  });
  
  // Priority 1: Use real dropdown options from Excel file if available
  const questionText = question.text || question.questionText || '';
  if (shouldUseRealDropdown(questionText)) {
    const realOptions = getRealDropdownOptions(questionText);
    if (realOptions) {
      console.log(`Using real dropdown options from Excel:`, realOptions);
      return realOptions;
    }
  }
  
  // Priority 2: Use column D options if available and not just "Choose one"
  if (question.dropdownData && question.dropdownData.D && question.dropdownData.D.parsed_options.length > 0) {
    const options = question.dropdownData.D.parsed_options;
    // If it's just "Choose one", use intelligent mapping instead
    if (options.length === 1 && options[0] === 'Choose one') {
      console.log(`Column D has "Choose one", using intelligent mapping`);
      return getIntelligentOptions(question);
    }
    console.log(`Using column D options:`, options);
    return options;
  }
  
  // Fallback to legacy dropdownOptions
  if (question.dropdownOptions && question.dropdownOptions.length > 0) {
    console.log(`Using legacy dropdownOptions:`, question.dropdownOptions);
    return question.dropdownOptions;
  }
  
  // Use intelligent mapping based on question text and answer type
  return getIntelligentOptions(question);
}

// Intelligent dropdown option selection based on question text patterns
function getIntelligentOptions(question: Question): string[] {
  const questionText = (question.text || question.questionText || '').toLowerCase();
  const answerType = question.answerType;
  
  console.log(`Intelligent mapping for question: "${question.text || question.questionText}" (answerType: ${answerType})`);
  
  // Handle specific answer types from the data
  if (answerType === 'Repeated attempts, Unresponsive, Other') {
    console.log(`Using repeated attempts options`);
    return ['Repeated attempts', 'Unresponsive', 'Other'];
  }
  
  if (answerType === 'Manager to complete task') {
    console.log(`Using manager task options`);
    return ['Manager to complete task'];
  }
  
  if (answerType === 'Review Required') {
    console.log(`Using review required options`);
    return ['Yes', 'No'];
  }
  
  if (answerType === 'Review not required' || answerType === 'Review Not Required') {
    console.log(`Using review not required options`);
    return ['Review not required'];
  }
  
  if (answerType === 'Example') {
    console.log(`Using example options`);
    return ['Example'];
  }
  
  // Yes/No questions
  if (answerType === 'Yes/No' || answerType === 'Yes' || answerType === 'No' || 
      questionText.includes('was ') || questionText.includes('is ') || questionText.includes('did ') ||
      questionText.includes('has ') || questionText.includes('have ') || questionText.includes('can ')) {
    console.log(`Using Yes/No options`);
    return ['Yes', 'No'];
  }
  
  // Fault questions - specific pattern for "is the TA at fault"
  if (questionText.includes('ta at fault') || questionText.includes('at fault')) {
    console.log(`Using fault options`);
    return ['Yes', 'No', 'Partially', 'Not Applicable'];
  }
  
  // Status/Response questions - but not the specific "Repeated attempts, Unresponsive, Other" type
  if ((questionText.includes('status') || questionText.includes('response') || 
      questionText.includes('manager') || questionText.includes('request') ||
      questionText.includes('plan of action') || questionText.includes('resolution')) &&
      answerType !== 'Repeated attempts, Unresponsive, Other') {
    console.log(`Using status_response options`);
    return ['Repeated attempts', 'Unresponsive', 'Other', 'Manager to complete task'];
  }
  
  // Review questions - but handle specific answer types first
  if ((questionText.includes('review') || questionText.includes('meet') || 
      questionText.includes('standards') || questionText.includes('qa')) &&
      answerType && !answerType.includes('Review')) {
    console.log(`Using quality options`);
    return ['Yes', 'No-modified', 'No-rejected', 'Review Required', 'Review not required'];
  }
  
  // Upload/Completion questions
  if (questionText.includes('upload') || questionText.includes('completed') || 
      questionText.includes('sent') || questionText.includes('received')) {
    console.log(`Using actions options`);
    return ['Yes', 'No', 'Enter date/time', 'SKIP TO MANAGER FINAL REVIEW/INVOICE'];
  }
  
  // Why/Reason questions
  if (questionText.includes('why') || questionText.includes('reason') || 
      questionText.includes('not') || questionText.includes('why not')) {
    console.log(`Using reason options`);
    return ['Technical issue', 'User error', 'System delay', 'Other', 'Repeated attempts', 'Unresponsive'];
  }
  
  // Assignment questions
  if (questionText.includes('reassign') || questionText.includes('assignment')) {
    console.log(`Using assignment options`);
    return ['Do not reassign claim', 'Reassign to different adjuster', 'Escalate to manager'];
  }
  
  // Default fallback
  console.log(`Using default Yes/No options as fallback`);
  return ['Yes', 'No'];
}

// Convert complete question to legacy format for backward compatibility
export function convertToLegacyQuestion(question: Question, groupName: string): Question {
  const converted = {
    ...question,
    questionText: question.text || question.questionText,
    questionType: getQuestionType(question.answerType || 'text'),
    hierarchyLevel: question.level || question.hierarchyLevel || 0,
    sectionName: groupName,
    displayOrder: question.displayOrder || 0,
    isRequired: question.isRequired || false,
    dropdownOptions: getDropdownOptions(question),
    colorCode: getColorCode(question.colorCode || 'Default')
  };
  
  console.log(`Converted question ${question.id}:`, {
    text: converted.questionText,
    questionType: converted.questionType,
    dropdownOptions: converted.dropdownOptions,
    answerType: question.answerType
  });
  
  return converted;
}

// Map color codes from the data to our UI colors
function getColorCode(colorCode: string): 'yellow' | 'blue' | 'green' | 'orange' | 'red' {
  switch (colorCode) {
    case 'Default':
      return 'yellow';
    case 'FFFF9900': // Orange
      return 'orange';
    case 'FF0070C0': // Blue
      return 'blue';
    case 'FFFF66FF': // Pink/Magenta
      return 'red';
    case 'FF00B050': // Green
      return 'green';
    default:
      return 'yellow';
  }
}

// Map answer type to question type
function getQuestionType(answerType: string): 'text' | 'select' | 'multiselect' | 'textarea' | 'date' | 'checkbox' | 'file' {
  // Handle special answer types that should not have dropdowns (informational)
  if (answerType === 'Manager to complete task' || 
      answerType === 'Review not required' || 
      answerType === 'Review Not Required' ||
      answerType === 'Example') {
    return 'text'; // These are informational, not actual questions
  }
  
  switch (answerType) {
    case 'Yes/No':
    case 'Choose one':
    case 'Yes':  // For conditional questions that should be Yes/No
    case 'No':   // For conditional questions that should be Yes/No
    case 'Review Required':
    case 'Repeated attempts, Unresponsive, Other':
      return 'select';
    case 'Text':
      return 'textarea';
    case 'Date/Time':
      return 'date';
    default:
      // If it has dropdown options, make it a select
      return 'select';
  }
}

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