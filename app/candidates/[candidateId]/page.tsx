"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { CircularNav } from "@/components/circular-nav"
import { ArrowLeft, Mail, Phone, Calendar, MessageSquare, Plus, User, ClipboardList } from "lucide-react"
import { db } from "@/lib/db"
import type { Candidate, Note } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function CandidateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)

  useEffect(() => {
    loadCandidate()
  }, [params.candidateId])

  const loadCandidate = async () => {
    try {
      const candidateData = await db.candidates.get(params.candidateId as string)
      setCandidate(candidateData || null)
    } catch (error) {
      console.error("Failed to load candidate:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!candidate || !newNote.trim()) return

    setAddingNote(true)
    try {
      const note: Note = {
        id: `note-${Date.now()}`,
        content: newNote,
        mentions: [], // Could parse @mentions here
        authorId: "current-user",
        createdAt: new Date(),
      }

      const updatedCandidate = {
        ...candidate,
        notes: [...candidate.notes, note],
        updatedAt: new Date(),
        timeline: [
          ...candidate.timeline,
          {
            id: `timeline-${Date.now()}`,
            type: "note_added" as const,
            description: "Note added",
            createdAt: new Date(),
          },
        ],
      }

      await db.candidates.update(candidate.id, updatedCandidate)
      setCandidate(updatedCandidate)
      setNewNote("")
      toast({
        title: "Success",
        description: "Note added successfully",
      })
    } catch (error) {
      console.error("Failed to add note:", error)
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      })
    } finally {
      setAddingNote(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
          <p className="text-muted-foreground mb-4">The candidate you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/candidates")}>Back to Candidates</Button>
        </div>
      </div>
    )
  }

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const stageColors = {
    applied: "bg-blue-500",
    screening: "bg-yellow-500",
    interview: "bg-purple-500",
    assessment: "bg-orange-500",
    offer: "bg-green-500",
    hired: "bg-emerald-500",
    rejected: "bg-red-500",
  }

  return (
    <div className="min-h-screen bg-background">
      <CircularNav />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{candidate.name}</h1>
              <Badge variant="outline" className={`text-white border-0 ${stageColors[candidate.currentStage]}`}>
                {candidate.currentStage}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail size={16} />
                <span>{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center gap-1">
                  <Phone size={16} />
                  <span>{candidate.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.timeline.length === 0 ? (
                    <p className="text-muted-foreground">No timeline events yet.</p>
                  ) : (
                    candidate.timeline
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .map((event) => (
                        <div key={event.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-foreground">{event.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.createdAt.toLocaleDateString()} at {event.createdAt.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare size={20} />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Note */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note about this candidate... Use @mentions to reference team members"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddNote} disabled={!newNote.trim() || addingNote} size="sm">
                    <Plus size={16} className="mr-2" />
                    {addingNote ? "Adding..." : "Add Note"}
                  </Button>
                </div>

                {/* Notes List */}
                <div className="space-y-3">
                  {candidate.notes.length === 0 ? (
                    <p className="text-muted-foreground">No notes yet. Add the first note above.</p>
                  ) : (
                    candidate.notes
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .map((note) => (
                        <div key={note.id} className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-foreground mb-2">{note.content}</p>
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>By {note.authorId}</span>
                            <span>{note.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Candidate Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Applied</label>
                  <p className="text-foreground">{candidate.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-foreground">{candidate.updatedAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Stage</label>
                  <p className="text-foreground capitalize">{candidate.currentStage}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Job Applied For</label>
                  <p className="text-foreground">{candidate.jobId.replace("job-", "Job ")}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList size={20} />
                  Assessment Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.assessmentScores.length === 0 ? (
                  <p className="text-muted-foreground">No assessments completed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {candidate.assessmentScores.map((score) => (
                      <div key={score.assessmentId} className="flex justify-between items-center">
                        <span className="text-sm">{score.assessmentId}</span>
                        <Badge variant="outline">{score.score}%</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail size={16} className="mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ClipboardList size={16} className="mr-2" />
                  Assign Assessment
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar size={16} className="mr-2" />
                  Schedule Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
