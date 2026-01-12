"use client"

import { useEffect, useState } from "react"
import { BalanceTrend, ExpensesChart, IncomeChart } from "@/app/components/analytics"
import { useFinanceStore } from "@/lib/store"

export function Analytics() {
  const { transactions } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights into your financial patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeChart />
        <ExpensesChart />
      </div>

      <BalanceTrend transactions={transactions} />
    </div>
  )
}
