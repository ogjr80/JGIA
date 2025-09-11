# Jimmie Giles Insurance Adjuster Platform
## Product Requirements Document (PRD)

### Version 1.0
### Date: September 2025

---

## 1. Executive Summary

### 1.1 Product Overview
The Jimmie Giles Insurance Adjuster Platform is a comprehensive claims management system that integrates with XactAnalysis webhooks to provide real-time claim tracking, workflow management, and KPI monitoring for insurance adjusters and managers in Florida.

### 1.2 Business Objectives
- Streamline claims processing workflow with automated data integration
- Provide real-time KPI tracking and performance monitoring
- Implement hierarchical decision trees for complex claim workflows
- Ensure 24-hour first contact compliance with automated alerts
- Create audit trails and quality assurance protocols

### 1.3 Success Metrics
- 100% first contact compliance within 24 hours
- Reduction in claim processing time by 30%
- Improved audit compliance and documentation
- Real-time visibility into claim status and bottlenecks

---

## 2. Product Architecture

### 2.1 Technology Stack
- **Frontend**: Next.js 14+ (App Router)
- **Backend**: Supabase (PostgreSQL + Real-time + Auth + Storage)
- **Deployment**: Vercel
- **External Integration**: XactAnalysis API webhooks
- **Real-time Updates**: Supabase Realtime
- **Authentication**: Supabase Auth with Row Level Security

### 2.2 System Architecture
```
XactAnalysis → Webhook → Next.js API → Supabase → Real-time UI Updates
```

---

## 3. Core Features & Requirements

### 3.1 XactAnalysis Integration

#### 3.1.1 Webhook Event Processing
**Requirement**: Process 6 distinct webhook events from XactAnalysis
- Customer Contacted
- Site Inspected  
- Estimate Returned
- Correction Returned
- QA Approved
- Reviewed

**Technical Implementation**:
- Create Next.js API endpoint: `/api/webhooks/xactanalysis`
- Webhook signature verification for security
- Event-driven architecture with proper error handling
- Automatic claim record creation/updates

#### 3.1.2 Data Mapping
**Requirement**: Map XactAnalysis fields to internal claim structure
- Claim Number
- Date Entered Assignment Queue
- Adjuster Assignment
- DOL (Date of Loss)
- Policyholder Information
- Location Data (City, County, Zip, State)
- Claim Amount
- Status Timestamps

### 3.2 Claims Management System

#### 3.2.1 Assignment Queue
**Requirement**: Automated claim assignment with tracking
- Claims enter assignment queue via webhook
- Dispatcher assigns claims to adjusters
- 24-hour first contact timer starts immediately
- Automatic escalation and alerts

#### 3.2.2 Hierarchical Workflow Engine
**Requirement**: Dynamic form system with 600+ conditional fields
- Initial form shows only yellow-highlighted primary fields
- Conditional field display based on previous selections
- Multi-tier hierarchy (up to 14 levels deep)
- Color-coded workflow sections for visual organization

**Workflow Sections**:
1. Setup & First Contact
2. Customer Contact & Representation
3. EagleView Requirements
4. Ladder Assist Approval
5. Inspection Scheduling
6. Documentation Requirements
7. QA Review Process
8. Status Reporting
9. Estimate Processing
10. Final Review & Approval

#### 3.2.3 Dynamic Form System
**Features**:
- Progressive disclosure of form fields
- Real-time form validation
- Auto-save functionality
- Conditional logic engine
- Rich text editing for notes
- File upload capabilities

### 3.3 Manager Dashboard

#### 3.3.1 KPI Monitoring
**Real-time KPIs with color-coded alerts**:
- **First Contact Compliance**
  - Green: Contact made within 24 hours
  - Yellow: Approaching 24-hour deadline (e.g., 20+ hours)
  - Red: Exceeded 24-hour deadline
- **Inspection Timeline**
- **Documentation Completion**
- **QA Approval Status**
- **Customer Satisfaction Metrics**

