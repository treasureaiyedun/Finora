"use client"

import { Card } from "@/app/components/ui/Card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  note: string
}

interface SpendingChartProps {
  transactions: Transaction[]
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const incomeByCategory = transactions
    .filter((t) => t.type === "income")
    .reduce(
      (acc, t) => {
        const existing = acc.find((item) => item.name === t.category)
        if (existing) {
          existing.value += t.amount
        } else {
          acc.push({ name: t.category, value: t.amount })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>,
    )

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const existing = acc.find((item) => item.name === t.category)
        if (existing) {
          existing.value += t.amount
        } else {
          acc.push({ name: t.category, value: t.amount })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>,
    )

  const INCOME_COLOR = "#6366f1"
  const EXPENSE_COLORS = ["#f59e0b", "#a855f7", "#ef4444", "#06b6d4", "#10b981", "#8b5cf6"]

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-border">
          <p className="font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income by Category */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-1">Income by Category</h3>
        <p className="text-sm text-muted-foreground mb-6">Breakdown of your income sources</p>
        {incomeByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={incomeByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill={INCOME_COLOR}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                <Cell fill={INCOME_COLOR} />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">No income data available</div>
        )}
      </Card>

      {/* Expenses by Category */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-1">Expenses by Category</h3>
        <p className="text-sm text-muted-foreground mb-6">Where your money is going</p>
        {expensesByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">No expense data available</div>
        )}
      </Card>
    </div>
  )
}
