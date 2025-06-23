'use client'

import React, { useState, useCallback, useRef } from 'react'
import { MedicalCase } from '../types/medical'

export default function CaseSearch() {
  const [caseId, setCaseId] = useState('')
  const [results, setResults] = useState<MedicalCase[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const previousResults = useRef<MedicalCase[] | null>(null)

  const searchCase = useCallback(async () => {
    const trimmedCaseId = caseId.trim()
    if (!trimmedCaseId) {
      setError('Please enter a case ID')
      return
    }
    if (!/^[0-9]+$/.test(trimmedCaseId)) {
      setError('Please enter a valid number')
      return
    }
    setLoading(true)
    setError('')
    setResults(null)
    try {
      const response = await fetch(`/api/cases?caseId=${encodeURIComponent(trimmedCaseId)}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      const data: MedicalCase[] = await response.json()
      setResults(data)
      previousResults.current = data
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

  // Handle card click (mouse or keyboard)
  const handleCardClick = (c: MedicalCase) => {
    previousResults.current = results
    setResults([c])
  }
  const handleCardKeyDown = (e: React.KeyboardEvent, c: MedicalCase) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      previousResults.current = results
      setResults([c])
    }
  }

  // Back button handler
  const handleBack = () => {
    if (previousResults.current) {
      setResults(previousResults.current)
    }
  }

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
            placeholder="Enter Case ID (e.g. 9, 10, 99)"
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

      {/* Results Section */}
      {results && results.length > 1 && (
        <div className="case-list-grid">
          {results.map((c) => (
            <div
              className="case-list-card clickable"
              key={c.caseId}
              tabIndex={0}
              role="button"
              aria-label={`View details for case ${c.caseId}`}
              onClick={() => handleCardClick(c)}
              onKeyDown={(e) => handleCardKeyDown(e, c)}
            >
              <div className="case-list-header">
                <span className="case-list-id">#{c.caseId}</span>
                <span className="case-list-date">{formatDate(c.date)}</span>
              </div>
              <div className="case-list-diagnosis">{c.diagnosis}</div>
              <div className="case-list-tags">
                {c.dataModalities.map((modality, i) => (
                  <span key={modality + i} className="tag modality-tag">{modality}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single Result Section */}
      {results && results.length === 1 && (
        <div className="case-details">
          <button className="back-btn" onClick={handleBack} aria-label="Back to results">
            <span className="back-arrow">←</span> Back to results
          </button>
          <div className="case-header">
            <h2>Case #{results[0].caseId}</h2>
            <span className="case-date">{formatDate(results[0].date)}</span>
          </div>
          <div className="case-grid">
            <div className="case-card">
              <h3>Diagnosis</h3>
              <p className="diagnosis">{results[0].diagnosis}</p>
            </div>
            <div className="case-card">
              <h3>Tissue Information</h3>
              <p><strong>Type:</strong> {results[0].tissueType}</p>
              <p><strong>Specimen:</strong> {results[0].specimenType}</p>
              <p><strong>Grade:</strong> {results[0].grade}</p>
              <p><strong>Stage:</strong> {results[0].stage}</p>
            </div>
            <div className="case-card">
              <h3>Data Modalities</h3>
              <div className="tag-list">
                {results[0].dataModalities.map((modality, index) => (
                  <span key={modality + index} className="tag modality-tag">{modality}</span>
                ))}
              </div>
            </div>
            {results[0].molecularMarkers.length > 0 && (
              <div className="case-card">
                <h3>Molecular Markers</h3>
                <div className="tag-list">
                  {results[0].molecularMarkers.map((marker, index) => (
                    <span key={marker + index} className="tag marker-tag">{marker}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="case-card full-width">
              <h3>Comments</h3>
              <p>{results[0].comments}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 