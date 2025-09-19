"use client"

import { useEffect, useState, useMemo } from "react"
import { Search, Filter, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CircularNav } from "@/components/circular-nav"
import { CandidatesList } from "@/components/candidates/candidates-list"
import { CandidatesKanban } from "@/components/candidates/candidates-kanban"
import { db, seedDatabase } from "@/lib/db"
import type { Candidate, CandidateStage } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState<CandidateStage | "all">("all")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    try {
      await seedDatabase()
      const allCandidates = await db.candidates.orderBy("createdAt").reverse().toArray()
      setCandidates(allCandidates)
    } catch (error) {
      console.error("Failed to load candidates:", error)
      toast({
        title: "Error",
        description: "Failed to load candidates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCandidates = useMemo(() => {
    let filtered = candidates

    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter((candidate) => candidate.currentStage === stageFilter)
    }

    return filtered
  }, [candidates, searchTerm, stageFilter])

  const handleStageChange = async (candidateId: string, newStage: CandidateStage) => {
    try {
      const candidate = candidates.find((c) => c.id === candidateId)
      if (!candidate) return

      const updatedCandidate = {
        ...candidate,
        currentStage: newStage,
        updatedAt: new Date(),
        timeline: [
          ...candidate.timeline,
          {
            id: `timeline-${Date.now()}`,
            type: "stage_change" as const,
            description: `Stage changed from ${candidate.currentStage} to ${newStage}`,
            createdAt: new Date(),
          },
        ],
      }

      await db.candidates.update(candidateId, updatedCandidate)
      setCandidates((prev) => prev.map((c) => (c.id === candidateId ? updatedCandidate : c)))

      toast({
        title: "Success",
        description: `Candidate moved to ${newStage}`,
      })
    } catch (error) {
      console.error("Failed to update candidate stage:", error)
      toast({
        title: "Error",
        description: "Failed to update candidate stage",
        variant: "destructive",
      })
    }
  }

  const stageStats = useMemo(() => {
    const stats = candidates.reduce(
      (acc, candidate) => {
        acc[candidate.currentStage] = (acc[candidate.currentStage] || 0) + 1
        return acc
      },
      {} as Record<CandidateStage, number>,
    )
    return stats
  }, [candidates])

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
            <h1 className="text-4xl font-bold mb-2">Candidates</h1>
            <p className="text-muted-foreground">Track and manage candidate applications</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List size={16} className="mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
            >
              <LayoutGrid size={16} className="mr-2" />
              Kanban
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search candidates by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={stageFilter} onValueChange={(value: any) => setStageFilter(value)}>
            <SelectTrigger className="w-full md:w-48">
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-primary">{candidates.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-500">{stageStats.applied || 0}</div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-500">{stageStats.screening || 0}</div>
            <div className="text-sm text-muted-foreground">Screening</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-500">{stageStats.interview || 0}</div>
            <div className="text-sm text-muted-foreground">Interview</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-500">{stageStats.assessment || 0}</div>
            <div className="text-sm text-muted-foreground">Assessment</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-500">{stageStats.offer || 0}</div>
            <div className="text-sm text-muted-foreground">Offer</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-emerald-500">{stageStats.hired || 0}</div>
            <div className="text-sm text-muted-foreground">Hired</div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <CandidatesList candidates={filteredCandidates} onStageChange={handleStageChange} />
        ) : (
          <CandidatesKanban candidates={filteredCandidates} onStageChange={handleStageChange} />
        )}

        {/* Empty State */}
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">No candidates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || stageFilter !== "all"
                ? "Try adjusting your filters"
                : "Candidates will appear here once they apply to your jobs"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
