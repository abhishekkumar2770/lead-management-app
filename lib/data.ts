import type { Buyer, BuyerHistory, CreateBuyerInput, UpdateBuyerInput } from "./types"

// In-memory storage (in a real app, this would be a database)
const buyers: Buyer[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    budget: 450000,
    preferredLocation: "Downtown",
    propertyType: "Condo",
    status: "qualified",
    source: "Website",
    notes: "Looking for 2-bedroom condo with parking",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    userId: "user1",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "+1-555-0456",
    budget: 650000,
    preferredLocation: "Suburbs",
    propertyType: "House",
    status: "viewing",
    source: "Referral",
    notes: "Family of 4, needs good schools nearby",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-22"),
    userId: "user1",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.davis@email.com",
    phone: "+1-555-0789",
    budget: 300000,
    preferredLocation: "City Center",
    propertyType: "Apartment",
    status: "new",
    source: "Social Media",
    notes: "First-time buyer, flexible on location",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
    userId: "user1",
  },
]

let buyerHistory: BuyerHistory[] = [
  {
    id: "1",
    buyerId: "1",
    action: "Created lead",
    details: "Initial contact from website form",
    createdAt: new Date("2024-01-15"),
    userId: "user1",
  },
  {
    id: "2",
    buyerId: "1",
    action: "Status changed",
    details: "Changed from new to qualified after phone call",
    createdAt: new Date("2024-01-20"),
    userId: "user1",
  },
  {
    id: "3",
    buyerId: "2",
    action: "Created lead",
    details: "Referral from existing client",
    createdAt: new Date("2024-01-10"),
    userId: "user1",
  },
]

// Helper functions for data operations
export function getAllBuyers(): Buyer[] {
  return buyers
}

export function getBuyerById(id: string): Buyer | undefined {
  return buyers.find((buyer) => buyer.id === id)
}

export function createBuyer(input: CreateBuyerInput): Buyer {
  const newBuyer: Buyer = {
    id: Date.now().toString(),
    ...input,
    status: input.status || "new",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user1", // In a real app, this would come from auth
  }

  buyers.push(newBuyer)

  // Add history entry
  addBuyerHistory(newBuyer.id, "Created lead", "New buyer lead created")

  return newBuyer
}

export function updateBuyer(input: UpdateBuyerInput): Buyer | null {
  const index = buyers.findIndex((buyer) => buyer.id === input.id)
  if (index === -1) return null

  const oldBuyer = buyers[index]
  const updatedBuyer = {
    ...oldBuyer,
    ...input,
    updatedAt: new Date(),
  }

  buyers[index] = updatedBuyer

  // Add history entry for status changes
  if (oldBuyer.status !== updatedBuyer.status) {
    addBuyerHistory(updatedBuyer.id, "Status changed", `Changed from ${oldBuyer.status} to ${updatedBuyer.status}`)
  }

  return updatedBuyer
}

export function deleteBuyer(id: string): boolean {
  const index = buyers.findIndex((buyer) => buyer.id === id)
  if (index === -1) return false

  buyers.splice(index, 1)
  // Also remove related history
  buyerHistory = buyerHistory.filter((history) => history.buyerId !== id)

  return true
}

export function getBuyerHistory(buyerId: string): BuyerHistory[] {
  return buyerHistory
    .filter((history) => history.buyerId === buyerId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function addBuyerHistory(buyerId: string, action: string, details?: string): void {
  const newHistory: BuyerHistory = {
    id: Date.now().toString(),
    buyerId,
    action,
    details,
    createdAt: new Date(),
    userId: "user1", // In a real app, this would come from auth
  }

  buyerHistory.push(newHistory)
}

export function searchBuyers(query: string): Buyer[] {
  const lowercaseQuery = query.toLowerCase()
  return buyers.filter(
    (buyer) =>
      buyer.firstName.toLowerCase().includes(lowercaseQuery) ||
      buyer.lastName.toLowerCase().includes(lowercaseQuery) ||
      buyer.email.toLowerCase().includes(lowercaseQuery) ||
      buyer.phone?.includes(query) ||
      buyer.preferredLocation?.toLowerCase().includes(lowercaseQuery) ||
      buyer.propertyType?.toLowerCase().includes(lowercaseQuery) ||
      buyer.source?.toLowerCase().includes(lowercaseQuery),
  )
}
