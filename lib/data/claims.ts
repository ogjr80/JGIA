export interface Claim {
  id: string
  claimNumber: string
  xactAnalysisId: string
  dateEnteredQueue: Date
  dateOfLoss: Date
  policyholderName: string
  policyholderPhone: string
  policyholderEmail: string
  propertyAddress: string
  city: string
  county: string
  zipCode: string
  state: string
  claimAmount: number
  assignedAdjusterId?: string
  assignedAdjusterName?: string
  status: 'queue' | 'assigned' | 'contacted' | 'inspected' | 'estimate_returned' | 'correction_returned' | 'qa_approved' | 'reviewed' | 'completed'
  customerContactedAt?: Date
  siteInspectedAt?: Date
  estimateReturnedAt?: Date
  correctionReturnedAt?: Date
  qaApprovedAt?: Date
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
  firstContactDeadline: Date
  priority: 'high' | 'medium' | 'low'
}

export interface KPIEvent {
  id: string
  claimId: string
  eventType: 'first_contact' | 'inspection' | 'estimate' | 'qa_review'
  status: 'green' | 'yellow' | 'red'
  targetTime: Date
  actualTime?: Date
  durationHours?: number
  isCompliant: boolean
  notes?: string
  createdAt: Date
}

// Sample claims data
export const sampleClaims: Claim[] = [
  {
    id: '1',
    claimNumber: 'FL-2025-001234',
    xactAnalysisId: 'XA-001234',
    dateEnteredQueue: new Date('2025-01-10T08:00:00Z'),
    dateOfLoss: new Date('2025-01-08T00:00:00Z'),
    policyholderName: 'John Smith',
    policyholderPhone: '(555) 123-4567',
    policyholderEmail: 'john.smith@email.com',
    propertyAddress: '123 Main St',
    city: 'Miami',
    county: 'Miami-Dade',
    zipCode: '33101',
    state: 'FL',
    claimAmount: 15000,
    assignedAdjusterId: 'adj1',
    assignedAdjusterName: 'Sarah Johnson',
    status: 'contacted',
    customerContactedAt: new Date('2025-01-10T14:30:00Z'),
    createdAt: new Date('2025-01-10T08:00:00Z'),
    updatedAt: new Date('2025-01-10T14:30:00Z'),
    firstContactDeadline: new Date('2025-01-11T08:00:00Z'),
    priority: 'high'
  },
  {
    id: '2',
    claimNumber: 'FL-2025-001235',
    xactAnalysisId: 'XA-001235',
    dateEnteredQueue: new Date('2025-01-10T10:15:00Z'),
    dateOfLoss: new Date('2025-01-09T00:00:00Z'),
    policyholderName: 'Maria Garcia',
    policyholderPhone: '(555) 987-6543',
    policyholderEmail: 'maria.garcia@email.com',
    propertyAddress: '456 Oak Ave',
    city: 'Tampa',
    county: 'Hillsborough',
    zipCode: '33602',
    state: 'FL',
    claimAmount: 25000,
    assignedAdjusterId: 'adj2',
    assignedAdjusterName: 'Mike Rodriguez',
    status: 'inspected',
    customerContactedAt: new Date('2025-01-10T15:45:00Z'),
    siteInspectedAt: new Date('2025-01-11T09:30:00Z'),
    createdAt: new Date('2025-01-10T10:15:00Z'),
    updatedAt: new Date('2025-01-11T09:30:00Z'),
    firstContactDeadline: new Date('2025-01-11T10:15:00Z'),
    priority: 'medium'
  },
  {
    id: '3',
    claimNumber: 'FL-2025-001236',
    xactAnalysisId: 'XA-001236',
    dateEnteredQueue: new Date('2025-01-11T09:00:00Z'),
    dateOfLoss: new Date('2025-01-10T00:00:00Z'),
    policyholderName: 'Robert Wilson',
    policyholderPhone: '(555) 456-7890',
    policyholderEmail: 'robert.wilson@email.com',
    propertyAddress: '789 Pine St',
    city: 'Orlando',
    county: 'Orange',
    zipCode: '32801',
    state: 'FL',
    claimAmount: 8500,
    assignedAdjusterId: 'adj1',
    assignedAdjusterName: 'Sarah Johnson',
    status: 'assigned',
    createdAt: new Date('2025-01-11T09:00:00Z'),
    updatedAt: new Date('2025-01-11T09:00:00Z'),
    firstContactDeadline: new Date('2025-01-12T09:00:00Z'),
    priority: 'low'
  },
  {
    id: '4',
    claimNumber: 'FL-2025-001237',
    xactAnalysisId: 'XA-001237',
    dateEnteredQueue: new Date('2025-01-11T14:30:00Z'),
    dateOfLoss: new Date('2025-01-11T00:00:00Z'),
    policyholderName: 'Jennifer Davis',
    policyholderPhone: '(555) 321-0987',
    policyholderEmail: 'jennifer.davis@email.com',
    propertyAddress: '321 Elm Dr',
    city: 'Jacksonville',
    county: 'Duval',
    zipCode: '32202',
    state: 'FL',
    claimAmount: 32000,
    status: 'queue',
    createdAt: new Date('2025-01-11T14:30:00Z'),
    updatedAt: new Date('2025-01-11T14:30:00Z'),
    firstContactDeadline: new Date('2025-01-12T14:30:00Z'),
    priority: 'high'
  },
  {
    id: '5',
    claimNumber: 'FL-2025-001238',
    xactAnalysisId: 'XA-001238',
    dateEnteredQueue: new Date('2025-01-09T16:45:00Z'),
    dateOfLoss: new Date('2025-01-07T00:00:00Z'),
    policyholderName: 'David Thompson',
    policyholderPhone: '(555) 654-3210',
    policyholderEmail: 'david.thompson@email.com',
    propertyAddress: '654 Maple Ln',
    city: 'Fort Lauderdale',
    county: 'Broward',
    zipCode: '33301',
    state: 'FL',
    claimAmount: 19500,
    assignedAdjusterId: 'adj3',
    assignedAdjusterName: 'Lisa Chen',
    status: 'qa_approved',
    customerContactedAt: new Date('2025-01-10T08:15:00Z'),
    siteInspectedAt: new Date('2025-01-10T13:20:00Z'),
    estimateReturnedAt: new Date('2025-01-11T10:45:00Z'),
    qaApprovedAt: new Date('2025-01-11T16:30:00Z'),
    createdAt: new Date('2025-01-09T16:45:00Z'),
    updatedAt: new Date('2025-01-11T16:30:00Z'),
    firstContactDeadline: new Date('2025-01-10T16:45:00Z'),
    priority: 'medium'
  }
]

