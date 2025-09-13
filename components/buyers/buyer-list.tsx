"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CSVImport } from "@/components/import-export/csv-import"
import { CSVExport } from "@/components/import-export/csv-export"
import { getAllBuyers, searchBuyers } from "@/lib/data"
import type { Buyer } from "@/lib/types"
import { Search, Plus, Edit, Eye, Trash2, Upload, Download } from "lucide-react"

interface BuyerListProps {
  onAddBuyer: () => void
  onEditBuyer: (buyer: Buyer) => void
  onViewBuyer: (buyer: Buyer) => void
  onDeleteBuyer: (buyer: Buyer) => void
}

const statusColors = {
  new: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  contacted: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  qualified: "bg-green-100 text-green-800 hover:bg-green-200",
  viewing: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  offer: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  closed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  lost: "bg-red-100 text-red-800 hover:bg-red-200",
}

export function BuyerList({ onAddBuyer, onEditBuyer, onViewBuyer, onDeleteBuyer }: BuyerListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>("all")
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const buyers = getAllBuyers()

  const filteredBuyers = useMemo(() => {
    let result = buyers

    // Apply search filter
    if (searchQuery.trim()) {
      result = searchBuyers(searchQuery.trim())
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((buyer) => buyer.status === statusFilter)
    }

    // Apply property type filter
    if (propertyTypeFilter !== "all") {
      result = result.filter((buyer) => buyer.propertyType === propertyTypeFilter)
    }

    return result
  }, [buyers, searchQuery, statusFilter, propertyTypeFilter])

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not specified"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const handleImportSuccess = (importedCount: number) => {
    setImportDialogOpen(false)
    // Refresh the list by triggering a re-render
    // In a real app, you might want to show a toast notification
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Buyer Leads</h2>
          <p className="text-muted-foreground">Manage and track your buyer leads</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setImportDialogOpen(true)} className="flex-1 sm:flex-none">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)} className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={onAddBuyer} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Add New Buyer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search buyers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="viewing">Viewing</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Property Types</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredBuyers.length} of {buyers.length} buyers
        </p>
      </div>

      {/* Buyers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuyers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchQuery || statusFilter !== "all" || propertyTypeFilter !== "all"
                        ? "No buyers match your search criteria"
                        : "No buyers found. Add your first buyer to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBuyers.map((buyer) => (
                    <TableRow key={buyer.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {buyer.firstName} {buyer.lastName}
                          </p>
                          {buyer.preferredLocation && (
                            <p className="text-sm text-muted-foreground">{buyer.preferredLocation}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{buyer.email}</p>
                          {buyer.phone && <p className="text-sm text-muted-foreground">{buyer.phone}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(buyer.budget)}</TableCell>
                      <TableCell>{buyer.propertyType || "Not specified"}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[buyer.status]} variant="secondary">
                          {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(buyer.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onViewBuyer(buyer)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onEditBuyer(buyer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDeleteBuyer(buyer)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Buyers from CSV</DialogTitle>
          </DialogHeader>
          <CSVImport onSuccess={handleImportSuccess} onClose={() => setImportDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Export Buyers to CSV</DialogTitle>
          </DialogHeader>
          <CSVExport onClose={() => setExportDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
