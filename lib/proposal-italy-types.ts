export interface AcademicRecord {
  diploma: string
  score: string
  maxScore: string
}

export interface LanguageRecord {
  language: string
  level: string
  certificate: string
}

export interface StudentProfile {
  currentStatus: string
  academicLevel: string
  obtainedDiploma: string[]
  academicRecords: AcademicRecord[]
  fieldOfPreviousStudies: string
  yearOfGraduation: string
  currentOccupation: string
  languages: string[]
  languageRecords: LanguageRecord[]
  note: string
}

export interface StudyPreferences {
  targetDegreeLevel: string
  intendedIntake: string
  fieldOfStudyPrimary: string
  alternativeField: string
  programLanguages: string[]
  financingPlan: string
  blockedAccount: string
  hasAbroadSupport: string
  abroadSupportDetails: string
  financialGuarantor: string
  applicationFeesPreference: string
  projectBudget: string
  cityPreferenceType: string
  preferredCityUniversity: string
}

export interface Services {
  selected: string[]
  note: string
}

export interface ProposalItalyData {
  proposalDate: string
  validUntil: string
  studentName: string
  email: string
  phone: string
  nationality: string
  studentProfile: StudentProfile
  studyPreferences: StudyPreferences
  services: Services
}
