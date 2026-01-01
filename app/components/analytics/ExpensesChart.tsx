"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useFinanceStore } from "@/lib/store"
import { useEffect, useState } from "react"

export default function ExpensesChart() {
  const { transactions } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category)
      existing ? (existing.value += t.amount) : acc.push({ name: t.category, value: t.amount })
      return acc
    }, [])

  const EXPENSE_COLORS = ["#f59e0b", "#a855f7", "#ef4444", "#06b6d4", "#10b981", "#8b5cf6"]

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload }: any) =>
    active && payload && payload.length ? (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value)}</p>
      </div>
    ) : null

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={expensesByCategory}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {expensesByCategory.map((_, index) => (
            <Cell key={index} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
