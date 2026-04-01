export interface StudentProfile {
  currentStatus: string
  highestDegreeObtained: string
  fieldOfPreviousStudies: string
  yearOfGraduation: string
  currentOccupation: string
  englishLevel: string
  englishCertificate: string
  otherLanguages: string[]
  note: string
}

export interface StudyPreferences {
  country: string
  targetDegreeLevel: string
  intendedIntake: string
  fieldOfStudyPrimary: string
  alternativeField: string
  specificDetailsFieldOfStudy: string
  englishTaughtOnly: string
  scholarshipDependent: string
  canPayApplicationFees: string
  scholarshipStrategy: string[]
  cityPreferenceType: string
  preferredCityUniversity: string
}

export interface Services {
  selected: string[]
  note: string
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
  studentProfile: StudentProfile
  studyPreferences: StudyPreferences
  services: Services
}
