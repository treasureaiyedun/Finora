"use client"

import { useState, useEffect } from "react"
import { Navbar, Sidebar } from "@/app/components/shared"
import { Analytics, Dashboard, Goals, Settings, Transactions } from "@/app/components"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type PageType = "dashboard" | "transactions" | "analytics" | "goals" | "settings"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [isDark, setIsDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true) 
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setIsLoading(false) 
  }, [])

  useEffect(() => {
    setIsMounted(true)
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page)
    if (isMobile) setSidebarOpen(false)
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex h-screen bg-background text-foreground">
        {isMounted && (
          <Sidebar
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isMobile={isMobile}
            mobileOpen={sidebarOpen}
            onMobileOpenChange={setSidebarOpen}
          />
        )}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            isDark={isDark}
            onThemeToggle={toggleTheme}
            onMobileMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 overflow-auto">{renderPage()}</main>
        </div>
      </div>
    </div>
  )
}
