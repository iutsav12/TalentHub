"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Download, Upload, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { useDatabase } from "@/lib/hooks/use-database"
import { exportData, importData } from "@/lib/db"
import { toast } from "@/hooks/use-toast"

export function DatabaseStatus() {
  const { isInitialized, isLoading, error, stats, reinitialize } = useDatabase()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const data = await exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `talenthub-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Data exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      const text = await file.text()
      const data = JSON.parse(text)
      await importData(data)
      await reinitialize()

      toast({
        title: "Success",
        description: "Data imported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      // Reset file input
      event.target.value = ""
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database size={20} />
          Database Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <RefreshCw className="animate-spin" size={16} />
          ) : error ? (
            <AlertCircle className="text-destructive" size={16} />
          ) : (
            <CheckCircle className="text-green-500" size={16} />
          )}
          <Badge variant={error ? "destructive" : isInitialized ? "default" : "secondary"}>
            {isLoading ? "Loading..." : error ? "Error" : isInitialized ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        {isInitialized && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{stats.jobCount}</div>
              <div className="text-xs text-muted-foreground">Jobs</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{stats.candidateCount}</div>
              <div className="text-xs text-muted-foreground">Candidates</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{stats.assessmentCount}</div>
              <div className="text-xs text-muted-foreground">Assessments</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reinitialize} disabled={isLoading}>
            <RefreshCw size={14} className="mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting || !isInitialized}>
            <Download size={14} className="mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" disabled={isImporting} asChild>
            <label>
              <Upload size={14} className="mr-1" />
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground">
          Data is stored locally in IndexedDB and persists across browser sessions.
        </div>
      </CardContent>
    </Card>
  )
}
