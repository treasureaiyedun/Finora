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
        const existing = acc.find((i) => i.name === t.category)
        if (existing) existing.value += t.amount
        else acc.push({ name: t.category, value: t.amount })
        return acc
      },
      [] as { name: string; value: number }[],
    )

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

  const INCOME_COLORS = [
    "#22C55E",
    "#3B82F6",
    "#A855F7",
    "#F59E0B",
    "#06B6D4",
  ]

  const EXPENSE_COLORS = [
    "#EF4444",
    "#F97316",
    "#A855F7",
    "#06B6D4",
    "#10B981",
    "#6366F1",
  ]

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const truncate = (text: string, max = 12) =>
    text.length > max ? `${text.slice(0, max)}…` : text

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow border">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }

  const renderLegend = (
    data: { name: string; value: number }[],
    colors: string[],
  ) => {
    const total = data.reduce((s, i) => s + i.value, 0)

    return (
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="font-medium truncate">
              {truncate(item.name)}
            </span>
            <span className="text-xs text-muted-foreground">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
        <h3 className="text-lg font-bold mb-1">Income by Category</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Breakdown of your income sources
        </p>

        {incomeByCategory.length ? (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={incomeByCategory}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                >
                  {incomeByCategory.map((_, i) => (
                    <Cell
                      key={i}
                      fill={INCOME_COLORS[i % INCOME_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {renderLegend(incomeByCategory, INCOME_COLORS)}
          </>
        ) : (
          <div className="h-72 flex items-center justify-center text-muted-foreground">
            No income data available
          </div>
        )}
      </Card>

      {/* Expenses */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-0 shadow-sm">
        <h3 className="text-lg font-bold mb-1">Expenses by Category</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Where your money is going
        </p>

        {expensesByCategory.length ? (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                >
                  {expensesByCategory.map((_, i) => (
                    <Cell
                      key={i}
                      fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {renderLegend(expensesByCategory, EXPENSE_COLORS)}
          </>
        ) : (
          <div className="h-72 flex items-center justify-center text-muted-foreground">
            No expense data available
          </div>
        )}
      </Card>
    </div>
  )
}
