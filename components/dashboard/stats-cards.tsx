"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllBuyers } from "@/lib/data"
import { Users, UserCheck, Eye, TrendingUp } from "lucide-react"

export function StatsCards() {
  const buyers = getAllBuyers()

  const stats = {
    total: buyers.length,
    qualified: buyers.filter((b) => b.status === "qualified").length,
    viewing: buyers.filter((b) => b.status === "viewing").length,
    closed: buyers.filter((b) => b.status === "closed").length,
  }

  const cards = [
    {
      title: "Total Leads",
      value: stats.total,
      icon: Users,
      description: "All buyer leads",
      color: "text-blue-600",
    },
    {
      title: "Qualified",
      value: stats.qualified,
      icon: UserCheck,
      description: "Ready to view properties",
      color: "text-green-600",
    },
    {
      title: "Viewing",
      value: stats.viewing,
      icon: Eye,
      description: "Currently viewing properties",
      color: "text-purple-600",
    },
    {
      title: "Closed",
      value: stats.closed,
      icon: TrendingUp,
      description: "Successfully closed deals",
      color: "text-emerald-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const IconComponent = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <IconComponent className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
