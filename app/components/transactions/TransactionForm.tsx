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
  const [currency, setCurrency] = useState("₦")

  useEffect(() => {
    if (initialData) {
      setType(initialData.type)
      setCategory(initialData.category)
      setAmount(initialData.amount.toString())
      setDate(initialData.date)
      setNote(initialData.note)
    }
  }, [initialData])

  useEffect(() => {
    const saved = localStorage.getItem("currency")
    if (saved) setCurrency(saved)

    const handleCurrencyChange = () => {
      const updated = localStorage.getItem("currency")
      if (updated) setCurrency(updated)
    }

    window.addEventListener("currencyChanged", handleCurrencyChange)
    return () => window.removeEventListener("currencyChanged", handleCurrencyChange)
  }, [])

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
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="type" className="text-sm font-medium">
          Type
        </Label>
        <Select value={type} onValueChange={(value) => setType(value as "income" | "expense")}>
          <SelectTrigger id="type" className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Category
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="h-10">
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

      <div className="grid gap-2">
        <Label htmlFor="note" className="text-sm font-medium">
          Note (Optional)
        </Label>
        <Textarea
          id="note"
          placeholder="Add a note about this transaction"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          Amount ({currency})
        </Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
          className="h-10"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date" className="text-sm font-medium">
          Date
        </Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10" />
      </div>

      <Button
        type="submit"
        className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg mt-2"
      >
        {submitLabel}
      </Button>
    </form>
  )
}
