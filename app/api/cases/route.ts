import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { MedicalCase } from '../../types/medical'

// This is required for dynamic API routes
export const dynamic = 'force-dynamic'

// Cache the cases data to avoid reading file on every request
let cachedCases: MedicalCase[] | null = null

function loadCases(): MedicalCase[] {
  if (cachedCases) {
    return cachedCases
  }

  const filePath = path.join(process.cwd(), 'public', 'medical_pathology_cases.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  cachedCases = JSON.parse(fileContents) as MedicalCase[]
  return cachedCases
}

export async function GET(request: NextRequest) {
  try {
    const cases = loadCases()
    const { searchParams } = new URL(request.url)
    const caseId = searchParams.get('caseId')

    // If caseId is provided, validate and find the specific case
    if (caseId) {
      const caseIdNum = parseInt(caseId, 10)
      
      // Validate caseId is a valid number
      if (isNaN(caseIdNum) || caseIdNum < 1) {
        return NextResponse.json(
          { error: 'Invalid case ID. Please provide a valid positive number.' }, 
          { status: 400 }
        )
      }

      const foundCase = cases.find(c => c.caseId === caseIdNum)
      
      if (foundCase) {
        return NextResponse.json(foundCase)
      } else {
        return NextResponse.json(
          { error: `Case ${caseIdNum} not found` }, 
          { status: 404 }
        )
      }
    }

    // Return all cases if no caseId specified
    return NextResponse.json(cases)
  } catch (error) {
    console.error('Error loading medical cases:', error)
    return NextResponse.json(
      { error: 'Internal server error while loading cases' }, 
      { status: 500 }
    )
  }
} 