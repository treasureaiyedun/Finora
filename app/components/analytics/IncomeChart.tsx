"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/app/components/ui/Card"
import { useFinanceStore } from "@/lib/store"

const INCOME_COLORS = [
  "#10B981", // Emerald
  "#6366F1", // Indigo
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#14B8A6", // Teal
]

export function IncomeChart() {
  const { transactions } = useFinanceStore()

  const incomeByCategory = transactions
    .filter((t) => t.type === "income")
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

  if (!incomeByCategory.length) {
    return (
      <Card className="p-6 h-80 flex items-center justify-center text-muted-foreground">
        No income data available
      </Card>
    )
  }

  const total = incomeByCategory.reduce((s, i) => s + i.value, 0)

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
      <h3 className="text-lg font-bold mb-1">Income by Category</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Breakdown of your income sources
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={incomeByCategory}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
          >
            {incomeByCategory.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={INCOME_COLORS[index % INCOME_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {incomeByCategory.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: INCOME_COLORS[index % INCOME_COLORS.length] }}
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