#### 3.3.2 Claims Overview
- Interactive claims map
- Filterable claims list
- Adjuster workload distribution
- Assignment queue management
- Performance analytics

#### 3.3.3 Alert System
**Automated Notifications**:
- 24-hour first contact approaching/overdue
- Missing documentation
- QA review pending
- Customer escalations
- Teams channel integration alerts

### 3.4 Adjuster Interface

#### 3.4.1 Task Management
- Personal claim dashboard
- Priority-based task queue
- Quick status updates
- Mobile-responsive design
- Offline capability for field work

#### 3.4.2 Documentation Tools
- Voice-to-text note taking
- Photo upload with geolocation
- Document templates
- Signature capture
- Report generation

### 3.5 Quality Assurance System

#### 3.5.1 Review Workflows
- Manager review requirements
- Grammar and content checking
- Approval workflows
- Revision tracking
- Final approval process

#### 3.5.2 Teams Integration
- Automatic Teams channel notifications
- Document sharing for review
- 4-hour countdown timers for responses
- Thread-based communication tracking

---

## 4. Database Schema Design

### 4.1 Core Tables

#### Claims Table
```sql
claims (
  id: uuid PRIMARY KEY,
  claim_number: varchar UNIQUE,
  xact_analysis_id: varchar,
  date_entered_queue: timestamptz,
  date_of_loss: date,
  policyholder_name: varchar,
  policyholder_phone: varchar,
  policyholder_email: varchar,
  property_address: text,
  city: varchar,
  county: varchar,
  zip_code: varchar,
  state: varchar,
  claim_amount: decimal,
  assigned_adjuster_id: uuid REFERENCES adjusters(id),
  status: claim_status_enum,
  customer_contacted_at: timestamptz,
  site_inspected_at: timestamptz,
  estimate_returned_at: timestamptz,
  correction_returned_at: timestamptz,
  qa_approved_at: timestamptz,
  reviewed_at: timestamptz,
  created_at: timestamptz DEFAULT now(),
  updated_at: timestamptz DEFAULT now()
)
```

#### Workflow Responses Table
```sql
workflow_responses (
  id: uuid PRIMARY KEY,
  claim_id: uuid REFERENCES claims(id),
  question_id: varchar,
  question_text: text,
  response_value: text,
  parent_question_id: varchar,
  hierarchy_level: integer,
  section_name: varchar,
  responded_by: uuid REFERENCES users(id),
  responded_at: timestamptz DEFAULT now()
)
```

#### KPI Tracking Table
```sql
kpi_events (
  id: uuid PRIMARY KEY,
  claim_id: uuid REFERENCES claims(id),
  event_type: varchar,
  status: kpi_status_enum, -- green, yellow, red
  target_time: timestamptz,
  actual_time: timestamptz,
  duration_hours: integer,
  is_compliant: boolean,
  notes: text,
  created_at: timestamptz DEFAULT now()
)
```

#### Question Hierarchy Table
```sql
questions (
  id: varchar PRIMARY KEY,
  question_text: text,
  question_type: question_type_enum,
  parent_question_id: varchar REFERENCES questions(id),
  hierarchy_level: integer,
  section_name: varchar,
  display_order: integer,
  conditional_logic: jsonb,
  validation_rules: jsonb,
  color_code: varchar,
  is_required: boolean,
  dropdown_options: text[]
)
```

### 4.2 User Management
```sql
users (
  id: uuid PRIMARY KEY,
  email: varchar UNIQUE,
  role: user_role_enum, -- manager, adjuster, dispatcher
  first_name: varchar,
  last_name: varchar,
  phone: varchar,
  created_at: timestamptz DEFAULT now()
)

adjusters (
  id: uuid PRIMARY KEY REFERENCES users(id),
  license_number: varchar,
  specialties: text[],
  current_workload: integer DEFAULT 0,
  max_workload: integer DEFAULT 20,
  is_active: boolean DEFAULT true
)
```

---

## 5. User Interface Design

