"use client"

import { useEffect, useState } from "react"
import { DashboardSummary } from "@/app/components/dashboard"
import { RecentTransactions } from "@/app/components/dashboard"
import { SpendingChart } from "@/app/components/dashboard"
import { useFinanceStore } from "@/lib/store"

interface DashboardProps {
  onNavigate?: (page: "transactions") => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { transactions, fetchTransactions, fetchGoals } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchTransactions()
    fetchGoals()
  }, [fetchTransactions, fetchGoals])

  if (!mounted) return null

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <DashboardSummary transactions={transactions} />

      <SpendingChart transactions={transactions} />

      <RecentTransactions
        transactions={transactions.slice(0, 5)}
        onSeeMore={onNavigate ? () => onNavigate("transactions") : undefined}
      />
    </div>
  )
}
