"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/Button"
import { GoalCard, GoalForm } from "@/app/components/goals"
import { useFinanceStore } from "@/lib/store"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/Dialog"

export function Goals() {
  const { goals, addGoal, deleteGoal, updateGoal } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)

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
