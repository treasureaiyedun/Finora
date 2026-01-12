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
        {/* Title + Icon */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            {title}
          </p>

          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: styles.iconBorderColor }}
          >
            <Icon size={18} style={{ color: styles.iconColor }} />
          </div>
        </div>

        {/* Value with hover tooltip */}
        <div className="relative group max-w-full">
          <p className="text-2xl font-bold text-foreground truncate cursor-default">
            {value}
          </p>

          <div className="absolute left-0 top-full z-10 mt-1 hidden max-w-xs rounded-md bg-slate-900 px-2 py-1 text-sm text-white shadow-md group-hover:block">
            {value}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  )
}
