"use client"

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/Alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/app/components/ui/Button"
import { Card } from "@/app/components/ui/Card"
import { useFinanceStore } from "@/lib/store"
import { useState, useEffect } from "react"

export function Settings() {
  const { clearAllData } = useFinanceStore()
  const [mounted, setMounted] = useState(false)
  const [currency, setCurrency] = useState("₦")
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("currency")
    if (saved) setCurrency(saved)
  }, [])

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    localStorage.setItem("currency", newCurrency)
    window.dispatchEvent(new Event("currencyChanged"))
  }

  const handleClearData = () => {
    if (confirm("Are you sure? This will delete all your data.")) {
      clearAllData()
      setShowConfirm(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and data</p>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">About Finora</h2>
          <p className="text-sm text-muted-foreground">
            Finora helps you track your income and expenses, visualize your financial data, and set savings goals. All
            your data is stored locally in your browser.
          </p>
        </div>
      </Card>

      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <div>
            <label className="block text-sm font-medium mb-3">Currency</label>
            <div className="flex gap-2">
              {["₦", "$", "€", "£"].map((curr) => (
                <button
                  key={curr}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    currency === curr ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6 space-y-4 border-destructive/20">
          <h2 className="text-xl font-semibold">Data Management</h2>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data Storage</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Your data is stored locally in your browser. Clearing your browser data will remove all transactions and
              goals.
            </AlertDescription>
          </Alert>

          {!showConfirm ? (
            <Button variant="destructive" onClick={() => setShowConfirm(true)}>
              Clear All Data
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive cursor-pointer">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleClearData} className="cursor-pointer">
                  Yes, Clear Everything
                </Button>
                <Button variant="secondary" onClick={() => setShowConfirm(false)} className="cursor-pointer">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
