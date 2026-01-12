"use client"

import { Card } from "@/app/components/ui/Card"
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  note: string
}

interface BalanceTrendProps {
  transactions: Transaction[]
}

export function BalanceTrend({ transactions }: BalanceTrendProps) {
  const monthlyData = transactions.reduce(
    (acc, t) => {
      const date = new Date(t.date)
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      const existing = acc.find((item) => item.month === monthKey)
      if (existing) {
        if (t.type === "income") {
          existing.income += t.amount
        } else {
          existing.expenses += t.amount
        }
      } else {
        acc.push({
          month: monthKey,
          income: t.type === "income" ? t.amount : 0,
          expenses: t.type === "expense" ? t.amount : 0,
        })
      }
      return acc
    },
    [] as Array<{ month: string; income: number; expenses: number }>,
  )

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const formatYAxisLabel = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-border">
          <p className="font-semibold text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-1">Monthly Trends</h3>
      <p className="text-sm text-muted-foreground mb-6">Income vs Expenses over time</p>
      {monthlyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" width={60} tickFormatter={formatYAxisLabel} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              fill="url(#incomeGradient)"
              strokeWidth={2}
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f59e0b"
              fill="url(#expensesGradient)"
              strokeWidth={2}
              name="Expenses"
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center text-muted-foreground">No data available</div>
      )}
    </Card>
  )
}
