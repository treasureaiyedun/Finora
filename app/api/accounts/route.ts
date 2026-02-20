import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("accounts")
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

    const { name, balance } = await request.json()

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      )
    }

    // Validate field types and values
    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Account name must be a non-empty string" },
        { status: 400 }
      )
    }

    if (balance !== undefined && (typeof balance !== "number" || balance < 0)) {
      return NextResponse.json(
        { error: "Balance must be a non-negative number" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: user.id,
          name: name.trim(),
          balance: Math.max(0, balance || 0),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
