"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Moon, Sun, DollarSign, Bell, Lock, Trash2, LogOut, X, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type PageType = "dashboard" | "transactions" | "analytics" | "goals" | "settings"

interface SettingsProps {
  onNavigate?: (page: PageType) => void
}

export default function Settings({ onNavigate }: SettingsProps) {
  const router = useRouter()
  const handleBack = () => {
    if (onNavigate) {
      onNavigate("dashboard")
    } else {
      router.push("/")
    }
  }
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currency, setCurrency] = useState("₦")
  const [notifications, setNotifications] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    const prefersDark = localStorage.getItem("theme") === "dark"
    setIsDarkMode(prefersDark)
    const savedCurrency = localStorage.getItem("currency")
    if (savedCurrency) setCurrency(savedCurrency)
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications))
  }, [])

  const handleThemeToggle = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem("theme", newDarkMode ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newDarkMode)
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    localStorage.setItem("currency", newCurrency)
    window.dispatchEvent(new Event("currencyChanged"))
  }

  const handleNotificationsToggle = () => {
    const newNotifications = !notifications
    setNotifications(newNotifications)
    localStorage.setItem("notifications", JSON.stringify(newNotifications))
  }

  const handleDeleteAccount = async () => {
    setDeleteError("")
    if (!deletePassword) { setDeleteError("Password is required"); return }
    setIsDeleting(true)
    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      })
      const data = await response.json()
      if (response.ok) {
        router.push("/auth/login?deleted=true")
      } else {
        setDeleteError(data.error || "Failed to delete account")
      }
    } catch {
      setDeleteError("An error occurred while deleting your account")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch {
      // ignore
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setDeletePassword("")
    setDeleteError("")
    setShowDeletePassword(false)
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-muted rounded-lg transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your preferences</p>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card border rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Sun className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-base font-semibold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
              <span className="text-sm">Dark Mode</span>
            </div>
            <button
              onClick={handleThemeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isDarkMode ? "bg-indigo-500" : "bg-muted"}`}
              role="switch"
              aria-checked={isDarkMode}
            >
              <span className={`inline-block h-4 w-4 transform bg-white rounded-full shadow transition-transform ${isDarkMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        {/* Currency */}
        <div className="bg-card border rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-base font-semibold">Currency</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["₦", "$", "€", "£"].map((curr) => (
              <button
                key={curr}
                onClick={() => handleCurrencyChange(curr)}
                className={`py-2.5 rounded-lg border text-sm font-medium transition cursor-pointer ${
                  currency === curr
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-background hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-base font-semibold">Notifications</h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Enable Notifications</span>
            <button
              onClick={handleNotificationsToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${notifications ? "bg-indigo-500" : "bg-muted"}`}
              role="switch"
              aria-checked={notifications}
            >
              <span className={`inline-block h-4 w-4 transform bg-white rounded-full shadow transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card border rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-base font-semibold">Security & Account</h2>
          </div>
          <Link href="/profile">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition cursor-pointer">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Change Password</span>
            </div>
          </Link>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Trash2 className="w-4 h-4 text-red-500" />
            <h2 className="text-base font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Log Out
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            Delete Account
          </button>
        </div>

      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={closeDeleteModal}>
          <div className="bg-card border rounded-2xl sm:rounded-xl w-full sm:max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeDeleteModal} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Trash2 className="w-4 h-4 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold">Delete Account</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone. All your data will be permanently deleted. Enter your password to confirm.
            </p>
            <div className="relative mb-2">
              <input
                type={showDeletePassword ? "text" : "password"}
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => { setDeletePassword(e.target.value); setDeleteError("") }}
                className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowDeletePassword(!showDeletePassword)}
                className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer"
              >
                {showDeletePassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {deleteError && <p className="text-sm text-red-500 mb-3">{deleteError}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={closeDeleteModal} className="flex-1 px-4 py-2.5 rounded-lg border hover:bg-muted transition cursor-pointer text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={() => setShowLogoutModal(false)}>
          <div className="bg-card border rounded-2xl sm:rounded-xl w-full sm:max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold">Confirm Logout</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Are you sure you want to log out of Finora?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border hover:bg-muted transition cursor-pointer text-sm font-medium">
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}