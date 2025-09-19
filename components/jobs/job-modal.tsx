"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Job } from "@/lib/types"

interface JobModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (job: Partial<Job>) => void
  job?: Job | null
}

export function JobModal({ isOpen, onClose, onSave, job }: JobModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    responsibilities: [""],
    qualifications: [""],
    tags: [""],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        slug: job.slug,
        description: job.description,
        responsibilities: job.responsibilities,
        qualifications: job.qualifications,
        tags: job.tags,
      })
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        responsibilities: [""],
        qualifications: [""],
        tags: [""],
      })
    }
    setErrors({})
  }, [job, isOpen])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const addArrayItem = (field: "responsibilities" | "qualifications" | "tags") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const updateArrayItem = (field: "responsibilities" | "qualifications" | "tags", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeArrayItem = (field: "responsibilities" | "qualifications" | "tags", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter((r) => r.trim()),
      qualifications: formData.qualifications.filter((q) => q.trim()),
      tags: formData.tags.filter((t) => t.trim()),
    }

    onSave(cleanedData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Create New Job"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="senior-frontend-developer"
              className={errors.slug ? "border-destructive" : ""}
            />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            <p className="text-xs text-muted-foreground">This will be used in the job URL</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role, company, and what makes this opportunity exciting..."
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Responsibilities</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("responsibilities")}>
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {formData.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={responsibility}
                    onChange={(e) => updateArrayItem("responsibilities", index, e.target.value)}
                    placeholder="Enter a responsibility..."
                  />
                  {formData.responsibilities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem("responsibilities", index)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Qualifications</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("qualifications")}>
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {formData.qualifications.map((qualification, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={qualification}
                    onChange={(e) => updateArrayItem("qualifications", index, e.target.value)}
                    placeholder="Enter a qualification..."
                  />
                  {formData.qualifications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem("qualifications", index)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tags")}>
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => updateArrayItem("tags", index, e.target.value)}
                    placeholder="e.g., Remote, Full-time, Tech"
                  />
                  {formData.tags.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem("tags", index)}>
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags
                .filter((tag) => tag.trim())
                .map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{job ? "Update Job" : "Create Job"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
