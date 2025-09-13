"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { buyerSchema, type BuyerFormData } from "@/lib/validations"
import { createBuyer, updateBuyer } from "@/lib/data"
import type { Buyer } from "@/lib/types"

interface BuyerFormProps {
  buyer?: Buyer
  onSuccess: (buyer: Buyer) => void
  onCancel: () => void
}

export function BuyerForm({ buyer, onSuccess, onCancel }: BuyerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: buyer
      ? {
          firstName: buyer.firstName,
          lastName: buyer.lastName,
          email: buyer.email,
          phone: buyer.phone || "",
          budget: buyer.budget || undefined,
          preferredLocation: buyer.preferredLocation || "",
          propertyType: buyer.propertyType || undefined,
          status: buyer.status,
          source: buyer.source || "",
          notes: buyer.notes || "",
        }
      : {
          status: "new",
        },
  })

  const onSubmit = async (data: BuyerFormData) => {
    setIsLoading(true)
    setError("")

    try {
      let result: Buyer | null

      if (buyer) {
        // Update existing buyer
        result = updateBuyer({ id: buyer.id, ...data })
      } else {
        // Create new buyer
        result = createBuyer(data)
      }

      if (result) {
        onSuccess(result)
      } else {
        setError("Failed to save buyer")
      }
    } catch (err) {
      setError("An error occurred while saving")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{buyer ? "Edit Buyer" : "Add New Buyer"}</CardTitle>
        <CardDescription>
          {buyer ? "Update buyer information and status" : "Enter buyer details to create a new lead"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register("firstName")} placeholder="Enter first name" />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register("lastName")} placeholder="Enter last name" />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} placeholder="Enter email address" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} placeholder="Enter phone number" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Property Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                {...register("budget", { valueAsNumber: true })}
                placeholder="Enter budget amount"
              />
              {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={watch("propertyType") || ""}
                onValueChange={(value) => setValue("propertyType", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredLocation">Preferred Location</Label>
              <Input id="preferredLocation" {...register("preferredLocation")} placeholder="Enter preferred location" />
              {errors.preferredLocation && (
                <p className="text-sm text-destructive">{errors.preferredLocation.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input id="source" {...register("source")} placeholder="How did they find you?" />
              {errors.source && <p className="text-sm text-destructive">{errors.source.message}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={watch("status") || "new"} onValueChange={(value) => setValue("status", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="viewing">Viewing</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Add any additional notes about this buyer..."
              rows={4}
            />
            {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : buyer ? "Update Buyer" : "Create Buyer"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
