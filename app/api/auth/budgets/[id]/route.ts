import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { data, error } = await supabase
      .from("budgets")
      .select("*, categories(name, type)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()
    if (error) throw error
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { limit_amount, current_amount } = await request.json()
    if (limit_amount !== undefined && (typeof limit_amount !== "number" || limit_amount <= 0)) {
      return NextResponse.json(
        { error: "Limit amount must be a positive number" },
        { status: 400 }
      )
    }
    if (current_amount !== undefined && (typeof current_amount !== "number" || current_amount < 0)) {
      return NextResponse.json(
        { error: "Current amount must be a non-negative number" },
        { status: 400 }
      )
    }
    const updates: any = {}
    if (limit_amount !== undefined) updates.limit_amount = limit_amount
    if (current_amount !== undefined) updates.current_amount = current_amount
    const { data, error } = await supabase
      .from("budgets")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*, categories(name, type)")
      .single()
    if (error) throw error
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}