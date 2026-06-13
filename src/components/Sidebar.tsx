"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, BookOpen, Flame, Target, User } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", icon: Activity, label: "Dashboard" },
    { href: "/tracker", icon: Target, label: "Tracker" },
    { href: "/journal", icon: BookOpen, label: "Journal" },
    { href: "/community", icon: Flame, label: "Community" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 glass border-t border-border/50 md:top-0 md:w-20 md:h-full md:border-t-0 md:border-r flex md:flex-col items-center justify-around md:justify-start md:pt-8 md:gap-8 z-50">
      {links.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link 
            key={href} 
            href={href} 
            title={label}
            className={`p-3 rounded-xl transition-colors ${
              isActive 
                ? "bg-primary/20 text-primary" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon className="w-6 h-6" />
          </Link>
        )
      })}
    </nav>
  )
}
