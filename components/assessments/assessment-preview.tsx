"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Upload } from "lucide-react"
import type { Assessment, Question } from "@/lib/types"

interface AssessmentPreviewProps {
  isOpen?: boolean
  onClose?: () => void
  assessment: Assessment | null
  isEmbedded?: boolean
}

export function AssessmentPreview({ isOpen = true, onClose, assessment, isEmbedded = false }: AssessmentPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [currentSection, setCurrentSection] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!assessment) return null

  const updateResponse = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const isQuestionVisible = (question: Question): boolean => {
    if (!question.conditionalLogic?.dependsOn) return true

    const dependentResponse = responses[question.conditionalLogic.dependsOn]
    const condition = question.conditionalLogic.condition
    const expectedValue = question.conditionalLogic.value

    switch (condition) {
      case "equals":
        return dependentResponse === expectedValue
      case "not_equals":
        return dependentResponse !== expectedValue
      case "contains":
        return String(dependentResponse || "")
          .toLowerCase()
          .includes(expectedValue.toLowerCase())
      default:
        return true
    }
  }

  const validateQuestion = (question: Question, value: any): string | null => {
    if (question.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return "This question is required"
    }

    if (!question.validation || !value) return null

    const validation = question.validation

    if (question.type === "numeric") {
      const numValue = Number(value)
      if (validation.min !== undefined && numValue < validation.min) {
        return `Value must be at least ${validation.min}`
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return `Value must be at most ${validation.max}`
      }
    }

    if (["short-text", "long-text"].includes(question.type)) {
      const textValue = String(value)
      if (validation.minLength && textValue.length < validation.minLength) {
        return `Must be at least ${validation.minLength} characters`
      }
      if (validation.maxLength && textValue.length > validation.maxLength) {
        return `Must be at most ${validation.maxLength} characters`
      }
      if (validation.pattern && !new RegExp(validation.pattern).test(textValue)) {
        return "Invalid format"
      }
    }

    return null
  }

  const renderQuestion = (question: Question) => {
    if (!isQuestionVisible(question)) return null

    const value = responses[question.id]
    const error = validateQuestion(question, value)

    return (
      <div key={question.id} className="space-y-3">
        <div className="flex items-start gap-2">
          <Label className="text-base font-medium leading-relaxed">
            {question.question}
            {question.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        </div>

        {question.type === "single-choice" && (
          <RadioGroup value={value || ""} onValueChange={(val) => updateResponse(question.id, val)}>
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "multi-choice" && (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || []
                    if (checked) {
                      updateResponse(question.id, [...currentValues, option])
                    } else {
                      updateResponse(
                        question.id,
                        currentValues.filter((v: string) => v !== option),
                      )
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )}

        {question.type === "short-text" && (
          <Input
            value={value || ""}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            placeholder="Your answer..."
            maxLength={question.validation?.maxLength}
          />
        )}

        {question.type === "long-text" && (
          <Textarea
            value={value || ""}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            placeholder="Your answer..."
            rows={4}
            maxLength={question.validation?.maxLength}
          />
        )}

        {question.type === "numeric" && (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => updateResponse(question.id, Number(e.target.value))}
            placeholder="Enter a number..."
            min={question.validation?.min}
            max={question.validation?.max}
          />
        )}

        {question.type === "file-upload" && (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const totalQuestions = assessment.sections.reduce((total, section) => total + section.questions.length, 0)
  const answeredQuestions = Object.keys(responses).length
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  const content = (
    <div className="space-y-6">
      {!isSubmitted ? (
        <>
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <p className="text-muted-foreground">Complete all sections to submit your assessment</p>
            <div className="flex items-center gap-4 justify-center">
              <Badge variant="outline">{assessment.sections.length} sections</Badge>
              <Badge variant="outline">{totalQuestions} questions</Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {answeredQuestions} of {totalQuestions} questions
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {assessment.sections.map((section, index) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {section.title}
                    <Badge variant="outline">{section.questions.length} questions</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.questions.sort((a, b) => a.order - b.order).map((question) => renderQuestion(question))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button onClick={handleSubmit} size="lg" disabled={answeredQuestions === 0}>
              Submit Assessment
            </Button>
          </div>
        </>
      ) : (
        /* Success State */
        <div className="text-center space-y-6 py-12">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Assessment Submitted!</h2>
            <p className="text-muted-foreground">
              Thank you for completing the assessment. We'll review your responses and get back to you soon.
            </p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Completion Rate:</strong> {Math.round(progress)}%
            </p>
            <p className="text-sm">
              <strong>Questions Answered:</strong> {answeredQuestions} of {totalQuestions}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  if (isEmbedded) {
    return <div className="max-h-[600px] overflow-y-auto p-4">{content}</div>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assessment Preview</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
