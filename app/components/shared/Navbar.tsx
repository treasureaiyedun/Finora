"use client"

import { Moon, Sun, User, Menu } from "lucide-react"

interface TopNavProps {
  isDark: boolean
  onThemeToggle: () => void
  onMobileMenuClick?: () => void
}

export function Navbar({ isDark, onThemeToggle, onMobileMenuClick }: TopNavProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuClick}
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-foreground" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Welcome back!</h2>
          <p className="text-sm text-muted-foreground">Here's your financial overview</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onThemeToggle}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-600" />}
        </button>

        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <User size={20} className="text-foreground" />
        </button>
      </div>
    </header>
  )
}
