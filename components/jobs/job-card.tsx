"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Archive, ArchiveRestore, ExternalLink, GripVertical, Briefcase } from "lucide-react"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
  onEdit: () => void
  onToggleArchive: () => void
}

export function JobCard({ job, onEdit, onToggleArchive }: JobCardProps) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-border/50 hover:border-primary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <Briefcase size={48} className="text-primary" />
      </div>

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
              <GripVertical size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-xl font-semibold hover:text-primary transition-all duration-300 hover:scale-105 transform-gpu"
                >
                  {job.title}
                </Link>
                <Badge
                  variant={job.status === "active" ? "default" : "secondary"}
                  className={
                    job.status === "active" ? "bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse" : ""
                  }
                >
                  {job.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 transform-gpu"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="hover:bg-primary/20 hover:text-primary hover:scale-110 transition-all duration-300"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleArchive}
              className="hover:bg-secondary/20 hover:text-secondary hover:scale-110 transition-all duration-300"
            >
              {job.status === "active" ? <Archive size={16} /> : <ArchiveRestore size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-accent/20 hover:text-accent hover:scale-110 transition-all duration-300"
            >
              <Link href={`/jobs/${job.id}`}>
                <ExternalLink size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="flex justify-between items-center text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
          <span>Created {job.createdAt.toLocaleDateString()}</span>
          <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded group-hover:bg-primary/10 transition-colors duration-300">
            {job.slug}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
