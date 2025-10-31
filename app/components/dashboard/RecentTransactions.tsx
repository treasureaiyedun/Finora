"use client"

import { Card } from "@/app/components/ui/Card"
interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  note: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {

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

  return (
    <Card className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Recent Transactions</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">Your latest financial activities</p>
      <div className="space-y-2 sm:space-y-3">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-3 sm:p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
            >
              {/* Mobile Layout */}
              <div className="flex sm:hidden items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mb-2 ${
                      transaction.type === "income"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                    }`}
                  >
                    {transaction.type}
                  </span>
                  <p className="font-semibold text-foreground text-sm">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{transaction.note}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(transaction.date)}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p
                    className={`font-bold text-base whitespace-nowrap ${
                      transaction.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                        transaction.type === "income"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </div>
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
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8 text-sm sm:text-base">No transactions yet</p>
        )}
      </div>
    </Card>
  )
}