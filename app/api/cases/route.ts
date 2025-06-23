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

    if (caseId) {
      const searchStr = caseId.trim()
      if (!/^[0-9]+$/.test(searchStr)) {
        return NextResponse.json(
          { error: 'Invalid case ID. Please enter a number.' },
          { status: 400 }
        )
      }
      // Return all cases whose caseId starts with the search string
      const matchingCases = cases.filter(c => c.caseId.toString().startsWith(searchStr))
      if (matchingCases.length === 0) {
        return NextResponse.json(
          { error: `No cases found starting with ${searchStr}` },
          { status: 404 }
        )
      }
      return NextResponse.json(matchingCases)
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