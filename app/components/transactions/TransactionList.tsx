"use client"
import { Trash2, Edit2 } from "lucide-react"

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
  onEdit: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  const chronologicalTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  const sortedTransactions = [...chronologicalTransactions].reverse()

  const getBalanceBeforeTransaction = (currentTransaction: Transaction) => {
    let balance = 0
    for (const transaction of chronologicalTransactions) {
      if (transaction.id === currentTransaction.id) break
      balance += transaction.type === "income" ? transaction.amount : -transaction.amount
    }
    return balance
  }

  return (
    <div className="space-y-4">
      {sortedTransactions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTransactions.map((transaction) => {
            const balanceBefore = getBalanceBeforeTransaction(transaction)
            const balanceAfter =
              transaction.type === "income"
                ? balanceBefore + transaction.amount
                : balanceBefore - transaction.amount

            return (
              <div
                key={transaction.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${transaction.type === "income"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}
                  >
                    {transaction.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 pt-3 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Category</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {transaction.category}
                    </p>
                  </div>



                  <div className="border-t border-dashed border-gray-300 dark:border-slate-800 my-2"></div>

                  {/* Amount */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Amount</span>
                    <span
                      className={`text-lg font-bold ${transaction.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                        }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  {/* Note */}
                  {transaction.note && (
                    <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Note</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                        {transaction.note}
                      </p>
                    </div>
                  )}
                  {/* Balance Info */}
                  <div className="flex items-center justify-between text-xs mt-3">
                    <div>
                      <p className="text-muted-foreground">Before</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(balanceBefore)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-right">After</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                        {formatCurrency(balanceAfter)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-10 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-1.5 bg-slate-50 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700"
                    title="Edit transaction"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-1.5 bg-slate-50 hover:bg-rose-100 rounded-lg transition-colors text-rose-600 dark:bg-slate-800 dark:hover:bg-slate-700"
                    title="Delete transaction"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No transactions yet</p>
      )}
    </div>
  )
}
