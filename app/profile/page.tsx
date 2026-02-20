"use client"

import React, { useState, useEffect } from "react"
import { createClient as createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/Button"
import { Card } from "@/app/components/ui/Card"
import { Input } from "@/app/components/ui/Input"
import { ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

type User = {
  id: string
  email: string
  name: string
  created_at?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState("")

  // Fetch User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          router.push("/auth/login")
          return
        }

        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name:
            authUser.user_metadata?.name ||
            authUser.email?.split("@")[0] ||
            "",
          created_at: authUser.created_at,
        })

        setFormData({
          name:
            authUser.user_metadata?.name ||
            authUser.email?.split("@")[0] ||
            "",
          email: authUser.email || "",
        })
      } catch {
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, supabase])

  //password validation
  useEffect(() => {
    if (!showPasswordForm) return

    if (passwordData.newPassword.length > 0 && passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
    } else if (
      passwordData.confirmPassword &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      setPasswordError("Passwords do not match")
    } else {
      setPasswordError(null)
    }
  }, [passwordData, showPasswordForm])

  // Update Display Name
  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    const { error } = await supabase.auth.updateUser({
      data: { name: formData.name },
    })

    if (error) {
      setPasswordError(error.message)
    } else {
      setUser((prev) => prev ? { ...prev, name: formData.name } : null)
      setSuccessModalMessage("Display name updated successfully!")
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 3000)
    }

    setIsUpdating(false)
  }

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || passwordError) return

    setIsChangingPassword(true)

    // Verify current password
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: passwordData.currentPassword,
    })

    if (verifyError) {
      setPasswordError("Current password is incorrect")
      setIsChangingPassword(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    })

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordForm(false)
      setPasswordError(null)
      setSuccessModalMessage("Password changed successfully!")
      setShowSuccessModal(true)
      setTimeout(() => setShowSuccessModal(false), 3000)
    }

    setIsChangingPassword(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  if (!user) return null

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
              <p className="text-foreground mt-1">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
        </Card>

        {/* Update Profile Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={handleUpdateDisplayName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <Button type="submit" disabled={isUpdating} className="cursor-pointer w-full">
              {isUpdating ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Updating...
                </>
              ) : "Update Profile"}
            </Button>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>

          {!showPasswordForm ? (
            <Button onClick={() => setShowPasswordForm(true)} className="cursor-pointer w-full">
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">

              {/* Current Password */}
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

              <div className="flex gap-2">
                <Button type="submit" disabled={isChangingPassword} className="flex-1 cursor-pointer">
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Changing...
                    </>
                  ) : "Change Password"}
                </Button>

                <Button type="button" variant="secondary" onClick={() => {
                  setShowPasswordForm(false)
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  setPasswordError(null)
                }} className="flex-1 cursor-pointer">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Account Summary */}
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

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 flex flex-col items-center gap-4 max-w-sm mx-4 shadow-lg animate-in scale-in-90 duration-300">
              <CheckCircle2 className="text-green-600 dark:text-green-400" size={48} />
              <p className="text-lg font-medium text-center text-foreground dark:text-white">
                {successModalMessage}
              </p>
              <button
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
