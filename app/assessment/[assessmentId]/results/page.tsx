"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, Mail } from "lucide-react"
import { db } from "@/lib/db"
import type { Assessment, AssessmentSubmission } from "@/lib/types"

export default function AssessmentResultsPage() {
  const params = useParams()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [params.assessmentId])

  const loadResults = async () => {
    try {
      const assessmentData = await db.assessments.get(params.assessmentId as string)
      if (assessmentData) {
        setAssessment(assessmentData)
        // Load submissions (would be from a separate table in real implementation)
        const mockSubmissions: AssessmentSubmission[] = []
        setSubmissions(mockSubmissions)
      }
    } catch (error) {
      console.error("Failed to load results:", error)
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
          <h1 className="text-2xl font-bold mb-2">Assessment Not Found</h1>
          <p className="text-muted-foreground">The assessment you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{assessment.title} - Results</h1>
          <p className="text-muted-foreground">View and analyze candidate submissions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.length > 0
                  ? Math.round(submissions.reduce((sum, s) => sum + s.score.percentage, 0) / submissions.length)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.length > 0 ? Math.max(...submissions.map((s) => s.score.percentage)) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Candidate Submissions</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Export Results
                </Button>
                <Button variant="outline" size="sm">
                  <Mail size={16} className="mr-2" />
                  Email Results
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">No Submissions Yet</h3>
                <p className="text-muted-foreground">
                  Candidate responses will appear here once they complete the assessment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{submission.candidateName}</h4>
                        <p className="text-sm text-muted-foreground">{submission.candidateEmail}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={submission.score.percentage >= 70 ? "default" : "secondary"}>
                          {submission.score.percentage}%
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {submission.submittedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Progress value={submission.score.percentage} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {submission.score.score}/{submission.score.maxScore} points
                      </span>
                      <span>Completed in {Math.round(Math.random() * 45 + 15)} minutes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
