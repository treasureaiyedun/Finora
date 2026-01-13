"use client"

import { Card } from "@/app/components/ui/Card"
import { Trash2, Edit2 } from "lucide-react"
import { Progress } from "@/app/components/ui/Progress"

interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

interface GoalCardProps {
  goal: Goal
  onDelete: () => void
  onEdit: () => void
  onUpdateProgress?: (amount: number) => void
}

export function GoalCard({ goal, onDelete, onEdit, onUpdateProgress }: GoalCardProps) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0)

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">{goal.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {daysLeft > 0 ? `${daysLeft} days remaining` : "Deadline passed"}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 hover:bg-indigo-600/10 rounded-lg transition-colors text-indigo-600 cursor-pointer">
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Progress</p>
            <p className="text-sm font-bold text-foreground">{Math.round(progress)}%</p>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Current</p>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(goal.currentAmount)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Target</p>
            <p className="font-bold text-foreground mt-1">{formatCurrency(goal.targetAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Remaining</p>
            <p className="font-bold text-orange-600 dark:text-orange-400 mt-1">{formatCurrency(remaining)}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <label className="text-sm font-medium text-muted-foreground block mb-2">Update Progress</label>
          <input
            type="number"
            placeholder="Enter amount"
            defaultValue=""
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = Number.parseFloat((e.target as HTMLInputElement).value)
                if (value > 0 && onUpdateProgress) {
                  onUpdateProgress(value)
                  ;(e.target as HTMLInputElement).value = ""
                }
              }
            }}
            className="w-full h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>
    </Card>
  )
}
