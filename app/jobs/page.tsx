"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CircularNav } from "@/components/circular-nav"
import { JobCard } from "@/components/jobs/job-card"
import { JobModal } from "@/components/jobs/job-modal"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { db, seedDatabase } from "@/lib/db"
import type { Job } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 10

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  //seeds db and loads all jobs from db.jobs
  useEffect(() => {
    setTimeout(() => {
      loadJobs();
    }, 500);
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, statusFilter])

  const loadJobs = async () => {//it is a async function returning promise, it is fetching the jobs from the and put them into rect state
    try {
      await seedDatabase()
      const allJobs = await db.jobs.orderBy("order").toArray()
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

  const filterJobs = () => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter)
    }

    // Ensure filtered list is sorted by order
    filtered = filtered.slice().sort((a, b) => a.order - b.order)

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }

  const handleCreateJob = () => {
    setEditingJob(null)
    setIsModalOpen(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setIsModalOpen(true)
  }

  const handleSaveJob = async (jobData: Partial<Job>) => {
    try {
      if (editingJob) {
        // Update existing job
        const updatedJob = { ...editingJob, ...jobData, updatedAt: new Date() }
        await db.jobs.update(editingJob.id, updatedJob)
        setJobs((prev) => prev.map((job) => (job.id === editingJob.id ? updatedJob : job)))
        toast({
          title: "Success",
          description: "Job updated successfully",
        })
      } else {
        // Create new job
        const newJob: Job = {
          id: `job-${Date.now()}`,
          title: jobData.title!,
          slug: jobData.slug!,
          description: jobData.description!,
          responsibilities: jobData.responsibilities!,
          qualifications: jobData.qualifications!,
          status: "active",
          tags: jobData.tags!,
          createdAt: new Date(),
          updatedAt: new Date(),
          order: jobs.length,
        }
        await db.jobs.add(newJob)
        setJobs((prev) => [...prev, newJob])
        toast({
          title: "Success",
          description: "Job created successfully",
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to save job:", error)
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      })
    }
  }

  const handleToggleArchive = async (job: Job) => {
    try {
      const newStatus = job.status === "active" ? "archived" : "active"
      const updatedJob = { ...job, status: newStatus, updatedAt: new Date() }
      await db.jobs.update(job.id, updatedJob)
      setJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j)))
      toast({
        title: "Success",
        description: `Job ${newStatus === "archived" ? "archived" : "restored"}`,
      })
    } catch (error) {
      console.error("Failed to toggle archive:", error)
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      })
    }
  }

  // ---------- Fixed drag handler (robust for up->down and down->up) ----------
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const sourceIndexVisible = result.source.index
    const destinationIndexVisible = result.destination.index

    if (sourceIndexVisible === destinationIndexVisible) return

    // Current rendered paginated slice
    const pageStart = (currentPage - 1) * ITEMS_PER_PAGE
    const currentPaginated = filteredJobs.slice(pageStart, pageStart + ITEMS_PER_PAGE)

    const movedJob = currentPaginated[sourceIndexVisible]
    if (!movedJob) return

    // Work with full jobs array
    const jobsCopy = Array.from(jobs)

    // Find index of moved item in full list
    const sourceIndexInJobs = jobsCopy.findIndex((j) => j.id === movedJob.id)
    if (sourceIndexInJobs === -1) return

    // Remove it first
    const [removed] = jobsCopy.splice(sourceIndexInJobs, 1)

    // Determine insertion index in the UPDATED jobsCopy:
    // - If destination points to an existing paginated item, find that item's index (in the updated array).
    // - If destination is after the last visible item, insert after the last visible item's index.
    // - Fallback: append to end.
    let insertIndexInJobs = jobsCopy.length
    const destJob = currentPaginated[destinationIndexVisible]

    if (destJob) {
      // find its index in the array after removal
      const found = jobsCopy.findIndex((j) => j.id === destJob.id)
      insertIndexInJobs = found === -1 ? jobsCopy.length : found
    } else {
      // Dropped at end of the page: insert after the last visible item from the page (if exists)
      const lastVisible = currentPaginated[currentPaginated.length - 1]
      if (lastVisible && lastVisible.id !== movedJob.id) {
        const lastIdx = jobsCopy.findIndex((j) => j.id === lastVisible.id)
        insertIndexInJobs = lastIdx === -1 ? jobsCopy.length : lastIdx + 1
      } else {
        insertIndexInJobs = jobsCopy.length
      }
    }

    // Insert removed item
    jobsCopy.splice(insertIndexInJobs, 0, removed)

    // Reassign order fields
    const reOrdered = jobsCopy.map((j, idx) => ({ ...j, order: idx }))

    // Optimistic UI updates: both jobs and filteredJobs so view matches immediately
    setJobs(reOrdered)

    // Rebuild filtered list with same filters & ordering
    let newFiltered = reOrdered
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      newFiltered = newFiltered.filter(
        (job) => job.title.toLowerCase().includes(q) || job.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    if (statusFilter !== "all") {
      newFiltered = newFiltered.filter((job) => job.status === statusFilter)
    }
    newFiltered = newFiltered.slice().sort((a, b) => a.order - b.order)
    setFilteredJobs(newFiltered)

    try {
      // Persist to DB
      await Promise.all(reOrdered.map((j) => db.jobs.update(j.id, { order: j.order })))
      toast({
        title: "Success",
        description: "Job order updated",
      })
    } catch (error) {
      console.error("Failed to reorder jobs:", error)
      // Rollback: reload from DB
      await loadJobs()
      toast({
        title: "Error",
        description: "Failed to reorder jobs",
        variant: "destructive",
      })
    }
  }
  // ---------- end handler ----------

  const paginatedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)

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

      <div className="container mx-auto px-30 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Jobs Board</h1>
            <p className="text-muted-foreground">Manage your job postings and track applications</p>
          </div>
          <Button onClick={handleCreateJob} className="flex items-center gap-2">
            <Plus size={20} />
            Create Job
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search jobs by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full md:w-48">
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-primary">{jobs.filter((j) => j.status === "active").length}</div>
            <div className="text-sm text-muted-foreground">Active Jobs</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">
              {jobs.filter((j) => j.status === "archived").length}
            </div>
            <div className="text-sm text-muted-foreground">Archived Jobs</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-accent">{jobs.length}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-chart-2">{filteredJobs.length}</div>
            <div className="text-sm text-muted-foreground">Filtered Results</div>
          </div>
        </div>

        {/* Jobs List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="jobs">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {paginatedJobs.map((job, index) => (
                  <Draggable key={job.id} draggableId={job.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-all duration-200 ${
                          snapshot.isDragging ? "rotate-2 scale-105 shadow-2xl" : ""
                        }`}
                      >
                        <JobCard
                          job={job}
                          onEdit={() => handleEditJob(job)}
                          onToggleArchive={() => handleToggleArchive(job)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first job to get started"}
            </p>
            {!searchTerm && statusFilter === "all" && <Button onClick={handleCreateJob}>Create Your First Job</Button>}
          </div>
        )}
      </div>

      {/* Job Modal */}
      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveJob} job={editingJob} />
    </div>
  )
}
