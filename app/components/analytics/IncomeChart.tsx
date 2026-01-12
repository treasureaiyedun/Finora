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
    .filter((t) => t.type === "income")
    .reduce((acc: any[], t) => {
      const existing = acc.find((item) => item.name === t.category)
      existing ? (existing.value += t.amount) : acc.push({ name: t.category, value: t.amount })
      return acc
    }, [])

  const INCOME_COLORS = ["#7BDFF2", "#9BB9FF", "#FAD6FF", "#B5EAD7", "#FFC8DD", "#FFDF91", "#CDB4DB"]

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

  const renderCustomLabel = (props: any) => {
    const { x, y, name, percent } = props
    const label = `${name}: ${(percent * 100).toFixed(0)}%`
    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > props.cx ? "start" : "end"}
        dominantBaseline="middle"
        className="text-xs fill-foreground"
      >
        {label}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart margin={{ top: 20, right: 150, bottom: 20, left: 150 }}>
        <Pie
          data={incomeByCategory}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          label={renderCustomLabel}
          labelLine={true}
        >
          {incomeByCategory.map((_, index) => (
            <Cell key={index} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
