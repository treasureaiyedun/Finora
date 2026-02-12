"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ResetPassword() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      setMessage(`❌ ${error.message}`)
    } else {
      setMessage("✅ Password successfully updated! Redirecting to login...")
      setTimeout(() => router.push("/auth/login"), 2000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-500 dark:text-green-400">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
