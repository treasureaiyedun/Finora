import { BalanceTrend, ExpensesChart, IncomeChart } from "@/app/components/analytics"
import { Card } from "@/app/components/ui/Card"
import { useFinanceStore } from "@/lib/store"
export function Analytics() {
  const { transactions } = useFinanceStore()
  return (
    <div className="p-6 space-y-3">
      <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
      <p className="text-muted-foreground">Detailed insights into your financial patterns</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-1">Income by Category</h3>
          <IncomeChart />
        </Card>

        <Card className="p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-1">Expenses by Category</h3>
          <ExpensesChart />
        </Card>
      </div>

      <BalanceTrend transactions={transactions} />
    </div>
  )
}
