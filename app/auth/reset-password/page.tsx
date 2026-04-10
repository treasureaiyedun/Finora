"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/app/components/ui/Card"
import { Button } from "@/app/components/ui/Button"
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react"

export default function ResetPassword() {
  const router = useRouter()
  const supabase = createClient()

  // "checking" while we wait for the recovery event
  // "ready"    once PASSWORD_RECOVERY fires — show the form
  // "invalid"  if we time out with no recovery event and no session
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        clearTimeout(timeout)
        setStatus("ready")
      }
    })

    // Fallback: if the server-side callback already exchanged the token and
    // established a session before this page loaded, there's no event to catch.
    // In that case check for an existing session after a short delay.
    timeout = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setStatus("ready")
      } else {
        setStatus("invalid")
      }
    }, 1500)

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [supabase])

  const passwordRules = useMemo(() => [
    { label: "At least 8 characters",        met: password.length >= 8 },
    { label: "One uppercase letter (A–Z)",    met: /[A-Z]/.test(password) },
    { label: "One lowercase letter (a–z)",    met: /[a-z]/.test(password) },
    { label: "One number (0–9)",              met: /[0-9]/.test(password) },
    { label: "One special character (!@#…)",  met: /[^A-Za-z0-9]/.test(password) },
  ], [password])

  const allRulesMet = passwordRules.every((r) => r.met)
  const passwordsMatch = confirmPassword === "" || password === confirmPassword

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!allRulesMet)      { setError("Please meet all password requirements"); return }
    if (!confirmPassword)  { setError("Please confirm your new password"); return }
    if (password !== confirmPassword) { setError("Passwords do not match"); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      await supabase.auth.signOut()
      setSuccess(true)
      setTimeout(() => router.replace("/auth/login"), 2500)
    }
  }

  // Checking validity of the reset link, or waiting for the recovery event to fire
  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={36} />
          <p className="text-sm text-muted-foreground">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  // Invalid / expired link 
  if (status === "invalid") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-900 border-0 shadow-lg text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <X size={28} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Link Expired</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has already been used.
            Please request a new one.
          </p>
          <Button
            onClick={() => router.push("/auth/forgot-password")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            Request New Link
          </Button>
        </Card>
      </div>
    )
  }

  // Success 
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-900 border-0 shadow-lg text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
            <Check size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Password Updated</h1>
          <p className="text-sm text-muted-foreground">
            Your password has been changed successfully. Redirecting to login...
          </p>
        </Card>
      </div>
    )
  }

  // Reset form
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-900 border-0 shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Finora</h1>
          <p className="text-muted-foreground">Set a new password for your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password.length > 0 && (
              <ul className="mt-2 space-y-1.5 bg-muted/40 rounded-lg p-3">
                {passwordRules.map((rule) => (
                  <li key={rule.label} className="flex items-center gap-2 text-sm">
                    {rule.met
                      ? <Check size={14} className="text-emerald-500 shrink-0" />
                      : <X size={14} className="text-red-400 shrink-0" />}
                    <span className={rule.met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 pr-10 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  confirmPassword
                    ? passwordsMatch ? "border-emerald-500" : "border-red-500"
                    : "border-border"
                }`}
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="text-xs text-emerald-500 mt-1">Passwords match</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !allRulesMet || !passwordsMatch || !confirmPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white cursor-pointer"
          >
            {loading
              ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Updating...</span>
              : "Reset Password"
            }
          </Button>
        </form>
      </Card>
    </div>
  )
}