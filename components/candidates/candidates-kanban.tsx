"use client"

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KanbanCandidateCard } from "./kanban-candidate-card"
import type { Candidate, CandidateStage } from "@/lib/types"

interface CandidatesKanbanProps {
  candidates: Candidate[]
  onStageChange: (candidateId: string, newStage: CandidateStage) => void
}

const stages: { id: CandidateStage; title: string; color: string }[] = [
  { id: "applied", title: "Applied", color: "bg-blue-500" },
  { id: "screening", title: "Screening", color: "bg-yellow-500" },
  { id: "interview", title: "Interview", color: "bg-purple-500" },
  { id: "assessment", title: "Assessment", color: "bg-orange-500" },
  { id: "offer", title: "Offer", color: "bg-green-500" },
  { id: "hired", title: "Hired", color: "bg-emerald-500" },
  { id: "rejected", title: "Rejected", color: "bg-red-500" },
]

export function CandidatesKanban({ candidates, onStageChange }: CandidatesKanbanProps) {
  const candidatesByStage = stages.reduce(
    (acc, stage) => {
      acc[stage.id] = candidates.filter((candidate) => candidate.currentStage === stage.id)
      return acc
    },
    {} as Record<CandidateStage, Candidate[]>,
  )

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId !== destination.droppableId) {
      onStageChange(draggableId, destination.droppableId as CandidateStage)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Scrollable row of columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <Card
            key={stage.id}
            className="bg-card/50 min-w-[300px] max-w-[320px] flex-shrink-0"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  {stage.title}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {candidatesByStage[stage.id].length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[400px] space-y-2 p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? "bg-primary/5" : ""
                    }`}
                  >
                    {candidatesByStage[stage.id].map((candidate, index) => (
                      <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all duration-200 ${
                              snapshot.isDragging ? "rotate-2 scale-105 shadow-2xl" : ""
                            }`}
                          >
                            <KanbanCandidateCard candidate={candidate} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        ))}
      </div>
    </DragDropContext>
  )
}
