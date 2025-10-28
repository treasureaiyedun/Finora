"use client"

import { Card } from "@/app/components/ui/Card"

interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

interface GoalsOverviewProps {
  goals: Goal[]
}

export function GoalsOverview({ goals }: GoalsOverviewProps) {
  const topGoals = goals.slice(0, 3)

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Top Goals</h3>
      <div className="space-y-4">
        {topGoals.length > 0 ? (
          topGoals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount)
            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground truncate">{goal.title}</p>
                  <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-cyan-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </p>
              </div>
            )
          })
        ) : (
          <p className="text-muted-foreground text-center py-4">No goals yet</p>
        )}
      </div>
    </Card>
  )
}
