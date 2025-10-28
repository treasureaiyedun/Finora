import { Card } from "@/app/components/ui/Card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  variant?: "accent" | "success" | "warning" | "default"
}

const variantStyles = {
  accent: {
    borderColor: "#06b6d4", // cyan
    iconBorderColor: "#cffafe", // light cyan
    iconColor: "#06b6d4",
  },
  success: {
    borderColor: "#10b981", // emerald
    iconBorderColor: "#d1fae5", // light emerald
    iconColor: "#10b981",
  },
  warning: {
    borderColor: "#f97316", // orange
    iconBorderColor: "#fed7aa", // light orange
    iconColor: "#f97316",
  },
  default: {
    borderColor: "#6366f1", // indigo
    iconBorderColor: "#e0e7ff", // light indigo
    iconColor: "#6366f1",
  },
}

export function StatCard({ title, value, description, icon: Icon, variant = "default" }: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card
      className="p-5 bg-white dark:bg-slate-900 border-0 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeft: `4px solid ${styles.borderColor}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div
          className="p-2 rounded-lg shrink-0"
          style={{
            backgroundColor: styles.iconBorderColor,
          }}
        >
          <Icon size={20} style={{ color: styles.iconColor }} />
        </div>
      </div>
    </Card>
  )
}
