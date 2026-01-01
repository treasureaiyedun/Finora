"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useFinanceStore } from "@/lib/store"
import { useEffect, useState } from "react"

export default function IncomeChart() {
  const { transactions } = useFinanceStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const incomeByCategory = transactions
    .filter(t => t.type === "income")
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category)
      existing ? (existing.value += t.amount) : acc.push({ name: t.category, value: t.amount })
      return acc
    }, [])

const INCOME_COLOR = [
    "#7BDFF2",
    "#9BB9FF",
    "#FAD6FF",
    "#B5EAD7",
    "#FFC8DD",
  "#FFDF91",
  "#CDB4DB",
]

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload }: any) =>
    active && payload && payload.length ? (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-border">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value)}</p>
      </div>
    ) : null

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={incomeByCategory}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {incomeByCategory.map((_, index) => (
            <Cell key={index} fill={INCOME_COLOR[index % INCOME_COLOR.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
