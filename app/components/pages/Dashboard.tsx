"use client"

import { useEffect, useState } from "react"
import { DashboardSummary } from "@/app/components/dashboard"
import { RecentTransactions } from "@/app/components/dashboard"
import { SpendingChart } from "@/app/components/dashboard"
import { useFinanceStore } from "@/lib/store"

export function Dashboard() {
  const { transactions } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="p-6 space-y-6">
      <DashboardSummary transactions={transactions} />

      <SpendingChart transactions={transactions} />

      <RecentTransactions transactions={transactions.slice(0, 5)} />
    </div>
  )
}
