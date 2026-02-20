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

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

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

    const { title, target_amount, current_amount, deadline } = await request.json()

    // Validate required fields
    if (!title || target_amount === undefined || !deadline) {
      return NextResponse.json(
        { error: "Missing required fields: title, target_amount, deadline" },
        { status: 400 }
      )
    }

    // Validate field types and values
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title must be a non-empty string" },
        { status: 400 }
      )
    }

    if (typeof target_amount !== "number" || target_amount <= 0) {
      return NextResponse.json(
        { error: "Target amount must be a positive number" },
        { status: 400 }
      )
    }

    if (current_amount !== undefined && (typeof current_amount !== "number" || current_amount < 0)) {
      return NextResponse.json(
        { error: "Current amount must be a non-negative number" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("goals")
      .insert([
        {
          user_id: user.id,
          title: title.trim(),
          target_amount,
          current_amount: current_amount || 0,
          deadline,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
