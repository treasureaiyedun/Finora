"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/app/components/shared"
import { Analytics ,Dashboard, Goals, Settings, Transactions } from "@/app/components/pages"

type PageType = "dashboard" | "transactions" | "analytics" | "goals" | "settings"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "transactions":
        return <Transactions />
      case "analytics":
        return <Analytics />
      case "goals":
        return <Goals />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">{renderPage()}</main>
        </div>
      </div>
    </div>
  )
}
