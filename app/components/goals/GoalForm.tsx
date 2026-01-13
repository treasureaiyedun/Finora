"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Label } from "@/app/components/ui/Label"

interface GoalFormProps {
  onSubmit: (data: {
    title: string
    targetAmount: number
    currentAmount: number
    deadline: string
  }) => void
  initialData?: {
    title: string
    targetAmount: number
    currentAmount: number
    deadline: string
  }
}

export function GoalForm({ onSubmit, initialData }: GoalFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount.toString() || "")
  const [currentAmount, setCurrentAmount] = useState(initialData?.currentAmount.toString() || "")
  const [deadline, setDeadline] = useState(initialData?.deadline || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !targetAmount || !deadline) return

    onSubmit({
      title,
      targetAmount: Number.parseFloat(targetAmount),
      currentAmount: Number.parseFloat(currentAmount) || 0,
      deadline,
    })

    setTitle("")
    setTargetAmount("")
    setCurrentAmount("")
    setDeadline("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-base font-semibold text-foreground mb-3 block">Goal Title</Label>
        <Input
          type="text"
          placeholder="e.g., Save for MacBook"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-11 bg-white dark:bg-slate-800 border border-border rounded-lg text-base"
        />
      </div>

      <div>
        <Label className="text-base font-semibold text-foreground mb-3 block">Target Amount (₦)</Label>
        <Input
          type="number"
          placeholder="0.00"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          step="0.01"
          min="0"
          className="h-11 bg-white dark:bg-slate-800 border border-border rounded-lg text-base"
        />
      </div>

      <div>
        <Label className="text-base font-semibold text-foreground mb-3 block">Current Amount (₦)</Label>
        <Input
          type="number"
          placeholder="0.00"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          step="0.01"
          min="0"
          className="h-11 bg-white dark:bg-slate-800 border border-border rounded-lg text-base"
        />
      </div>

      <div>
        <Label className="text-base font-semibold text-foreground mb-3 block">Deadline</Label>
        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="h-11 bg-white dark:bg-slate-800 border border-border rounded-lg text-base"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer"
      >
        {initialData ? "Update Goal" : "Create Goal"}
      </Button>
    </form>
  )
}
