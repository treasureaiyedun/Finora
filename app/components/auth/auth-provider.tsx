"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    if (pathname.startsWith("/auth")) {
      setIsLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          // Check if user has previously created an account
          const hasAccount = localStorage.getItem("finora_has_account")
          if (hasAccount) {
            router.replace("/auth/login")
          } else {
            router.replace("/auth/signup")
          }
        } else {
          // Active session = existing account; ensure the flag is set
          localStorage.setItem("finora_has_account", "true")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.replace("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !pathname.startsWith("/auth")) {
        const hasAccount = localStorage.getItem("finora_has_account")
        router.replace(hasAccount ? "/auth/login" : "/auth/signup")
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading Finora...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}