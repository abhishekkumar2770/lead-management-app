"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HistoryTimeline } from "@/components/history/history-timeline"
import type { Buyer } from "@/lib/types"
import { ArrowLeft, Edit, Mail, Phone, MapPin, DollarSign, Home, Calendar, User } from "lucide-react"

interface BuyerDetailsProps {
  buyer: Buyer
  onEdit: () => void
  onBack: () => void
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

export function BuyerDetails({ buyer, onEdit, onBack }: BuyerDetailsProps) {
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary">
              {buyer.firstName} {buyer.lastName}
            </h2>
            <p className="text-muted-foreground">Buyer Details</p>
          </div>
        </div>
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Buyer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{buyer.email}</p>
                  </div>
                </div>
                {buyer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{buyer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{formatCurrency(buyer.budget)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium">{buyer.propertyType || "Not specified"}</p>
                  </div>
                </div>
                {buyer.preferredLocation && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Location</p>
                      <p className="font-medium">{buyer.preferredLocation}</p>
                    </div>
                  </div>
                )}
                {buyer.source && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="font-medium">{buyer.source}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {buyer.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{buyer.notes}</p>
              </CardContent>
            </Card>
          )}

          <HistoryTimeline buyerId={buyer.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                <Badge className={statusColors[buyer.status]} variant="secondary">
                  {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{formatDate(buyer.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">{formatDate(buyer.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
