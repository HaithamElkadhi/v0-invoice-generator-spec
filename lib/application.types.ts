export type AppStatus = "Submitted" | "Admitted" | "Rejected" | "Proposal"

export type AppLanguage = "EN" | "IT"

export type DegreeLevel = "Laurea Magistrale" | "Laurea Triennale" | "Other"

export interface ApplicationRecord {
  id: string
  university: string
  /** Lookup from Airtable "Full Name" — used for unique student counts */
  fullName: string | null
  studentName: string
  course: string
  language: AppLanguage | null
  degreeLevel: DegreeLevel | null
  status: AppStatus
  dateOfCandidacy: string | null
  comment: string | null
}

export interface StudentStats {
  name: string
  submitted: number
  admitted: number
  rejected: number
  proposal: number
  total: number
}

export interface UniversityStats {
  name: string
  total: number
  submitted: number
  admitted: number
  rejected: number
  proposal: number
}

export interface ApplicationGlobalStats {
  total: number
  studentsInProcess: number
  submitted: number
  admitted: number
  rejected: number
  proposal: number
  admissionRate: number
  rejectionRate: number
  submittedRate: number
}
