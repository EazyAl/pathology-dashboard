'use client'

import React, { useState, useCallback } from 'react'
import { MedicalCase } from '../types/medical'

export default function CaseSearch() {
  const [caseId, setCaseId] = useState('')
  const [caseData, setCaseData] = useState<MedicalCase | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchCase = useCallback(async () => {
    const trimmedCaseId = caseId.trim()
    
    if (!trimmedCaseId) {
      setError('Please enter a case ID')
      return
    }

    const caseIdNum = parseInt(trimmedCaseId, 10)
    if (isNaN(caseIdNum) || caseIdNum < 1 || caseIdNum > 100) {
      setError('Please enter a valid case ID between 1 and 100')
      return
    }

    setLoading(true)
    setError('')
    setCaseData(null)

    try {
      const response = await fetch(`/api/cases?caseId=${encodeURIComponent(trimmedCaseId)}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data: MedicalCase = await response.json()
      setCaseData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch case data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [caseId])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchCase()
    }
  }, [searchCase])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  return (
    <div className="case-search-container">
      <h1>Medical Pathology Case Dashboard</h1>
      
      <div className="search-section">
        <div className="search-input-group">
          <input
            type="number"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Case ID (1-100)"
            className="case-input"
            min="1"
            max="100"
            disabled={loading}
          />
          <button 
            onClick={searchCase} 
            disabled={loading || !caseId.trim()}
            className="search-button"
            type="button"
          >
            {loading ? 'Searching...' : 'Search Case'}
          </button>
        </div>
        
        {error && <div className="error-message" role="alert">{error}</div>}
      </div>

      {caseData && (
        <div className="case-details">
          <div className="case-header">
            <h2>Case #{caseData.caseId}</h2>
            <span className="case-date">{formatDate(caseData.date)}</span>
          </div>
          
          <div className="case-grid">
            <div className="case-card">
              <h3>Diagnosis</h3>
              <p className="diagnosis">{caseData.diagnosis}</p>
            </div>
            
            <div className="case-card">
              <h3>Tissue Information</h3>
              <p><strong>Type:</strong> {caseData.tissueType}</p>
              <p><strong>Specimen:</strong> {caseData.specimenType}</p>
              <p><strong>Grade:</strong> {caseData.grade}</p>
              <p><strong>Stage:</strong> {caseData.stage}</p>
            </div>
            
            <div className="case-card">
              <h3>Data Modalities</h3>
              <div className="tag-list">
                {caseData.dataModalities.map((modality, index) => (
                  <span key={`${modality}-${index}`} className="tag modality-tag">
                    {modality}
                  </span>
                ))}
              </div>
            </div>
            
            {caseData.molecularMarkers.length > 0 && (
              <div className="case-card">
                <h3>Molecular Markers</h3>
                <div className="tag-list">
                  {caseData.molecularMarkers.map((marker, index) => (
                    <span key={`${marker}-${index}`} className="tag marker-tag">
                      {marker}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="case-card full-width">
              <h3>Comments</h3>
              <p>{caseData.comments}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 