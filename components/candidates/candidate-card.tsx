"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, ExternalLink, Calendar, User } from "lucide-react"
import type { Candidate, CandidateStage } from "@/lib/types"

interface CandidateCardProps {
  candidate: Candidate
  onStageChange: (candidateId: string, newStage: CandidateStage) => void
}

const stageColors = {
  applied: "bg-gradient-to-r from-blue-500 to-blue-600",
  screening: "bg-gradient-to-r from-yellow-500 to-yellow-600",
  interview: "bg-gradient-to-r from-purple-500 to-purple-600",
  assessment: "bg-gradient-to-r from-orange-500 to-orange-600",
  offer: "bg-gradient-to-r from-green-500 to-green-600",
  hired: "bg-gradient-to-r from-emerald-500 to-emerald-600",
  rejected: "bg-gradient-to-r from-red-500 to-red-600",
}

const stageLabels = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  assessment: "Assessment",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
}

export function CandidateCard({ candidate, onStageChange }: CandidateCardProps) {
  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm h-full border-border/50 hover:border-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <User size={48} className="text-primary" />
      </div>

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-12 h-12 group-hover:scale-110 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-primary/30">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/candidates/${candidate.id}`}
                  className="text-lg font-semibold hover:text-primary transition-all duration-300 truncate hover:scale-105 transform-gpu"
                >
                  {candidate.name}
                </Link>
                <Badge
                  variant="outline"
                  className={`text-white border-0 ${stageColors[candidate.currentStage]} hover:scale-105 transition-transform duration-300 animate-pulse`}
                >
                  {stageLabels[candidate.currentStage]}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 group-hover:text-foreground/80 transition-colors duration-300">
                <div className="flex items-center gap-1 hover:text-primary transition-colors duration-300">
                  <Mail size={14} className="group-hover:animate-bounce" />
                  <span className="truncate">{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-1 hover:text-primary transition-colors duration-300">
                    <Phone size={14} className="group-hover:animate-bounce" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                <Calendar size={12} className="group-hover:animate-pulse" />
                <span>Applied {candidate.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <Link href={`/candidates/${candidate.id}`}>
                <ExternalLink size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
            Job: {candidate.jobId.replace("job-", "Job ")}
          </div>
          <Select
            value={candidate.currentStage}
            onValueChange={(value: CandidateStage) => onStageChange(candidate.id, value)}
          >
            <SelectTrigger className="w-32 h-8 text-xs hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
      </CardContent>
    </Card>
  )
}
