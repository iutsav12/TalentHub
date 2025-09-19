"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AssessmentPreview } from "@/components/assessments/assessment-preview"
import { db } from "@/lib/db"
import type { Assessment } from "@/lib/types"

export default function PublicAssessmentPage() {
  const params = useParams()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssessment()
  }, [params.assessmentId])

  const loadAssessment = async () => {
    try {
      // In a real app, this would be a public API endpoint
      const assessmentData = await db.assessments.get(params.assessmentId as string)
      setAssessment(assessmentData || null)
    } catch (error) {
      console.error("Failed to load assessment:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Assessment Not Found</h1>
          <p className="text-muted-foreground">The assessment you're looking for doesn't exist or has been disabled.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <AssessmentPreview assessment={assessment} isEmbedded />
      </div>
    </div>
  )
}
