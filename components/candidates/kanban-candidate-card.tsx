"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Calendar } from "lucide-react"
import type { Candidate } from "@/lib/types"

interface KanbanCandidateCardProps {
  candidate: Candidate
}

export function KanbanCandidateCard({ candidate }: KanbanCandidateCardProps) {
  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing bg-background">
      <CardContent className="p-3">
        <Link href={`/candidates/${candidate.id}`} className="block">
          <div className="flex items-start gap-2 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {candidate.name}
              </h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Mail size={10} />
                <span className="truncate">{candidate.email}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={10} />
            <span>{candidate.createdAt.toLocaleDateString()}</span>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