// Sample KPI events
export const sampleKPIEvents: KPIEvent[] = [
  {
    id: 'kpi1',
    claimId: '1',
    eventType: 'first_contact',
    status: 'green',
    targetTime: new Date('2025-01-11T08:00:00Z'),
    actualTime: new Date('2025-01-10T14:30:00Z'),
    durationHours: 6.5,
    isCompliant: true,
    notes: 'Customer contacted successfully within deadline',
    createdAt: new Date('2025-01-10T14:30:00Z')
  },
  {
    id: 'kpi2',
    claimId: '2',
    eventType: 'first_contact',
    status: 'green',
    targetTime: new Date('2025-01-11T10:15:00Z'),
    actualTime: new Date('2025-01-10T15:45:00Z'),
    durationHours: 5.5,
    isCompliant: true,
    createdAt: new Date('2025-01-10T15:45:00Z')
  },
  {
    id: 'kpi3',
    claimId: '3',
    eventType: 'first_contact',
    status: 'yellow',
    targetTime: new Date('2025-01-12T09:00:00Z'),
    durationHours: 0,
    isCompliant: false,
    notes: 'Approaching 24-hour deadline',
    createdAt: new Date('2025-01-11T09:00:00Z')
  },
  {
    id: 'kpi4',
    claimId: '4',
    eventType: 'first_contact',
    status: 'green',
    targetTime: new Date('2025-01-12T14:30:00Z'),
    durationHours: 0,
    isCompliant: true,
    notes: 'Recently entered queue',
    createdAt: new Date('2025-01-11T14:30:00Z')
  }
]

export const adjusters = [
  { id: 'adj1', name: 'Sarah Johnson', currentWorkload: 8, maxWorkload: 20, specialties: ['Wind', 'Hail', 'Water'] },
  { id: 'adj2', name: 'Mike Rodriguez', currentWorkload: 12, maxWorkload: 20, specialties: ['Fire', 'Theft', 'Vandalism'] },
  { id: 'adj3', name: 'Lisa Chen', currentWorkload: 6, maxWorkload: 20, specialties: ['Water', 'Mold', 'Structural'] },
  { id: 'adj4', name: 'James Wilson', currentWorkload: 15, maxWorkload: 20, specialties: ['Wind', 'Hail'] },
  { id: 'adj5', name: 'Emma Davis', currentWorkload: 4, maxWorkload: 20, specialties: ['Liability', 'Personal Property'] }
]