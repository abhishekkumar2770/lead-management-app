"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddHistoryDialog } from "./add-history-dialog"
import { getBuyerHistory } from "@/lib/data"
import type { BuyerHistory } from "@/lib/types"
import {
  Plus,
  Clock,
  User,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface HistoryTimelineProps {
  buyerId: string
  onHistoryAdded?: () => void
}

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Phone call": Phone,
  "Email sent": Mail,
  "Meeting scheduled": Calendar,
  "Property viewing": FileText,
  "Offer submitted": FileText,
  "Contract signed": CheckCircle,
  "Follow-up required": AlertCircle,
  "Status updated": User,
  "Documents received": FileText,
  Other: MessageSquare,
}

export function HistoryTimeline({ buyerId, onHistoryAdded }: HistoryTimelineProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [history, setHistory] = useState<BuyerHistory[]>(() => getBuyerHistory(buyerId))

  const refreshHistory = () => {
    setHistory(getBuyerHistory(buyerId))
    onHistoryAdded?.()
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24)
      return `${days} day${days !== 1 ? "s" : ""} ago`
    } else {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    }
  }

  const getActionIcon = (action: string) => {
    const IconComponent = actionIcons[action] || MessageSquare
    return IconComponent
  }

  const getActionColor = (action: string): string => {
    switch (action) {
      case "Phone call":
      case "Email sent":
        return "bg-blue-100 text-blue-800"
      case "Meeting scheduled":
      case "Property viewing":
        return "bg-purple-100 text-purple-800"
      case "Offer submitted":
        return "bg-orange-100 text-orange-800"
      case "Contract signed":
        return "bg-green-100 text-green-800"
      case "Follow-up required":
        return "bg-yellow-100 text-yellow-800"
      case "Status updated":
        return "bg-cyan-100 text-cyan-800"
      case "Documents received":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activity History
            </CardTitle>
            <CardDescription>Track all interactions and updates</CardDescription>
          </div>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No activity recorded yet</p>
            <Button variant="outline" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => {
              const IconComponent = getActionIcon(item.action)
              const isLast = index === history.length - 1

              return (
                <div key={item.id} className="relative">
                  {/* Timeline line */}
                  {!isLast && <div className="absolute left-6 top-12 w-0.5 h-full bg-border" />}

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className={getActionColor(item.action)}>
                          {item.action}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</span>
                      </div>

                      {item.details && <p className="text-sm text-foreground leading-relaxed">{item.details}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>

      <AddHistoryDialog
        buyerId={buyerId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={refreshHistory}
      />
    </Card>
  )
}
