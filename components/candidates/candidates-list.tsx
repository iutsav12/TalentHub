"use client"

import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { CandidateCard } from "./candidate-card"
import type { Candidate, CandidateStage } from "@/lib/types"

interface CandidatesListProps {
  candidates: Candidate[]
  onStageChange: (candidateId: string, newStage: CandidateStage) => void
}

export function CandidatesList({ candidates, onStageChange }: CandidatesListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 10,
  })

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto border border-border rounded-lg bg-card/50"
      style={{
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const candidate = candidates[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="p-2 h-full">
                <CandidateCard candidate={candidate} onStageChange={onStageChange} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
