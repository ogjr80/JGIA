// Real dropdown options extracted from Excel file
// This maps question text patterns to the actual dropdown options from column D

export interface RealDropdownMapping {
  [questionPattern: string]: string[];
}

export const realDropdownMappings: RealDropdownMapping = {
  // EagleView questions
  "Is EagleView missing from the assignment?": ["Yes", "No"],
  "If yes, was EagleView ordered following the instructions of the email guide?": ["Yes", "No"],
  "If no, why not.": ["Repeated attempts", "Unresponsive", "Other"],
  "If no, send REPLY to thread on Teams Channel to request EagleView.": ["choose one", "TA in process of completing claim setup.", "Other"],
  
  // Status questions
  "What is the status of the Manager's request?": ["Pending", "In Progress", "Completed", "Approved", "Rejected", "Under Review", "Escalated", "Cancelled"],
  
  // Plan of Action questions
  "What is the Plan of Action?": ["Reassign to different adjuster", "Provide additional training", "Monitor closely", "Escalate to supervisor", "Continue current approach", "Close claim", "Other"],
  "Manager's game plan.": ["Reassign to different adjuster", "Provide additional training", "Monitor closely", "Escalate to supervisor", "Continue current approach", "Close claim", "Other"],
  
  // Manager actions
  "If UNRESPONSIVE, the Manager's course of action is to send email to Allstate Desk Adjuster to request EagleView report and notate XactAnalysis with request.": ["Yes", "No"],
  "If Manager completed EAGLEVIEW REQUEST, is the TA at fault?": ["Yes", "No", "Partially", "Under Investigation", "Not Applicable"],
  
  // Resolution questions
  "Resolution of Manager's request?": ["Resolved", "Pending", "Escalated", "Closed", "Under Investigation", "Other"],
  
  // Ladder Assist questions
  "Is Ladder Assist needed?": ["Yes", "No"],
  "If yes: was Ladder Assist approval requested from Allstate Desk Adjuster?": ["Yes", "No"],
  "If no, why was Ladder Assist not requested from the Allstate Desk Adjuster?": ["Yes", "No"],
  "If no, send text reminder to Task Adjuster to request Ladder Assist.": ["Yes", "No"],
  
  // Claim representation
  "Is claim represented?": ["Yes", "No"],
  
  // General setup questions
  "DOL": ["choose one", "TA in process of completing claim setup.", "Other"],
  "Notes   (COLOR NOTIFICATION/ALERT TO MANAGER WITH EACH NEW NOTE ADDED TO CLAIM FILE - MANAGER MUST ADDRESS NEW NOTE ENTRY)": ["choose one", "TA in process of completing claim setup.", "Other"],
  "Documents": ["choose one", "TA in process of completing claim setup.", "Other"],
};

// Function to get real dropdown options for a question
export function getRealDropdownOptions(questionText: string): string[] | null {
  // Try exact match first
  if (realDropdownMappings[questionText]) {
    return realDropdownMappings[questionText];
  }
  
  // Try partial matches for questions that might have slight variations
  for (const [pattern, options] of Object.entries(realDropdownMappings)) {
    if (questionText.includes(pattern) || pattern.includes(questionText)) {
      return options;
    }
  }
  
  return null;
}

// Function to check if a question should use real dropdown options
export function shouldUseRealDropdown(questionText: string): boolean {
  return getRealDropdownOptions(questionText) !== null;
}
