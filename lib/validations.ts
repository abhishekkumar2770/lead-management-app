import { z } from "zod"

export const buyerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  budget: z.number().positive("Budget must be positive").optional(),
  preferredLocation: z.string().max(100, "Location too long").optional(),
  propertyType: z.enum(["House", "Condo", "Apartment", "Townhouse", "Other"]).optional(),
  status: z.enum(["new", "contacted", "qualified", "viewing", "offer", "closed", "lost"]).optional(),
  source: z.string().max(50, "Source too long").optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
})

export const updateBuyerSchema = buyerSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
})

export const buyerFiltersSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "viewing", "offer", "closed", "lost"]).optional(),
  propertyType: z.string().optional(),
  minBudget: z.number().positive().optional(),
  maxBudget: z.number().positive().optional(),
  location: z.string().optional(),
  source: z.string().optional(),
})

export type BuyerFormData = z.infer<typeof buyerSchema>
export type UpdateBuyerFormData = z.infer<typeof updateBuyerSchema>
export type BuyerFiltersData = z.infer<typeof buyerFiltersSchema>
