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

    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")

    let query = supabase
      .from("budgets")
      .select("*, categories(name, type)")
      .eq("user_id", user.id)

    if (month) {
      query = query.eq("month", month)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { category_id, limit_amount, month } = await request.json()

    // Validate required fields
    if (!category_id || limit_amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: category_id, limit_amount" },
        { status: 400 }
      )
    }

    // Validate field types and values
    if (typeof limit_amount !== "number" || limit_amount <= 0) {
      return NextResponse.json(
        { error: "Limit amount must be a positive number" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("budgets")
      .insert([
        {
          user_id: user.id,
          category_id,
          limit_amount,
          current_amount: 0,
          month: month || new Date().toISOString().split("T")[0],
        },
      ])
      .select("*, categories(name, type)")

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
