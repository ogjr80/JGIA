
// Complete TypeScript types for GILES Question System with All Dropdowns

export interface DropdownData {
  raw_value: string;
  parsed_options: string[];
  option_count: number;
}

export interface ConditionalLogic {
  parentId: string;
  triggerCondition: string;
  level: number;
  parent_text: string;
  question_text: string;
}

export interface Question {
  id: string;
  text: string;
  level: number;
  colorCode: string;
  isConditional: boolean;
  parentQuestionId?: string;
  answerType: string;
  dropdownData: Record<string, DropdownData>;
  conditionalLogic?: ConditionalLogic;
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

export interface QuestionAnswer {
  questionId: string;
  answer: string;
  timestamp: Date;
  dropdownColumn?: string; // Which dropdown column was used
}

export interface QuestionState {
  currentGroup: string;
  answeredQuestions: Record<string, QuestionAnswer>;
  visibleQuestions: string[];
}

// Utility types for dropdown handling
export type DropdownColumn = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export interface DropdownOption {
  value: string;
  label: string;
  column: DropdownColumn;
}

export interface QuestionWithDropdowns extends Question {
  getDropdownOptions: (column: DropdownColumn) => string[];
  getPrimaryDropdown: () => DropdownData | null;
  getAllDropdowns: () => Record<DropdownColumn, DropdownData>;
}
