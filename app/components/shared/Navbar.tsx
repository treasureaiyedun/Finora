"use client"

import { Moon, Sun, Menu } from "lucide-react"
import UserMenu from "./UserMenu"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface TopNavProps {
  isDark: boolean
  onThemeToggle: () => void
  onMobileMenuClick?: () => void
}

export function Navbar({ isDark, onThemeToggle, onMobileMenuClick }: TopNavProps) {
  const [firstName, setFirstName] = useState<string>("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const name =
            user.user_metadata?.first_name ||
            user.user_metadata?.name?.split(" ")[0] ||
            user.email?.split("@")[0] ||
            ""
          setFirstName(name)
        }
      } catch {}
    }
    fetchUser()
  }, [])

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuClick}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-foreground" />
        </button>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">
            {firstName ? `Welcome back, ${firstName}!` : "Welcome back!"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Here's your financial overview</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={onThemeToggle}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-600" />}
        </button>
        <UserMenu />
      </div>
    </header>
  )
}
