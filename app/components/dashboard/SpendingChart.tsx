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
      [] as Array<{ name: string; value: number }>
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
      [] as Array<{ name: string; value: number }>
    )

  const INCOME_COLORS = [
    "#6366f1", // Indigo
    "#e263a5", // Cyan
    "#10b981", // Emerald
    "#84cc16", // Lime
    "#f59e0b", // Amber
    "#ec4899", // Pink
  ]

  const EXPENSE_COLORS = [
    "#f59e0b", // Amber
    "#a855f7", // Purple
    "#ef4444", // Red
    "#06b6d4", // Cyan
    "#10b981", // Green
    "#8b5cf6", // Violet
  ]

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-border">
          <p className="font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income by Category */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-1">
          Income by Category
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Breakdown of your income sources
        </p>
        {incomeByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={incomeByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {incomeByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-income-${index}`}
                    fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No income data available
          </div>
        )}
      </Card>

      {/* Expenses by Category */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-1">
          Expenses by Category
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Where your money is going
        </p>
        {expensesByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-expense-${index}`}
                    fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No expense data available
          </div>
        )}
      </Card>
    </div>
  )
}
