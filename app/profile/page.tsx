"use client"

import React from "react"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/Button"
import { Card } from "@/app/components/ui/Card"
import { Input } from "@/app/components/ui/Input"
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

type User = {
  id: string
  email: string
  name: string
}

export default function ProfilePage() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createBrowserClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
          router.push("/auth/login")
          return
        }

        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "",
        })
        setFormData({
          name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "",
          email: authUser.email || "",
        })
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const supabase = createBrowserClient()

      const { error: updateError } = await supabase.auth.updateUser({
        data: { name: formData.name },
      })

      if (updateError) throw updateError

      setUser((prev) => (prev ? { ...prev, name: formData.name } : null))
      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setErrorMessage("")
    setSuccessMessage("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      setIsChangingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsChangingPassword(false)
      return
    }

    try {
      const supabase = createBrowserClient()

      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (updateError) throw updateError

      setSuccessMessage("Password changed successfully!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordForm(false)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to change password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="secondary" size="icon" className="cursor-pointer">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account and security</p>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
            <p className="text-sm text-green-800 dark:text-green-300">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            <p className="text-sm text-red-800 dark:text-red-300">{errorMessage}</p>
          </div>
        )}

        {/* Account Information Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <p className="text-foreground mt-1">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Created</label>
              <p className="text-foreground mt-1">{user.id}</p>
            </div>
          </div>
        </Card>

        {/* Update Profile Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <Button type="submit" disabled={isUpdating} className="w-full cursor-pointer">
              {isUpdating ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          {!showPasswordForm ? (
            <Button
              onClick={() => setShowPasswordForm(true)}
              variant="default"
              className="w-full cursor-pointer"
            >
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="At least 8 characters"
                  minLength={8}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm your new password"
                  minLength={8}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    passwordData.newPassword.length < 8 ||
                    passwordData.newPassword !== passwordData.confirmPassword ||
                    isChangingPassword
                  }
                  className="flex-1 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                    setError(null)
                  }}
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Account Stats */}
        <Card className="p-6 bg-linear-to-br from-primary/5 to-accent/5">
          <h3 className="font-semibold mb-3">Account Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Account Status</p>
              <p className="font-semibold text-green-600">Active</p>
            </div>
            <div>
              <p className="text-muted-foreground">Two-Factor Auth</p>
              <p className="font-semibold">Not Enabled</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}