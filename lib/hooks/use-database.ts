"use client"

import { useState, useEffect } from "react"
import { DatabaseService, restoreApplicationState } from "@/lib/db"
import type { Job, Candidate, Assessment } from "@/lib/types"

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    jobCount: 0,
    candidateCount: 0,
    assessmentCount: 0,
  })

  useEffect(() => {
    initializeDatabase()
  }, [])

  const initializeDatabase = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const restoredStats = await restoreApplicationState()
      setStats(restoredStats)
      setIsInitialized(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize database")
      console.error("Database initialization error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const retryOperation = async <T,>(operation: () => Promise<T>, maxRetries = 3): Promise<T> => {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error")
        console.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, lastError.message)

        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }

    throw lastError
  }

  return {
    isInitialized,
    isLoading,
    error,
    stats,
    DatabaseService,
    retryOperation,
    reinitialize: initializeDatabase,
  }
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { DatabaseService, retryOperation } = useDatabase()

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await retryOperation(() => DatabaseService.getAllJobs())
      setJobs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  const createJob = async (job: Job) => {
    try {
      await retryOperation(() => DatabaseService.createJob(job))
      setJobs((prev) => [...prev, job])
    } catch (err) {
      throw err
    }
  }

  const updateJob = async (id: string, updates: Partial<Job>) => {
    try {
      await retryOperation(() => DatabaseService.updateJob(id, updates))
      setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...updates } : job)))
    } catch (err) {
      throw err
    }
  }

  const deleteJob = async (id: string) => {
    try {
      await retryOperation(() => DatabaseService.deleteJob(id))
      setJobs((prev) => prev.filter((job) => job.id !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  return {
    jobs,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    refetch: loadJobs,
  }
}

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { DatabaseService, retryOperation } = useDatabase()

  const loadCandidates = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await retryOperation(() => DatabaseService.getAllCandidates())
      setCandidates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidates")
    } finally {
      setLoading(false)
    }
  }

  const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
    try {
      await retryOperation(() => DatabaseService.updateCandidate(id, updates))
      setCandidates((prev) => prev.map((candidate) => (candidate.id === id ? { ...candidate, ...updates } : candidate)))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [])

  return {
    candidates,
    loading,
    error,
    updateCandidate,
    refetch: loadCandidates,
  }
}

export function useAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { DatabaseService, retryOperation } = useDatabase()

  const loadAssessments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await retryOperation(() => DatabaseService.getAllAssessments())
      setAssessments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assessments")
    } finally {
      setLoading(false)
    }
  }

  const createAssessment = async (assessment: Assessment) => {
    try {
      await retryOperation(() => DatabaseService.createAssessment(assessment))
      setAssessments((prev) => [assessment, ...prev])
    } catch (err) {
      throw err
    }
  }

  const updateAssessment = async (id: string, updates: Partial<Assessment>) => {
    try {
      await retryOperation(() => DatabaseService.updateAssessment(id, updates))
      setAssessments((prev) =>
        prev.map((assessment) => (assessment.id === id ? { ...assessment, ...updates } : assessment)),
      )
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    loadAssessments()
  }, [])

  return {
    assessments,
    loading,
    error,
    createAssessment,
    updateAssessment,
    refetch: loadAssessments,
  }
}
