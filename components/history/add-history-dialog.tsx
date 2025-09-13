"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addBuyerHistory } from "@/lib/data"
import { z } from "zod"

const historySchema = z.object({
  action: z.string().min(1, "Action is required"),
  details: z.string().optional(),
})

type HistoryFormData = z.infer<typeof historySchema>

interface AddHistoryDialogProps {
  buyerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const commonActions = [
  "Phone call",
  "Email sent",
  "Meeting scheduled",
  "Property viewing",
  "Offer submitted",
  "Contract signed",
  "Follow-up required",
  "Status updated",
  "Documents received",
  "Other",
]

export function AddHistoryDialog({ buyerId, open, onOpenChange, onSuccess }: AddHistoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<HistoryFormData>({
    resolver: zodResolver(historySchema),
  })

  const selectedAction = watch("action")

  const onSubmit = async (data: HistoryFormData) => {
    setIsLoading(true)
    setError("")

    try {
      addBuyerHistory(buyerId, data.action, data.details)
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      setError("Failed to add history entry")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add History Entry</DialogTitle>
          <DialogDescription>Record an interaction or update for this buyer</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">Action *</Label>
            <Select value={selectedAction || ""} onValueChange={(value) => setValue("action", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                {commonActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAction === "Other" && (
              <Input placeholder="Enter custom action" {...register("action")} className="mt-2" />
            )}
            {errors.action && <p className="text-sm text-destructive">{errors.action.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              {...register("details")}
              placeholder="Add any additional details about this interaction..."
              rows={3}
            />
            {errors.details && <p className="text-sm text-destructive">{errors.details.message}</p>}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Entry"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