### 5.1 Design System
- Modern, clean interface following insurance industry standards
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)
- Color-coded status indicators
- Intuitive navigation patterns

### 5.2 Key UI Components

#### Dashboard Cards
- KPI status indicators with color coding
- Quick action buttons
- Real-time data updates
- Drill-down capabilities

#### Dynamic Forms
- Progressive field revelation
- Contextual help tooltips
- Auto-save indicators
- Validation feedback
- Mobile-optimized input controls

#### Claims Map
- Interactive geographic visualization
- Filtering and search capabilities
- Adjuster location tracking
- Cluster management for high-density areas

---

## 6. Security & Compliance

### 6.1 Data Security
- End-to-end encryption for sensitive data
- Row Level Security (RLS) in Supabase
- Role-based access control
- Audit logging for all actions
- Regular security assessments

### 6.2 Compliance Requirements
- HIPAA compliance for personal information
- Insurance industry regulations
- Data retention policies
- Privacy controls
- Backup and disaster recovery

---

## 7. Performance Requirements

### 7.1 System Performance
- Page load times < 2 seconds
- Real-time updates within 500ms
- Support for 500+ concurrent users
- 99.9% uptime SLA
- Scalable architecture for growth

### 7.2 Data Processing
- Webhook processing within 1 second
- Database queries optimized for <100ms
- Efficient file upload handling
- Background job processing for heavy operations

---

## 8. Integration Requirements

### 8.1 XactAnalysis API
- Webhook endpoint security
- API rate limiting
- Error handling and retry logic
- Data validation and sanitization
- Event deduplication

### 8.2 Microsoft Teams
- Automatic notification posting
- Document sharing integration
- Thread tracking
- User mention capabilities
- File upload to channels

### 8.3 Email System
- Automated email notifications
- Template management
- Delivery tracking
- Reply handling

---

## 9. Development Phases

### Phase 1: Core Foundation (8 weeks)
- Basic Next.js application setup
- Supabase database schema implementation
- User authentication and authorization
- Basic claims CRUD operations
- XactAnalysis webhook integration

### Phase 2: Workflow Engine (6 weeks)
- Dynamic form system development
- Question hierarchy implementation
- Conditional logic engine
- Basic manager dashboard
- KPI tracking foundation

### Phase 3: Advanced Features (8 weeks)
- Complete manager dashboard with KPIs
- Advanced workflow features
- Teams integration
- Mobile optimization
- Performance optimization

### Phase 4: Polish & Launch (4 weeks)
- UI/UX refinements
- Testing and QA
- Documentation
- Training materials
- Production deployment

---

## 10. Success Criteria

### 10.1 Technical Success
- All webhook events processed successfully
- 24-hour compliance tracking operational
- Real-time KPI dashboard functional
- Mobile-responsive interface
- Production-ready security implementation

### 10.2 Business Success
- Improved first contact compliance rates
- Reduced claim processing times
- Enhanced manager visibility
- Positive user feedback
- Successful adjuster adoption

---

## 11. Risk Assessment

### 11.1 Technical Risks
- XactAnalysis API changes
- Data migration complexity
- Real-time performance challenges
- Mobile browser compatibility

### 11.2 Mitigation Strategies
- Comprehensive API documentation
- Staged migration approach
- Performance monitoring
- Cross-browser testing
- Backup integration methods

---

## 12. Future Enhancements

### 12.1 Advanced Analytics
- Predictive analytics for claim outcomes
- Performance trend analysis
- Customer satisfaction insights
- Automated reporting

### 12.2 AI Integration
- Automated document analysis
- Smart form completion
- Predictive text for notes
- Fraud detection algorithms

### 12.3 Mobile App
- Native mobile application
- Offline synchronization
- GPS tracking for adjusters
- Voice command integration

---

This PRD provides a comprehensive roadmap for building a world-class insurance claims management platform that will revolutionize how Jimmie Giles Insurance Adjuster handles claims processing, ensuring compliance, efficiency, and superior customer service.