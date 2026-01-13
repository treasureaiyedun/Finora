"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/Button"
import { GoalCard, GoalForm } from "@/app/components/goals/"
import { useFinanceStore } from "@/lib/store"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/Dialog"

export function Goals() {
  const { goals, addGoal, deleteGoal, updateGoal } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [viewingGoal, setViewingGoal] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleUpdateProgress = (goalId: string, amount: number) => {
    const goal = goals.find((g) => g.id === goalId)
    if (goal) {
      updateGoal(goalId, {
        ...goal,
        currentAmount: goal.currentAmount + amount,
      })
    }
  }

  const handleEditSubmit = (data: any) => {
    if (editingGoal) {
      updateGoal(editingGoal, data)
      setEditingGoal(null)
      setShowForm(false)
    }
  }

  const currentEditingGoal = editingGoal ? goals.find((g) => g.id === editingGoal) : null
  const viewingGoalData = viewingGoal ? goals.find((g) => g.id === viewingGoal) : null

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Goals</h1>
          <p className="text-muted-foreground mt-1">Set and track your savings goals</p>
        </div>
        <Button
          onClick={() => {
            setEditingGoal(null)
            setShowForm(true)
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 px-6 rounded-lg cursor-pointer"
        >
          <Plus size={20} />
          Add Goal
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-border rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingGoal ? "Edit Goal" : "Create New Goal"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingGoal
                ? "Update your financial goal details"
                : "Set a financial goal to track your savings progress"}
            </DialogDescription>
          </DialogHeader>
          <GoalForm
            initialData={
              currentEditingGoal
                ? {
                    title: currentEditingGoal.title,
                    targetAmount: currentEditingGoal.targetAmount,
                    currentAmount: currentEditingGoal.currentAmount,
                    deadline: currentEditingGoal.deadline,
                  }
                : undefined
            }
            onSubmit={(data) => {
              if (editingGoal) {
                handleEditSubmit(data)
              } else {
                addGoal(data)
                setShowForm(false)
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {viewingGoalData && (
        <Dialog open={!!viewingGoal} onOpenChange={() => setViewingGoal(null)}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-border rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">{viewingGoalData.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Deadline</p>
                <p className="text-lg font-semibold text-foreground">{formatDate(viewingGoalData.deadline)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Progress</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.round(Math.min((viewingGoalData.currentAmount / viewingGoalData.targetAmount) * 100, 100))}%
                </p>
              </div>

              <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Current Amount</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(viewingGoalData.currentAmount)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Target Amount</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(viewingGoalData.targetAmount)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Remaining Amount</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(Math.max(viewingGoalData.targetAmount - viewingGoalData.currentAmount, 0))}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onDelete={() => deleteGoal(goal.id)}
              onEdit={() => {
                setEditingGoal(goal.id)
                setShowForm(true)
              }}
              onUpdateProgress={(amount) => handleUpdateProgress(goal.id, amount)}
              onViewDetails={() => setViewingGoal(goal.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No goals yet. Create one to get started!</p>
        </div>
      )}
    </div>
  )
}
