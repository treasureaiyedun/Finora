"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Moon, Sun, Palette, Bell, Lock, Trash2, LogOut, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function Settings() {
    const router = useRouter()
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [currency, setCurrency] = useState("₦")
    const [notifications, setNotifications] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

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
        setIsDeleting(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const response = await fetch("/api/auth/delete-account", { method: "POST" })
            if (response.ok) {
                await supabase.auth.signOut()
                router.push("/auth/login")
            } else {
                alert("Failed to delete account")
            }
        } catch (error) {
            console.error("Error deleting account:", error)
            alert("Error deleting account")
        } finally {
            setIsDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push("/auth/login")
        } catch (error) {
            console.error("Error logging out:", error)
        } finally {
            setIsLoggingOut(false)
            setShowLogoutModal(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 hover:bg-muted rounded-lg transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-bold font-heading">Settings</h1>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {/* Appearance */}
                    <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Palette className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-xl font-semibold font-heading">Appearance</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Dark Mode Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                    <span className="text-sm">Dark Mode</span>
                                </div>
                                <button
                                    onClick={handleThemeToggle}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition- cursor-pointer ${isDarkMode ? "bg-indigo-500" : "bg-muted"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform bg-white rounded-full transition ${isDarkMode ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Currency */}
                    <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Palette className="w-5 h-5 text-green-500" />
                            <h2 className="text-xl font-semibold font-heading">Currency</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {["₦", "$", "€", "£"].map((curr) => (
                                <button
                                    key={curr}
                                    onClick={() => handleCurrencyChange(curr)}
                                    className={`px-4 py-2 rounded-lg border transition cursor-pointer ${currency === curr
                                            ? "bg-indigo-500 text-white border-indigo-500"
                                            : "bg-muted hover:border-indigo-500"
                                        }`}
                                >
                                    {curr}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-semibold font-heading">Notifications</h2>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm">Enable Notifications</span>
                            <button
                                onClick={handleNotificationsToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${notifications ? "bg-indigo-500" : "bg-muted"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform bg-white rounded-full transition ${notifications ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Security & Account */}
                    <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-semibold font-heading">Security & Account</h2>
                        </div>

                        <div className="space-y-2">
                            <Link href="/profile">
                                <button className="w-full px-4 py-3 text-left text-sm hover:bg-muted rounded-lg transition flex items-center gap-2 cursor-pointer">
                                    <Lock className="w-4 h-4" />
                                    Change Password
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold font-heading text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Danger Zone
                        </h2>

                        <div className="space-y-2">
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="w-full px-4 py-3 text-left text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition flex items-center gap-2 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full px-4 py-3 text-left text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition flex items-center gap-2 cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 relative">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 relative">
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                            Are you sure you want to log out?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                                disabled={isLoggingOut}
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