"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createBuyer } from "@/lib/data"
import type { Buyer } from "@/lib/types"
import { z } from "zod"

// Simplified schema for quick add
const quickAddSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
})

type QuickAddFormData = z.infer<typeof quickAddSchema>

interface QuickAddFormProps {
  onSuccess: (buyer: Buyer) => void
  onCancel?: () => void
}

export function QuickAddForm({ onSuccess, onCancel }: QuickAddFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickAddFormData>({
    resolver: zodResolver(quickAddSchema),
  })

  const onSubmit = async (data: QuickAddFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = createBuyer({
        ...data,
        status: "new",
      })

      if (result) {
        reset()
        onSuccess(result)
      } else {
        setError("Failed to create buyer")
      }
    } catch (err) {
      setError("An error occurred while creating buyer")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Quick Add Buyer</CardTitle>
        <CardDescription>Add essential information to create a new lead quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Buyer"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
