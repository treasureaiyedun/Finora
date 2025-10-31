"use client"
import { LayoutDashboard, Wallet, BarChart3, Target, Settings, X } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: any) => void
  isMobile: boolean
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}

export function Sidebar({
  currentPage,
  onPageChange,
  isMobile,
  mobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Wallet },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "goals", label: "Goals", icon: Target },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // Mobile view
  if (isMobile) {
    return (
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 z-50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">₦</span>
            </div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Finora</h1>
          </div>
          <button
            onClick={() => onMobileOpenChange(false)}
            className="text-sidebar-foreground hover:bg-sidebar-accent p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60">
            <p>© 2025 Finora</p>
            <p>Smart Finance Dashboard</p>
          </div>
        </div>
      </aside>
    )
  }

  // Desktop view
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border flex items-center gap-2">
        <h1 className="text-xl font-bold text-sidebar-foreground">Finora</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">
          <p>© 2025 Finora</p>
          <p>Smart Finance Dashboard</p>
        </div>
      </div>
    </aside>
  )
}
