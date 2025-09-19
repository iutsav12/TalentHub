"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, Eye, Share, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircularNav } from "@/components/circular-nav"
import { AssessmentBuilder } from "@/components/assessments/assessment-builder"
import { AssessmentPreview } from "@/components/assessments/assessment-preview"
import { db, seedDatabase } from "@/lib/db"
import type { Assessment, Job } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [jobFilter, setJobFilter] = useState<string>("all")
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)
  const [previewAssessment, setPreviewAssessment] = useState<Assessment | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      await seedDatabase()
      const [allAssessments, allJobs] = await Promise.all([
        db.assessments.orderBy("createdAt").reverse().toArray(),
        db.jobs.toArray(),
      ])
      setAssessments(allAssessments)
      setJobs(allJobs)
    } catch (error) {
      console.error("Failed to load data:", error)
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesJob = jobFilter === "all" || assessment.jobId === jobFilter
    return matchesSearch && matchesJob
  })

  const handleCreateAssessment = () => {
    setEditingAssessment(null)
    const newWindow = window.open("/assessments/create", "_blank")
    if (newWindow) {
      newWindow.focus()
    }
  }

  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment)
    setIsBuilderOpen(true)
  }

  const handlePreviewAssessment = (assessment: Assessment) => {
    setPreviewAssessment(assessment)
    setIsPreviewOpen(true)
  }

  const handleSaveAssessment = async (assessmentData: Partial<Assessment>) => {
    try {
      if (editingAssessment) {
        const updatedAssessment = { ...editingAssessment, ...assessmentData, updatedAt: new Date() }
        await db.assessments.update(editingAssessment.id, updatedAssessment)
        setAssessments((prev) => prev.map((a) => (a.id === editingAssessment.id ? updatedAssessment : a)))
        toast({
          title: "Success",
          description: "Assessment updated successfully",
        })
      } else {
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
        setAssessments((prev) => [newAssessment, ...prev])
        toast({
          title: "Success",
          description: "Assessment created successfully",
        })
      }
      setIsBuilderOpen(false)
    } catch (error) {
      console.error("Failed to save assessment:", error)
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      })
    }
  }

  const handleShareAssessment = (assessment: Assessment) => {
    navigator.clipboard.writeText(assessment.shareableLink)
    toast({
      title: "Success",
      description: "Assessment link copied to clipboard",
    })
  }

  const getJobTitle = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId)
    return job?.title || "Unknown Job"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CircularNav />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Assessments</h1>
            <p className="text-muted-foreground">Create and manage candidate assessments</p>
          </div>
          <Button onClick={handleCreateAssessment} className="flex items-center gap-2">
            <Plus size={20} />
            Create Assessment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-primary">{assessments.filter((a) => a.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">
              {assessments.filter((a) => !a.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">Inactive</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-accent">{assessments.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-chart-2">{filteredAssessments.length}</div>
            <div className="text-sm text-muted-foreground">Filtered</div>
          </div>
        </div>

        {/* Assessments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{assessment.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">{getJobTitle(assessment.jobId)}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={assessment.isActive ? "default" : "secondary"}>
                        {assessment.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{assessment.sections.length} sections</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>Created {assessment.createdAt.toLocaleDateString()}</span>
                  <span>
                    {assessment.sections.reduce((total, section) => total + section.questions.length, 0)} questions
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditAssessment(assessment)}>
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePreviewAssessment(assessment)}>
                    <Eye size={14} className="mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShareAssessment(assessment)}>
                    <Share size={14} className="mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No assessments found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || jobFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first assessment to get started"}
            </p>
            {!searchTerm && jobFilter === "all" && (
              <Button onClick={handleCreateAssessment}>Create Your First Assessment</Button>
            )}
          </div>
        )}
      </div>

      {/* Assessment Builder Modal */}
      <AssessmentBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSave={handleSaveAssessment}
        assessment={editingAssessment}
        jobs={jobs}
      />

      {/* Assessment Preview Modal */}
      <AssessmentPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        assessment={previewAssessment}
      />
    </div>
  )
}
