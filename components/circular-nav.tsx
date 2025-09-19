"use client"

// Fixed CircularNav: normalizes translate values to 3 decimal places to avoid
// tiny floating-point differences that cause React hydration warnings.

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Briefcase, Users, ClipboardList, X, Sparkles } from "lucide-react"

const navItems = [
  { href: "/jobs", icon: Briefcase, label: "Jobs", color: "from-blue-500 to-indigo-600" },
  { href: "/candidates", icon: Users, label: "Candidates", color: "from-purple-500 to-pink-600" },
  { href: "/assessments", icon: ClipboardList, label: "Assessments", color: "from-emerald-500 to-teal-600" },
]

export function CircularNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="fixed top-6 left-8 z-50">
      <div className="relative">
        {/* Pulse ring animation */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600",
            "animate-pulse-ring",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative w-16 h-16 rounded-full",
            "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
            "flex items-center justify-center shadow-2xl",
            "transition-all duration-500 hover:scale-110",
            "animate-glow glass-card",
            "border border-white/20",
            "group overflow-hidden",
            isOpen && "rotate-180 scale-110",
          )}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Icon with enhanced styling */}
          <div className={cn("relative z-10 transition-all duration-300", isOpen ? "rotate-180" : "rotate-0")}>
            {isOpen ? (
              <X size={24} className="text-white drop-shadow-lg" />
            ) : (
              <Sparkles size={24} className="text-white drop-shadow-lg" />
            )}
          </div>
        </button>
      </div>

      <div
        className={cn(
          "absolute top-0 left-0 transition-all duration-700",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0",
        )}
      >
        {navItems.map((item, index) => {
          const angle = index * 60 + 30 // Spread items from 30° to 150° (right side arc from left position)
          const radius = 90

          // compute raw values then normalize to fixed precision to avoid tiny FP differences
          const rawX = Math.cos((angle * Math.PI) / 280) * radius
          const rawY = Math.sin((angle * Math.PI) / 280) * radius
          const x = Number(rawX.toFixed(3))
          const y = Number(rawY.toFixed(3))

          const isActive = pathname === item.href

          return (
            <div
              key={item.href}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transitionDelay: isOpen ? `${index * 100}ms` : `${(navItems.length - index) * 50}ms`,
              }}
            >
              <Link
                href={item.href}
                className={cn(
                  "relative w-14 h-14 rounded-full flex items-center justify-center",
                  "transition-all duration-500 hover:scale-125 shadow-xl",
                  "animate-float glass-card group overflow-hidden",
                  "border border-white/10",
                  isActive
                    ? `bg-gradient-to-br ${item.color} shadow-2xl scale-110`
                    : "bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800",
                )}
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
                title={item.label}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse opacity-75" />
                )}

                {/* Icon */}
                <div className="relative z-10">
                  <item.icon
                    size={20}
                    className={cn(
                      "transition-all duration-300 drop-shadow-lg",
                      isActive ? "text-white" : "text-gray-300 group-hover:text-white",
                    )}
                  />
                </div>

                {/* Tooltip */}
                <div
                  className={cn(
                    "absolute -bottom-8 left-1/2 transform -translate-x-1/2",
                    "px-2 py-1 bg-black/80 text-white text-xs rounded",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "whitespace-nowrap backdrop-blur-sm",
                  )}
                >
                  {item.label}
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
