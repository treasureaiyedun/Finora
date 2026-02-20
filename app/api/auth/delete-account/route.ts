import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let password = ""
    try {
      const body = await request.json().catch(() => ({}))
      password = body?.password || ""
    } catch {
      password = ""
    }

    if (!password)
      return NextResponse.json(
        { error: "Password required for account deletion" },
        { status: 400 }
      )

    // Verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email || "",
      password,
    })

    if (signInError) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Delete all user data in correct order (children before parents)
    const { error: deleteTransactionsError } = await supabase
      .from("transactions")
      .delete()
      .eq("user_id", user.id)

    if (deleteTransactionsError) {
      console.error("Error deleting transactions:", deleteTransactionsError)
      return NextResponse.json({ error: "Failed to delete account data" }, { status: 500 })
    }

    const { error: deleteGoalsError } = await supabase
      .from("goals")
      .delete()
      .eq("user_id", user.id)

    if (deleteGoalsError) {
      console.error("Error deleting goals:", deleteGoalsError)
      return NextResponse.json({ error: "Failed to delete account data" }, { status: 500 })
    }

    const { error: deleteBudgetsError } = await supabase
      .from("budgets")
      .delete()
      .eq("user_id", user.id)

    if (deleteBudgetsError) {
      console.error("Error deleting budgets:", deleteBudgetsError)
      return NextResponse.json({ error: "Failed to delete account data" }, { status: 500 })
    }

    const { error: deleteAccountsError } = await supabase
      .from("accounts")
      .delete()
      .eq("user_id", user.id)

    if (deleteAccountsError) {
      console.error("Error deleting accounts:", deleteAccountsError)
      return NextResponse.json({ error: "Failed to delete account data" }, { status: 500 })
    }

    // Delete the auth user (must happen before sign out)
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteUserError) {
      console.error("Error deleting auth user:", deleteUserError)
      return NextResponse.json({ error: "Failed to delete user account" }, { status: 500 })
    }

    // Sign out the user
    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      console.error("Error signing out:", signOutError)
    }

    return NextResponse.json({
      success: true,
      message: "Your account and all associated data have been permanently deleted.",
    })
  } catch (error: any) {
    console.error("Account deletion error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete account" }, { status: 500 })
  }
}