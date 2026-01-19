"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, Settings, UserCircle } from "lucide-react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"

type User = {
  name: string
  email: string
}

export default function UserMenu() {
  const [open, setOpen] = useState(false)

  const [user] = useState<User>({
    name: "Treasure Aiyedun",
    email: "treasure@finora.app",
  })

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100) setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      {/* Initials Button */}
      <button
        onClick={() => setOpen(!open)}
        className="h-9 w-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm hover:scale-105 transition cursor-pointer"
        aria-label="User menu"
      >
        {user.name.charAt(0)}
      </button>

      {/* Desktop Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="hidden sm:block absolute right-0 mt-3 w-64 rounded-xl border bg-white dark:bg-zinc-900 shadow-2xl z-50 overflow-hidden backdrop-blur-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MenuContent user={user} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="sm:hidden fixed inset-0 z-50 flex items-end bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full bg-white dark:bg-zinc-900 rounded-t-2xl p-4"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.3}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuContent user={user} onLogout={handleLogout} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuContent({
  user,
  onLogout,
}: {
  user: { name: string; email: string }
  onLogout: () => void
}) {
  return (
    <>
      {/* Profile Header */}
      <div className="px-4 py-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Actions */}
      <div className="p-2 space-y-1">
        <MenuItem icon={<UserCircle size={18} />} label="Profile" />
        <MenuItem icon={<Settings size={18} />} label="Settings" />
      </div>

      <div className="h-px bg-border" />

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition"
      >
        <LogOut size={18} />
        Log out
      </button>
    </>
  )
}

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition text-sm">
      {icon}
      {label}
    </button>
  )
}
