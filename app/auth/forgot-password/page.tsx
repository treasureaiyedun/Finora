"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Card } from "@/app/components/ui/Card"
import { Button } from "@/app/components/ui/Button"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    const redirectUrl = `${window.location.origin}/auth/callback?type=recovery`

    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
      setMessage("Check your email for the reset link.")
    }
  }

  return (
    <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-900 border-0 shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Finora</h1>
        <p className="text-muted-foreground">Reset your password</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {sent ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
            {message} Click the link in the email to set a new password.
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Didn't receive it?{" "}
            <button
              onClick={() => { setSent(false); setEmail("") }}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Try again
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white cursor-pointer"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
          Sign in
        </Link>
      </p>
    </Card>
  )
}