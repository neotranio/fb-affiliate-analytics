'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, BarChart3, Tags, Users, Timeline, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/offers', label: 'Offers', icon: Tags },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/timeline', label: 'Timeline', icon: Timeline },
]

export function Sidebar() {
  const pathname = usePathname()
  const [dark, setDark] = useState(false)

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-sidebar text-sidebar-fg">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div className="h-8 w-8 rounded-lg bg-sidebar-active flex items-center justify-center text-white text-sm font-bold">F</div>
        <div>
          <p className="text-sm font-semibold">Affiliate Analytics</p>
          <p className="text-xs text-white/50">Dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-sidebar-active text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-white/10 px-3 py-4">
        <button onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="mt-2 px-3 text-xs text-white/30">
          v0.1.0 &middot; Last updated: <span id="last-updated">-</span>
        </div>
      </div>
    </aside>
  )
}