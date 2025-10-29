"use client"

import { useFinanceStore } from "@/lib/store"
import { useState, useEffect } from "react"
import { TransactionList } from "@/app/components/transactions"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  note: string
}

export function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="p-6 space-y-6">
      <TransactionList
        transactions={transactions}
        onDelete={deleteTransaction}
        onEdit={updateTransaction}
        onAdd={addTransaction}
      />
    </div>
  )
}
