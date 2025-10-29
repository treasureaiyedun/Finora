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
    borderColor: "#06b6d4",
    iconBorderColor: "#cffafe",
    iconColor: "#06b6d4",
  },
  success: {
    borderColor: "#10b981",
    iconBorderColor: "#d1fae5",
    iconColor: "#10b981",
  },
  warning: {
    borderColor: "#f97316",
    iconBorderColor: "#fed7aa",
    iconColor: "#f97316",
  },
  default: {
    borderColor: "#6366f1",
    iconBorderColor: "#e0e7ff",
    iconColor: "#6366f1",
  },
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card
      className="p-4 bg-white dark:bg-slate-900 border-0 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeft: `4px solid ${styles.borderColor}` }}
    >
      <div className="flex flex-col gap-2">
        {/* Title and icon on the same line */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            {title}
          </p>
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: styles.iconBorderColor }}
          >
            <Icon size={18} style={{ color: styles.iconColor }} />
          </div>
        </div>

        {/* Value and description below */}
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  )
}
