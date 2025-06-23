export interface MedicalCase {
  caseId: number
  date: string
  diagnosis: string
  comments: string
  dataModalities: string[]
  tissueType: string
  specimenType: string
  grade: number
  stage: string
  molecularMarkers: string[]
} 