"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/Button"
import { TransactionForm } from "@/app/components/transactions"
import { TransactionList } from "@/app/components/transactions"
import { useFinanceStore } from "@/lib/store"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/Dialog"

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
  const [showForm, setShowForm] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleFormSubmit = (data: {
    type: "income" | "expense"
    category: string
    amount: number
    date: string
    note: string
  }) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data)
      setEditingTransaction(null)
    } else {
      addTransaction(data)
    }
    setShowForm(false)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
            All Transactions
          </h2>
          <p className="text-sm text-muted-foreground">
            Complete history of your financial activities
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingTransaction(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg justify-center md:justify-start max-w-max mx-auto md:mx-0 cursor-pointer"
        >
          <Plus size={20} />
          Add Transaction
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-border rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingTransaction ? "Update your transaction details" : "Record a new income or expense transaction"}
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleFormSubmit}
            initialData={editingTransaction || undefined}
            submitLabel={editingTransaction ? "Update Transaction" : "Add Transaction"}
          />
        </DialogContent>
      </Dialog>

      <TransactionList transactions={transactions} onDelete={deleteTransaction} onEdit={handleEdit} />
    </div>
  )
}
