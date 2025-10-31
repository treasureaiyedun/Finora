"use client"

import { useState, useEffect } from "react"
import { Navbar, Sidebar } from "@/app/components/shared"
import { Analytics, DashboardPage, Goals, Settings, TransactionsPage } from "@/app/components"
import { Inter, Outfit, Instrument_Sans,Manrope, DM_Sans } from "next/font/google";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dm_sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

type PageType = "dashboard" | "transactions" | "analytics" | "goals" | "settings"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard")
  const [isDark, setIsDark] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setSidebarOpen(false)
      }
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
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "transactions":
        return <TransactionsPage />
      case "analytics":
        return <Analytics />
      case "goals":
        return <Goals />
      case "settings":
        return <Settings />
      default:
        return <DashboardPage />
    }
  }

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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)} />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar isDark={isDark} onThemeToggle={toggleTheme} onMobileMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-auto">{renderPage()}</main>
        </div>
      </div>
    </div>
  )
}