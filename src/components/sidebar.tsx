'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, BarChart3, Tags, Users, Timeline, Moon, Sun, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

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
  const [lastUpdated, setLastUpdated] = useState('-')
  const [version, setVersion] = useState('1.0.0')

  useEffect(() => {
    fetch('/data/state.json').then(r => r.json()).then(d => {
      if (d.lastUpdated) setLastUpdated(new Date(d.lastUpdated).toLocaleString())
      if (d.version) setVersion(d.version)
    }).catch(() => {})
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-sidebar text-sidebar-fg">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">F</div>
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
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-sidebar-active text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-white" />}
              <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-white/10 px-3 py-4 space-y-2">
        <button onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="px-3 text-xs text-white/30 flex items-center gap-1.5">
          <span>v{version}</span>
          <span className="text-white/20">|</span>
          <RefreshCw className="h-3 w-3" />
          <span className="truncate" title={lastUpdated}>{lastUpdated}</span>
        </div>
      </div>
    </aside>
  )
}