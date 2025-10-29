"use client"

import { useState } from "react"
import { Card, Button } from "@/app/components/ui"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/Dialog"
import { TransactionForm } from "@/app/components/transactions"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  note: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
  onEdit: (id: string, data: Omit<Transaction, "id">) => void
  onAdd: (data: Omit<Transaction, "id">) => void
}

export function TransactionList({ transactions, onDelete, onEdit, onAdd }: TransactionListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  const handleFormSubmit = (data: {
    type: "income" | "expense"
    category: string
    amount: number
    date: string
    note: string
  }) => {
    if (editingTransaction) {
      onEdit(editingTransaction.id, data)
      setEditingTransaction(null)
    } else {
      onAdd(data)
    }
    setShowForm(false)
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">All Transactions</h2>
          <p className="text-sm text-muted-foreground">Complete history of your financial activities</p>
        </div>

        <Button
          onClick={() => {
            setEditingTransaction(null)
            setShowForm(true)
          }}
          className="gap-2 bg-indigo-500 hover:bg-indigo-700 text-white font-semibold h-11 px-6 rounded-lg cursor-pointer"
        >
          <Plus size={20} />
          Add Transaction
        </Button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
            >
              <div className="flex items-center gap-4 flex-1">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                    transaction.type === "income"
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                  }`}
                >
                  {transaction.type}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{transaction.category}</p>
                  <p className="text-sm text-muted-foreground">{transaction.note}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingTransaction(transaction)
                    setShowForm(true)
                  }}
                  className="p-2 hover:bg-indigo-600/10 rounded-lg transition-colors text-gray-600 dark:text-indigo-400 cursor-pointer"
                  title="Edit transaction"
                >
                  <Edit2 size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(transaction.id)
                  }}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive cursor-pointer"
                  title="Delete transaction"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">No transactions yet</p>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-border rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingTransaction
                ? "Update your transaction details"
                : "Record a new income or expense transaction"}
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleFormSubmit}
            initialData={editingTransaction || undefined}
            submitLabel={editingTransaction ? "Update Transaction" : "Add Transaction"}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
