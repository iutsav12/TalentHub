"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Question, ValidationRule, ConditionalRule } from "@/lib/types"

interface QuestionBuilderProps {
  isOpen: boolean
  onClose: () => void
  onSave: (question: Question) => void
  question?: Question
  existingQuestions: Question[]
}

const questionTypes = [
  { value: "single-choice", label: "Single Choice" },
  { value: "multi-choice", label: "Multiple Choice" },
  { value: "short-text", label: "Short Text" },
  { value: "long-text", label: "Long Text" },
  { value: "numeric", label: "Numeric" },
  { value: "file-upload", label: "File Upload" },
]

export function QuestionBuilder({ isOpen, onClose, onSave, question, existingQuestions }: QuestionBuilderProps) {
  const [formData, setFormData] = useState<Partial<Question>>({
    type: "single-choice",
    question: "",
    required: false,
    options: [""],
    validation: {},
    order: 0,
    correctAnswers: undefined,
    points: 1,
  })

  useEffect(() => {
    if (question) {
      setFormData(question)
    } else {
      setFormData({
        type: "single-choice",
        question: "",
        required: false,
        options: [""],
        validation: {},
        order: existingQuestions.length,
        correctAnswers: undefined,
        points: 1,
      })
    }
  }, [question, existingQuestions, isOpen])

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), ""],
    }))
  }

  const updateOption = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.map((option, i) => (i === index ? value : option)),
    }))
  }

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index),
    }))
  }

  const updateValidation = (field: keyof ValidationRule, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      validation: {
        ...prev.validation,
        [field]: value,
      },
    }))
  }

  const updateConditionalLogic = (field: keyof ConditionalRule, value: string) => {
    setFormData((prev) => ({
      ...prev,
      conditionalLogic: {
        ...prev.conditionalLogic,
        [field]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.question?.trim()) return

    const questionData: Question = {
      id: question?.id || `question-${Date.now()}`,
      type: formData.type!,
      question: formData.question!,
      required: formData.required!,
      options: ["single-choice", "multi-choice"].includes(formData.type!) ? formData.options : undefined,
      validation: formData.validation,
      conditionalLogic: formData.conditionalLogic,
      order: formData.order!,
      correctAnswers: formData.correctAnswers,
      points: formData.points!,
    }

    onSave(questionData)
  }

  const needsOptions = ["single-choice", "multi-choice"].includes(formData.type!)
  const needsValidation = ["short-text", "long-text", "numeric"].includes(formData.type!)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? "Edit Question" : "Add Question"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Question Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Enter your question here..."
              rows={3}
              required
            />
          </div>

          {/* Required Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={formData.required}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, required: checked }))}
            />
            <Label htmlFor="required">Required question</Label>
          </div>

          {/* Options (for choice questions) */}
          {needsOptions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Answer Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.options?.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type={formData.type === "single-choice" ? "radio" : "checkbox"}
                        name="correctAnswer"
                        checked={
                          formData.type === "single-choice"
                            ? formData.correctAnswers === index.toString()
                            : Array.isArray(formData.correctAnswers) &&
                              formData.correctAnswers.includes(index.toString())
                        }
                        onChange={(e) => {
                          if (formData.type === "single-choice") {
                            setFormData((prev) => ({
                              ...prev,
                              correctAnswers: e.target.checked ? index.toString() : undefined,
                            }))
                          } else {
                            const currentAnswers = Array.isArray(formData.correctAnswers) ? formData.correctAnswers : []
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                correctAnswers: [...currentAnswers, index.toString()],
                              }))
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                correctAnswers: currentAnswers.filter((a) => a !== index.toString()),
                              }))
                            }
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <Label className="text-xs text-green-600">Correct</Label>
                    </div>
                    {(formData.options?.length || 0) > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index)}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus size={16} className="mr-2" />
                  Add Option
                </Button>
              </CardContent>
            </Card>
          )}

          {!needsOptions && formData.type !== "file-upload" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Correct Answer (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="correctAnswer">Expected Answer</Label>
                  {formData.type === "numeric" ? (
                    <Input
                      id="correctAnswer"
                      type="number"
                      value={typeof formData.correctAnswers === "number" ? formData.correctAnswers : ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, correctAnswers: Number(e.target.value) }))}
                      placeholder="Enter the correct numeric answer"
                    />
                  ) : (
                    <Textarea
                      id="correctAnswer"
                      value={typeof formData.correctAnswers === "string" ? formData.correctAnswers : ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, correctAnswers: e.target.value }))}
                      placeholder="Enter the expected text answer (for automatic scoring)"
                      rows={2}
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    Set this to enable automatic scoring. Leave empty for manual review.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conditional Logic */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conditional Logic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Show this question only if another question meets a condition
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dependsOn">Depends on Question</Label>
                  <Select
                    value={formData.conditionalLogic?.dependsOn || "default"}
                    onValueChange={(value) => updateConditionalLogic("dependsOn", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a question" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">No dependency</SelectItem>
                      {existingQuestions
                        .filter((q) => q.id !== question?.id)
                        .map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.question.substring(0, 50)}...
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.conditionalLogic?.dependsOn && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={formData.conditionalLogic?.condition || "equals"}
                        onValueChange={(value: any) => updateConditionalLogic("condition", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="not_equals">Not Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="value">Value</Label>
                      <Input
                        id="value"
                        value={formData.conditionalLogic?.value || ""}
                        onChange={(e) => updateConditionalLogic("value", e.target.value)}
                        placeholder="Expected value"
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scoring */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="points">Points for Correct Answer</Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  value={formData.points || 1}
                  onChange={(e) => setFormData((prev) => ({ ...prev, points: Number(e.target.value) }))}
                  placeholder="1"
                />
                <p className="text-xs text-muted-foreground">Points awarded when the candidate answers correctly</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.question?.trim()}>
              {question ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
