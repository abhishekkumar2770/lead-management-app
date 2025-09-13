"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAllBuyers } from "@/lib/data"
import { exportBuyersToCSV, downloadCSV } from "@/lib/csv-utils"
import type { Buyer } from "@/lib/types"
import { Download, FileText, CheckCircle } from "lucide-react"

interface CSVExportProps {
  onClose: () => void
}

export function CSVExport({ onClose }: CSVExportProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [includeNotes, setIncludeNotes] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [success, setSuccess] = useState("")

  const buyers = getAllBuyers()

  const getFilteredBuyers = (): Buyer[] => {
    if (statusFilter === "all") {
      return buyers
    }
    return buyers.filter((buyer) => buyer.status === statusFilter)
  }

  const handleExport = async () => {
    setIsExporting(true)
    setSuccess("")

    try {
      const filteredBuyers = getFilteredBuyers()

      if (filteredBuyers.length === 0) {
        setSuccess("No buyers match the selected criteria")
        setIsExporting(false)
        return
      }

      // If not including notes, remove notes from buyers
      const buyersToExport = includeNotes ? filteredBuyers : filteredBuyers.map((buyer) => ({ ...buyer, notes: "" }))

      const csvContent = exportBuyersToCSV(buyersToExport)

      const timestamp = new Date().toISOString().split("T")[0]
      const statusSuffix = statusFilter === "all" ? "all" : statusFilter
      const filename = `buyers-export-${statusSuffix}-${timestamp}.csv`

      downloadCSV(csvContent, filename)

      setSuccess(`Successfully exported ${filteredBuyers.length} buyers to ${filename}`)
    } catch (err) {
      console.error("Export failed:", err)
      setSuccess("Failed to export buyers")
    } finally {
      setIsExporting(false)
    }
  }

  const filteredCount = getFilteredBuyers().length

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Buyers to CSV
        </CardTitle>
        <CardDescription>Download your buyer data as a CSV file for backup or external use</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Options */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Filter by Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select status filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses ({buyers.length} buyers)</SelectItem>
                <SelectItem value="new">New ({buyers.filter((b) => b.status === "new").length})</SelectItem>
                <SelectItem value="contacted">
                  Contacted ({buyers.filter((b) => b.status === "contacted").length})
                </SelectItem>
                <SelectItem value="qualified">
                  Qualified ({buyers.filter((b) => b.status === "qualified").length})
                </SelectItem>
                <SelectItem value="viewing">Viewing ({buyers.filter((b) => b.status === "viewing").length})</SelectItem>
                <SelectItem value="offer">Offer ({buyers.filter((b) => b.status === "offer").length})</SelectItem>
                <SelectItem value="closed">Closed ({buyers.filter((b) => b.status === "closed").length})</SelectItem>
                <SelectItem value="lost">Lost ({buyers.filter((b) => b.status === "lost").length})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeNotes"
              checked={includeNotes}
              onCheckedChange={(checked) => setIncludeNotes(checked as boolean)}
            />
            <Label htmlFor="includeNotes">Include notes in export</Label>
          </div>
        </div>

        {/* Export Preview */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Export Preview</p>
              <p className="text-sm text-muted-foreground">
                {filteredCount} buyers will be exported
                {statusFilter !== "all" && ` (filtered by ${statusFilter} status)`}
              </p>
            </div>
          </div>
        </div>

        {/* Export Info */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Export Details:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• All buyer information will be included</li>
            <li>• Dates will be formatted as YYYY-MM-DD</li>
            <li>• File will be saved as CSV format</li>
            <li>• Compatible with Excel, Google Sheets, and other spreadsheet applications</li>
          </ul>
        </div>

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleExport} disabled={isExporting || filteredCount === 0} className="flex-1">
            {isExporting ? "Exporting..." : `Export ${filteredCount} Buyers`}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
