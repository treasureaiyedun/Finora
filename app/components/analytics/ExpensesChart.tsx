"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/app/components/ui/Card"
import { useFinanceStore } from "@/lib/store"

const EXPENSE_COLORS = [
  "#f59e0b",
  "#2125f7",
  "#ef4444",
  "#06b6d4",
  "#10b981",
  "#8b5cf6",
]

export function ExpensesChart() {
  const { transactions } = useFinanceStore()

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const existing = acc.find((i) => i.name === t.category)
        if (existing) existing.value += t.amount
        else acc.push({ name: t.category, value: t.amount })
        return acc
      },
      [] as { name: string; value: number }[],
    )

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (!expensesByCategory.length) {
    return (
      <Card className="p-6 h-80 flex items-center justify-center text-muted-foreground">
        No expense data available
      </Card>
    )
  }

  const total = expensesByCategory.reduce((s, i) => s + i.value, 0)

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
      <h3 className="text-lg font-bold mb-1">Expenses by Category</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Where your money is going
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={expensesByCategory}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
          >
            {expensesByCategory.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {expensesByCategory.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  EXPENSE_COLORS[index % EXPENSE_COLORS.length],
              }}
            />
            <span className="font-medium truncate">{item.name}</span>
            <span className="text-xs text-muted-foreground">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
