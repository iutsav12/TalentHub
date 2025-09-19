"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { QuestionBuilder } from "./question-builder"
import { AssessmentPreview } from "./assessment-preview"
import type { Assessment, AssessmentSection, Question, Job } from "@/lib/types"

interface AssessmentBuilderProps {
  isOpen: boolean
  onClose: () => void
  onSave: (assessment: Partial<Assessment>) => void
  assessment?: Assessment | null
  jobs: Job[]
  isFullPage?: boolean
}

export function AssessmentBuilder({
  isOpen,
  onClose,
  onSave,
  assessment,
  jobs,
  isFullPage = false,
}: AssessmentBuilderProps) {
  const [formData, setFormData] = useState({
    title: "",
    jobId: "",
    sections: [] as AssessmentSection[],
  })
  const [activeTab, setActiveTab] = useState("builder")
  const [editingQuestion, setEditingQuestion] = useState<{ sectionId: string; question?: Question } | null>(null)

  useEffect(() => {
    if (assessment) {
      setFormData({
        title: assessment.title,
        jobId: assessment.jobId,
        sections: assessment.sections,
      })
    } else {
      setFormData({
        title: "",
        jobId: "",
        sections: [],
      })
    }
  }, [assessment, isOpen])

  const addSection = () => {
    const newSection: AssessmentSection = {
      id: `section-${Date.now()}`,
      title: `Section ${formData.sections.length + 1}`,
      questions: [],
      order: formData.sections.length,
    }
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))
  }

  const updateSection = (sectionId: string, updates: Partial<AssessmentSection>) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === sectionId ? { ...section, ...updates } : section)),
    }))
  }

  const deleteSection = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
  }

  const addQuestion = (sectionId: string) => {
    setEditingQuestion({ sectionId })
  }

  const saveQuestion = (sectionId: string, question: Question) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: editingQuestion?.question
                ? section.questions.map((q) => (q.id === question.id ? question : q))
                : [...section.questions, question],
            }
          : section,
      ),
    }))
    setEditingQuestion(null)
  }

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, questions: section.questions.filter((q) => q.id !== questionId) }
          : section,
      ),
    }))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === "section") {
      const newSections = Array.from(formData.sections)
      const [reorderedSection] = newSections.splice(source.index, 1)
      newSections.splice(destination.index, 0, reorderedSection)

      setFormData((prev) => ({
        ...prev,
        sections: newSections.map((section, index) => ({ ...section, order: index })),
      }))
    } else if (type === "question") {
      const sectionId = source.droppableId
      const section = formData.sections.find((s) => s.id === sectionId)
      if (!section) return

      const newQuestions = Array.from(section.questions)
      const [reorderedQuestion] = newQuestions.splice(source.index, 1)
      newQuestions.splice(destination.index, 0, reorderedQuestion)

      updateSection(sectionId, {
        questions: newQuestions.map((question, index) => ({ ...question, order: index })),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.jobId) return

    onSave(formData)
  }

  const totalQuestions = formData.sections.reduce((total, section) => total + section.questions.length, 0)

  const ContentWrapper = isFullPage ? "div" : Dialog
  const ContentProps = isFullPage ? { className: "space-y-6" } : { open: isOpen, onOpenChange: onClose }
  const InnerWrapper = isFullPage ? "div" : DialogContent

  return (
    <>
      <ContentWrapper {...ContentProps}>
        {!isFullPage && (
          <DialogHeader>
            <DialogTitle>{assessment ? "Edit Assessment" : "Create Assessment"}</DialogTitle>
          </DialogHeader>
        )}

        <InnerWrapper className={isFullPage ? "" : "max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assessment Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Frontend Developer Assessment"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobId">Job *</Label>
                    <Select
                      value={formData.jobId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, jobId: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                  <Badge variant="outline">{formData.sections.length} sections</Badge>
                  <Badge variant="outline">{totalQuestions} questions</Badge>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Sections</h3>
                    <Button type="button" onClick={addSection} size="sm">
                      <Plus size={16} className="mr-2" />
                      Add Section
                    </Button>
                  </div>

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections" type="section">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                          {formData.sections.map((section, sectionIndex) => (
                            <Draggable key={section.id} draggableId={section.id} index={sectionIndex}>
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`transition-all duration-200 ${
                                    snapshot.isDragging ? "rotate-1 scale-105 shadow-2xl" : ""
                                  }`}
                                >
                                  <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                      <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                        <GripVertical size={20} className="text-muted-foreground" />
                                      </div>
                                      <Input
                                        value={section.title}
                                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                        className="font-semibold"
                                        placeholder="Section title"
                                      />
                                      <Badge variant="outline">{section.questions.length} questions</Badge>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteSection(section.id)}
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <Droppable droppableId={section.id} type="question">
                                      {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                          {section.questions.map((question, questionIndex) => (
                                            <Draggable
                                              key={question.id}
                                              draggableId={question.id}
                                              index={questionIndex}
                                            >
                                              {(provided, snapshot) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  className={`p-3 bg-muted/50 rounded-lg flex items-center justify-between transition-all duration-200 ${
                                                    snapshot.isDragging ? "rotate-1 scale-105 shadow-lg" : ""
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-3 flex-1">
                                                    <GripVertical size={16} className="text-muted-foreground" />
                                                    <div className="flex-1">
                                                      <p className="font-medium truncate">{question.question}</p>
                                                      <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="secondary" className="text-xs">
                                                          {question.type}
                                                        </Badge>
                                                        {question.required && (
                                                          <Badge variant="destructive" className="text-xs">
                                                            Required
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="flex gap-2">
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() =>
                                                        setEditingQuestion({ sectionId: section.id, question })
                                                      }
                                                    >
                                                      Edit
                                                    </Button>
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => deleteQuestion(section.id, question.id)}
                                                    >
                                                      <Trash2 size={16} />
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          ))}
                                          {provided.placeholder}
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addQuestion(section.id)}
                                            className="w-full"
                                          >
                                            <Plus size={16} className="mr-2" />
                                            Add Question
                                          </Button>
                                        </div>
                                      )}
                                    </Droppable>
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {formData.sections.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        No sections yet. Add your first section to get started.
                      </p>
                      <Button type="button" onClick={addSection}>
                        <Plus size={16} className="mr-2" />
                        Add Section
                      </Button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.title || !formData.jobId}>
                    {assessment ? "Update Assessment" : "Create Assessment"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="preview" className="flex-1">
              {formData.title && formData.sections.length > 0 ? (
                <AssessmentPreview
                  assessment={{
                    id: "preview",
                    title: formData.title,
                    jobId: formData.jobId,
                    sections: formData.sections,
                    shareableLink: "",
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  isEmbedded
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Add sections and questions to see the preview</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </InnerWrapper>
      </ContentWrapper>

      {/* Question Builder Modal */}
      {editingQuestion && (
        <QuestionBuilder
          isOpen={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={(question) => saveQuestion(editingQuestion.sectionId, question)}
          question={editingQuestion.question}
          existingQuestions={formData.sections.find((s) => s.id === editingQuestion.sectionId)?.questions || []}
        />
      )}
    </>
  )
}
