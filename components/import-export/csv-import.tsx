"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { parseCSVToBuyers, generateCSVTemplate, downloadCSV } from "@/lib/csv-utils"
import { createBuyer } from "@/lib/data"
import { Upload, Download, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface CSVImportProps {
  onSuccess: (importedCount: number) => void
  onClose: () => void
}

export function CSVImport({ onSuccess, onClose }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please select a CSV file")
        return
      }
      setFile(selectedFile)
      setError("")
      setSuccess("")
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setIsImporting(true)
    setError("")
    setSuccess("")
    setProgress(0)

    try {
      const csvContent = await file.text()
      const buyers = parseCSVToBuyers(csvContent)

      let importedCount = 0
      const totalBuyers = buyers.length

      for (let i = 0; i < buyers.length; i++) {
        try {
          createBuyer(buyers[i])
          importedCount++
        } catch (err) {
          console.error(`Failed to import buyer ${i + 1}:`, err)
        }

        setProgress(((i + 1) / totalBuyers) * 100)

        // Add small delay to show progress
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      setSuccess(`Successfully imported ${importedCount} of ${totalBuyers} buyers`)

      setTimeout(() => {
        onSuccess(importedCount)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import CSV file")
    } finally {
      setIsImporting(false)
    }
  }

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate()
    downloadCSV(template, "buyer-import-template.csv")
  }

  const resetForm = () => {
    setFile(null)
    setError("")
    setSuccess("")
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Buyers from CSV
        </CardTitle>
        <CardDescription>Upload a CSV file to import multiple buyer leads at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Download */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Need a template?</p>
                <p className="text-sm text-muted-foreground">Download a sample CSV file with the correct format</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>

        {/* File Selection */}
        <div className="space-y-2">
          <Label htmlFor="csvFile">Select CSV File</Label>
          <Input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            ref={fileInputRef}
            disabled={isImporting}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Progress */}
        {isImporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Import Progress</Label>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* CSV Format Info */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Required columns: First Name, Last Name, Email</li>
            <li>• Optional columns: Phone, Budget, Preferred Location, Property Type, Status, Source, Notes</li>
            <li>• Property Type must be: House, Condo, Apartment, Townhouse, or Other</li>
            <li>• Status must be: new, contacted, qualified, viewing, offer, closed, or lost</li>
            <li>• Budget should be a number (without currency symbols)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleImport} disabled={!file || isImporting} className="flex-1">
            {isImporting ? "Importing..." : "Import Buyers"}
          </Button>
          <Button variant="outline" onClick={resetForm} disabled={isImporting}>
            Reset
          </Button>
          <Button variant="outline" onClick={onClose} disabled={isImporting}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
