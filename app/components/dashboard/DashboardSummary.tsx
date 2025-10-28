"use client"

import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import { StatCard } from "./StatCard"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  note: string
}

interface SummaryProps {
  transactions: Transaction[]
}

export function DashboardSummary({ transactions }: SummaryProps) {
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = income - expenses
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Balance"
        value={formatCurrency(balance)}
        description="Current balance"
        icon={Wallet}
        variant="accent"
      />
      <StatCard
        title="Total Income"
        value={formatCurrency(income)}
        description="All time income"
        icon={TrendingUp}
        variant="success"
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(expenses)}
        description="All time expenses"
        icon={TrendingDown}
        variant="warning"
      />
      <StatCard
        title="Savings Rate"
        value={`${savingsRate.toFixed(1)}%`}
        description="Income saved"
        icon={PiggyBank}
        variant="default"
      />
    </div>
  )
}
