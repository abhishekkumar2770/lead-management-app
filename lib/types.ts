export interface Buyer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  budget?: number
  preferredLocation?: string
  propertyType?: string
  status: "new" | "contacted" | "qualified" | "viewing" | "offer" | "closed" | "lost"
  source?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface BuyerHistory {
  id: string
  buyerId: string
  action: string
  details?: string
  createdAt: Date
  userId: string
}

export interface CreateBuyerInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  budget?: number
  preferredLocation?: string
  propertyType?: string
  status?: Buyer["status"]
  source?: string
  notes?: string
}

export interface UpdateBuyerInput extends Partial<CreateBuyerInput> {
  id: string
}

export interface BuyerFilters {
  status?: Buyer["status"]
  propertyType?: string
  minBudget?: number
  maxBudget?: number
  location?: string
  source?: string
}
