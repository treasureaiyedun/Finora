"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/Select"
import { Textarea } from "@/app/components/ui/Textarea"
import { Label } from "@/app/components/ui/Label"
import { CalendarIcon } from "lucide-react"

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

// yyyy-mm-dd  ↔  dd/mm/yyyy
const toDisplay = (iso: string): string => {
  if (!iso) return ""
  if (iso.includes("/")) return iso
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}
const toISO = (display: string): string => {
  if (!display) return ""
  if (display.includes("-")) return display
  const [d, m, y] = display.split("/")
  return `${y}-${m}-${d}`
}
const todayISO = (): string => new Date().toISOString().split("T")[0]

export function TransactionForm({ onSubmit, initialData, submitLabel = "Add Transaction" }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">(initialData?.type || "expense")
  const [category, setCategory] = useState(initialData?.category || "")
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "")
  const [dateISO, setDateISO] = useState(
    initialData?.date ? toISO(initialData.date) : todayISO()
  )
  const [note, setNote] = useState(initialData?.note || "")
  const [currency, setCurrency] = useState("₦")
  const dateRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialData) {
      setType(initialData.type)
      setCategory(initialData.category)
      setAmount(initialData.amount.toString())
      setDateISO(toISO(initialData.date))
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
      date: toDisplay(dateISO),
      note,
    })
    if (!initialData) {
      setCategory("")
      setAmount("")
      setNote("")
      setDateISO(todayISO())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="type" className="text-sm font-medium">Type</Label>
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
        <Label htmlFor="category" className="text-sm font-medium">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="h-10">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES[type].map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount" className="text-sm font-medium">Amount ({currency})</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
          className="h-10"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date" className="text-sm font-medium">Date</Label>
        {/* Clicking anywhere on this row opens the picker */}
        <div
          className="relative flex items-center h-10 w-full rounded-md border border-input bg-background px-3 cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          onClick={() => dateRef.current?.showPicker()}
        >
          <span className="flex-1 text-sm text-foreground select-none pointer-events-none">
            {dateISO ? toDisplay(dateISO) : "DD/MM/YYYY"}
          </span>
          <CalendarIcon size={16} className="text-muted-foreground shrink-0 pointer-events-none" />
          {/* Native date input covers the whole row so the picker opens reliably */}
          <input
            ref={dateRef}
            id="date"
            type="date"
            lang="en-GB"
            value={dateISO}
            onChange={(e) => setDateISO(e.target.value)}
            required
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="note" className="text-sm font-medium">Note (Optional)</Label>
        <Textarea
          id="note"
          placeholder="Add a note about this transaction"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={!category || !amount}
        className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg mt-2"
      >
        {submitLabel}
      </Button>
    </form>
  )
}