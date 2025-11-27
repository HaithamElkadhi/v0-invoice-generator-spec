export interface SpokenLanguage {
  language: string
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
}

export interface ClientProfile {
  lastDiploma: string
  diplomaYear: string
  fieldOfStudy: string
  notes: string
  spokenLanguages: SpokenLanguage[]
}

export interface StudyPreferences {
  entryLevel: string
  academicYear: string
  fieldsOfStudy: string
  specificInterests: string
  cityRegionTypes: string[]
  budgetIndication: string
  otherConstraints: string
}

export interface UniversityProposal {
  id: string
  universityName: string
  courseName: string
  courseLink: string
  tuitionFees: number
  applicationFees: number
  notes: string
}

export interface FinancialSummaryData {
  estimatedUniversityFees: string // Text input - allows "50 € per application" or "Varies by university"
  jeexpertUpfrontFee: number // Default 100
  jeexpertAdditionalFee: number // Default 200
  additionalFinancialNotes: string // Optional textarea
}

export interface TermsConditions {
  paymentCommitment: string
  nonRefundableFees: string
  personalDataDelegation: string
  additionalTerms: string
}

export interface SignatureSection {
  consultantName: string
  studentSignaturePlaceholder: string
}

export interface ProposalItalyData {
  proposalNumber: string
  studentId: string
  proposalDate: string
  validUntil: string
  studentName: string
  email: string
  phone: string
  nationality: string
  clientProfile: ClientProfile
  studyPreferences: StudyPreferences
  universityProposals: UniversityProposal[]
  financialSummary: FinancialSummaryData
  termsConditions: TermsConditions
  consultantName: string
}
