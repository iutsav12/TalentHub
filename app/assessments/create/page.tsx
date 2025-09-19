"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, ArrowLeft } from "lucide-react"
import { AssessmentBuilder } from "@/components/assessments/assessment-builder"
import { db, seedDatabase } from "@/lib/db"
import type { Assessment, Job } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function CreateAssessmentPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [createdAssessment, setCreatedAssessment] = useState<Assessment | null>(null)
  const [showBuilder, setShowBuilder] = useState(true)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      await seedDatabase()
      const allJobs = await db.jobs.toArray()
      setJobs(allJobs)
    } catch (error) {
      console.error("Failed to load jobs:", error)
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAssessment = async (assessmentData: Partial<Assessment>) => {
    try {
      const newAssessment: Assessment = {
        id: `assessment-${Date.now()}`,
        title: assessmentData.title!,
        jobId: assessmentData.jobId!,
        sections: assessmentData.sections!,
        shareableLink: `${window.location.origin}/assessment/${Date.now()}`,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.assessments.add(newAssessment)
      setCreatedAssessment(newAssessment)
      setShowBuilder(false)

      toast({
        title: "Success",
        description: "Assessment created successfully!",
      })
    } catch (error) {
      console.error("Failed to save assessment:", error)
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = () => {
    if (createdAssessment) {
      navigator.clipboard.writeText(createdAssessment.shareableLink)
      toast({
        title: "Success",
        description: "Assessment link copied to clipboard!",
      })
    }
  }

  const handleOpenLink = () => {
    if (createdAssessment) {
      window.open(createdAssessment.shareableLink, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (createdAssessment && !showBuilder) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Assessments
          </Button>

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Assessment Created Successfully!</h1>
              <p className="text-muted-foreground">Your assessment is ready to be shared with candidates</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {createdAssessment.title}
                  <Badge variant="default">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Sections:</span>
                    <span className="ml-2 font-medium">{createdAssessment.sections.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="ml-2 font-medium">
                      {createdAssessment.sections.reduce((total, section) => total + section.questions.length, 0)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Shareable Link:</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
                      {createdAssessment.shareableLink}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCopyLink}>
                      <Copy size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleOpenLink}>
                      <ExternalLink size={16} />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Next Steps:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Share the link with candidates via email or job postings</li>
                    <li>• Monitor submissions from the assessments dashboard</li>
                    <li>• Review candidate responses and scores</li>
                    <li>• Use results to make informed hiring decisions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => setShowBuilder(true)} variant="outline">
                Edit Assessment
              </Button>
              <Button onClick={() => router.push("/assessments")}>Back to Dashboard</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Assessments
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Assessment</h1>
          <p className="text-muted-foreground">Build a comprehensive assessment for your candidates</p>
        </div>

        <AssessmentBuilder
          isOpen={showBuilder}
          onClose={() => router.back()}
          onSave={handleSaveAssessment}
          jobs={jobs}
          isFullPage={true}
        />
      </div>
    </div>
  )
}
