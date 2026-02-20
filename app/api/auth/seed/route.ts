import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has data
    const { data: existingAccount } = await supabase
      .from("accounts")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)

    if (existingAccount && existingAccount.length > 0) {
      return NextResponse.json({ message: "User already has data" }, { status: 200 })
    }

    // Call the seed function
    const { error } = await supabase.rpc("seed_user_data", { p_user_id: user.id })

    if (error) throw error

    return NextResponse.json({ message: "Data seeded successfully" }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
