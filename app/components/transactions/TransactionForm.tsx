"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select"
import { Textarea } from "@/app/components/ui/Textarea"
import { Label } from "@/app/components/ui/Label"

interface TransactionFormProps {
  onSubmit: (data: {
    type: "income" | "expense"
    category: string
    amount: number
    date: string
    note: string
  }) => void
  initialData?: {
    type: "income" | "expense"
    category: string
    amount: number
    date: string
    note: string
  }
  submitLabel?: string
}

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Bonus", "Other"],
  expense: ["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Health", "Other"],
}

export function TransactionForm({ onSubmit, initialData, submitLabel = "Add Transaction" }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">(initialData?.type || "expense")
  const [category, setCategory] = useState(initialData?.category || "")
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "")
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0])
  const [note, setNote] = useState(initialData?.note || "")

  useEffect(() => {
    if (initialData) {
      setType(initialData.type)
      setCategory(initialData.category)
      setAmount(initialData.amount.toString())
      setDate(initialData.date)
      setNote(initialData.note)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !amount) return

    onSubmit({
      type,
      category,
      amount: Number.parseFloat(amount),
      date,
      note,
    })

    if (!initialData) {
      setCategory("")
      setAmount("")
      setNote("")
      setDate(new Date().toISOString().split("T")[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-base font-semibold text-foreground mb-3 block">Type</Label>
        <Select value={type} onValueChange={(value) => setType(value as "income" | "expense")}>
          <SelectTrigger className="w-full h-11 bg-white dark:bg-slate-800 border border-border rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-semibold text-foreground mb-3 block">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full h-11 bg-white dark:bg-slate-800 border border-border rounded-lg">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES[type].map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-semibold text-foreground mb-3 block">Amount (₦)</Label>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
          className="h-11 bg-white dark:bg-slate-800 border border-border rounded-lg"
        />
      </div>

      <div>
        <Label className="text-base font-semibold text-foreground mb-3 block">Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-11 bg-white dark:bg-slate-800 border border-border rounded-lg"
        />
      </div>

      <div>
        <Label className="text-base font-semibold text-foreground mb-3 block">Note (Optional)</Label>
        <Textarea
          placeholder="Add a note about this transaction"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-border rounded-lg min-h-24"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
      >
        {submitLabel}
      </Button>
    </form>
  )
}
