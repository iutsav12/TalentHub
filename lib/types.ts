export interface Job {
  id: string
  title: string
  slug: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  status: "active" | "archived"
  tags: string[]
  createdAt: Date
  updatedAt: Date
  order: number
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  resume?: string
  currentStage: CandidateStage
  jobId: string
  notes: Note[]
  assessmentScores: AssessmentScore[]
  createdAt: Date
  updatedAt: Date
  timeline: TimelineEvent[]
}

export type CandidateStage = "applied" | "screening" | "interview" | "assessment" | "offer" | "hired" | "rejected"

export interface Note {
  id: string
  content: string
  mentions: string[]
  authorId: string
  createdAt: Date
}

export interface TimelineEvent {
  id: string
  type: "stage_change" | "note_added" | "assessment_completed"
  description: string
  createdAt: Date
  metadata?: Record<string, any>
}

export interface Assessment {
  id: string
  title: string
  jobId: string
  sections: AssessmentSection[]
  shareableLink: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AssessmentSection {
  id: string
  title: string
  questions: Question[]
  order: number
}

export interface Question {
  id: string
  type: "single-choice" | "multi-choice" | "short-text" | "long-text" | "numeric" | "file-upload"
  question: string
  required: boolean
  options?: string[]
  correctAnswers?: string[] | string | number // For choice questions: array of correct option indices/values, for text/numeric: expected answer
  points?: number // Points awarded for correct answer
  validation?: ValidationRule
  conditionalLogic?: ConditionalRule
  order: number
}

export interface ValidationRule {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
}

export interface ConditionalRule {
  dependsOn: string
  condition: "equals" | "not_equals" | "contains"
  value: string
}

export interface AssessmentScore {
  assessmentId: string
  candidateId: string
  responses: AssessmentResponse[]
  score: number
  maxScore: number
  percentage: number
  sectionScores: SectionScore[]
  completedAt: Date
}

export interface AssessmentResponse {
  questionId: string
  answer: string | string[] | number | File
  isCorrect?: boolean
  pointsEarned?: number
  maxPoints?: number
}

export interface SectionScore {
  sectionId: string
  score: number
  maxScore: number
  percentage: number
}

export interface AssessmentSubmission {
  id: string
  assessmentId: string
  candidateEmail: string
  candidateName: string
  responses: AssessmentResponse[]
  score: AssessmentScore
  submittedAt: Date
  ipAddress?: string
}
