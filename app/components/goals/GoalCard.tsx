"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/Card"
import { Trash2, Edit2, TrendingUp } from "lucide-react"
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
  onViewDetails?: () => void
}

export function GoalCard({ goal, onDelete, onEdit, onUpdateProgress, onViewDetails }: GoalCardProps) {
  const [progressInput, setProgressInput] = useState("")
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0)

  const handleProgressUpdate = () => {
    const value = Number.parseFloat(progressInput)
    if (value > 0 && onUpdateProgress) {
      onUpdateProgress(value)
      setProgressInput("")
    }
  }

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card
      onClick={onViewDetails}
      className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-base sm:text-lg font-bold text-foreground truncate">{goal.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {daysLeft > 0 ? `${daysLeft} days remaining` : "Deadline passed"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Due: {formatDate(goal.deadline)}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-2 hover:bg-indigo-600/10 rounded-lg transition-colors text-indigo-600"
            aria-label="Edit goal"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
            aria-label="Delete goal"
          >
            <Trash2 size={16} />
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

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">Current</p>
            <p
              className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate text-xs sm:text-sm"
              title={formatCurrency(goal.currentAmount)}
            >
              {formatCurrency(goal.currentAmount)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">Target</p>
            <p
              className="font-bold text-foreground mt-1 truncate text-xs sm:text-sm"
              title={formatCurrency(goal.targetAmount)}
            >
              {formatCurrency(goal.targetAmount)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">Remaining</p>
            <p
              className="font-bold text-orange-600 dark:text-orange-400 mt-1 truncate text-xs sm:text-sm"
              title={formatCurrency(remaining)}
            >
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
          <label className="text-sm font-medium text-muted-foreground block mb-2">Update Progress</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter amount"
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleProgressUpdate()
              }}
              className="flex-1 h-10 px-3 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0"
            />
            <button
              onClick={handleProgressUpdate}
              disabled={!progressInput || Number(progressInput) <= 0}
              className="flex items-center gap-1.5 px-3 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shrink-0"
            >
              <TrendingUp size={14} />
              <span className="hidden sm:inline">Update</span>
              <span className="sm:hidden">+</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
