"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const redirectUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`

    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    })

    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      setMessage("✅ Check your email for the reset link.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
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
