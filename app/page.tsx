"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { BuyerList } from "@/components/buyers/buyer-list"
import { BuyerDetails } from "@/components/buyers/buyer-details"
import { BuyerForm } from "@/components/forms/buyer-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { deleteBuyer } from "@/lib/data"
import type { Buyer } from "@/lib/types"
import { Trash2 } from "lucide-react"

type ViewMode = "list" | "details" | "form"

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [buyerToDelete, setBuyerToDelete] = useState<Buyer | null>(null)

  const handleAddBuyer = () => {
    setSelectedBuyer(null)
    setIsFormOpen(true)
  }

  const handleEditBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer)
    setIsFormOpen(true)
  }

  const handleViewBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer)
    setViewMode("details")
  }

  const handleDeleteBuyer = (buyer: Buyer) => {
    setBuyerToDelete(buyer)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (buyerToDelete) {
      deleteBuyer(buyerToDelete.id)
      setDeleteConfirmOpen(false)
      setBuyerToDelete(null)
      // If we're viewing the deleted buyer, go back to list
      if (selectedBuyer?.id === buyerToDelete.id) {
        setViewMode("list")
        setSelectedBuyer(null)
      }
    }
  }

  const handleFormSuccess = (buyer: Buyer) => {
    setIsFormOpen(false)
    setSelectedBuyer(buyer)
    setViewMode("details")
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setSelectedBuyer(null)
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedBuyer(null)
  }

  const handleEditFromDetails = () => {
    if (selectedBuyer) {
      setIsFormOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {viewMode === "list" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your buyer leads and activity</p>
            </div>
            <StatsCards />
            <BuyerList
              onAddBuyer={handleAddBuyer}
              onEditBuyer={handleEditBuyer}
              onViewBuyer={handleViewBuyer}
              onDeleteBuyer={handleDeleteBuyer}
            />
          </div>
        )}

        {viewMode === "details" && selectedBuyer && (
          <BuyerDetails buyer={selectedBuyer} onEdit={handleEditFromDetails} onBack={handleBackToList} />
        )}

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedBuyer ? "Edit Buyer" : "Add New Buyer"}</DialogTitle>
            </DialogHeader>
            <BuyerForm buyer={selectedBuyer || undefined} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <Trash2 className="h-4 w-4" />
                <AlertDescription>
                  Are you sure you want to delete{" "}
                  <strong>
                    {buyerToDelete?.firstName} {buyerToDelete?.lastName}
                  </strong>
                  ? This action cannot be undone and will also remove all associated history.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete Buyer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
