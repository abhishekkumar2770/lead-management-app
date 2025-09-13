import type { Buyer, CreateBuyerInput } from "./types"

export function exportBuyersToCSV(buyers: Buyer[]): string {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Budget",
    "Preferred Location",
    "Property Type",
    "Status",
    "Source",
    "Notes",
    "Created Date",
    "Updated Date",
  ]

  const csvRows = [
    headers.join(","),
    ...buyers.map((buyer) =>
      [
        escapeCSVField(buyer.firstName),
        escapeCSVField(buyer.lastName),
        escapeCSVField(buyer.email),
        escapeCSVField(buyer.phone || ""),
        buyer.budget || "",
        escapeCSVField(buyer.preferredLocation || ""),
        escapeCSVField(buyer.propertyType || ""),
        escapeCSVField(buyer.status),
        escapeCSVField(buyer.source || ""),
        escapeCSVField(buyer.notes || ""),
        buyer.createdAt.toISOString().split("T")[0],
        buyer.updatedAt.toISOString().split("T")[0],
      ].join(","),
    ),
  ]

  return csvRows.join("\n")
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function parseCSVToBuyers(csvContent: string): CreateBuyerInput[] {
  const lines = csvContent.split("\n").filter((line) => line.trim())
  if (lines.length < 2) {
    throw new Error("CSV file must contain at least a header row and one data row")
  }

  const headers = parseCSVRow(lines[0])
  const buyers: CreateBuyerInput[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i])
    if (values.length === 0) continue // Skip empty rows

    const buyer: CreateBuyerInput = {
      firstName: "",
      lastName: "",
      email: "",
    }

    headers.forEach((header, index) => {
      const value = values[index]?.trim() || ""

      switch (header.toLowerCase().trim()) {
        case "first name":
          buyer.firstName = value
          break
        case "last name":
          buyer.lastName = value
          break
        case "email":
          buyer.email = value
          break
        case "phone":
          buyer.phone = value || undefined
          break
        case "budget":
          buyer.budget = value ? Number.parseFloat(value) : undefined
          break
        case "preferred location":
          buyer.preferredLocation = value || undefined
          break
        case "property type":
          if (value && ["House", "Condo", "Apartment", "Townhouse", "Other"].includes(value)) {
            buyer.propertyType = value as any
          }
          break
        case "status":
          if (
            value &&
            ["new", "contacted", "qualified", "viewing", "offer", "closed", "lost"].includes(value.toLowerCase())
          ) {
            buyer.status = value.toLowerCase() as any
          }
          break
        case "source":
          buyer.source = value || undefined
          break
        case "notes":
          buyer.notes = value || undefined
          break
      }
    })

    // Validate required fields
    if (!buyer.firstName || !buyer.lastName || !buyer.email) {
      throw new Error(`Row ${i + 1}: Missing required fields (First Name, Last Name, Email)`)
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(buyer.email)) {
      throw new Error(`Row ${i + 1}: Invalid email format`)
    }

    buyers.push(buyer)
  }

  return buyers
}

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

function parseCSVRow(row: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]

    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"'
        i++ // Skip next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

export function generateCSVTemplate(): string {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Budget",
    "Preferred Location",
    "Property Type",
    "Status",
    "Source",
    "Notes",
  ]

  const sampleRow = [
    "John",
    "Smith",
    "john.smith@email.com",
    "+1-555-0123",
    "450000",
    "Downtown",
    "Condo",
    "new",
    "Website",
    "Looking for 2-bedroom condo",
  ]

  return [headers.join(","), sampleRow.join(",")].join("\n")
}
