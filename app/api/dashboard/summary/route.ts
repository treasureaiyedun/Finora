import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total balance from accounts
    const { data: accounts, error: accountsError } = await supabase
      .from("accounts")
      .select("balance")
      .eq("user_id", user.id)

    if (accountsError) throw accountsError

    const totalBalance = accounts?.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0) || 0

    // Get income for current month
    const monthStart = new Date()
    monthStart.setDate(1)
    const monthStartStr = monthStart.toISOString().split("T")[0]
    
    const { data: incomeData, error: incomeError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("type", "income")
      .gte("date", monthStartStr)

    if (incomeError) throw incomeError

    const monthlyIncome = incomeData?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0

    // Get expenses for current month
    const { data: expenseData, error: expenseError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("type", "expense")
      .gte("date", monthStartStr)

    if (expenseError) throw expenseError

    const monthlyExpenses = expenseData?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0

    // Get recent transactions
    const { data: recentTransactions, error: transError } = await supabase
      .from("transactions")
      .select("id, user_id, type, category, amount, date, note, created_at, updated_at")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(5)

    if (transError) throw transError

    // Get goals summary
    const { data: goals, error: goalsError } = await supabase
      .from("goals")
      .select("id, title, target_amount, current_amount, deadline")
      .eq("user_id", user.id)
      .order("deadline", { ascending: true })

    if (goalsError) throw goalsError

    return NextResponse.json({
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      recentTransactions: recentTransactions || [],
      goals: goals || [],
      monthStart: monthStartStr,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
