'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/kpi-card'
import { BarChartCard, PieChartCard } from '@/components/charts'
import { Link, Users, UserCheck, ShoppingBag, Tag, RefreshCw, X } from 'lucide-react'
import type { DashboardState, Product } from '@/lib/types'

export default function OverviewClient({ state, products, offers, categories, commBuckets }: {
  state: DashboardState
  products: Product[]
  offers: any[]
  categories: string[]
  commBuckets: Record<string, number>
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const normCat = selectedCategory?.toLowerCase().trim() ?? null

  const categoryCounts = categories.map(c => ({
    name: c, value: products.filter(p => (p.category ?? '').toLowerCase().trim() === c.toLowerCase().trim()).length
  }))
  const commData = Object.entries(commBuckets).map(([name, value]) => ({ name, value }))

  const topProducts = [...products]
    .filter(p => p.commission != null)
    .filter(p => !selectedCategory || (p.category ?? '').toLowerCase().trim() === normCat)
    .sort((a, b) => (b.commission || 0) - (a.commission || 0))
    .slice(0, 10)

  const topShops = Object.entries(
    products.reduce((acc: Record<string, { count: number; commission: number }>, p) => {
      if (!acc[p.shop]) acc[p.shop] = { count: 0, commission: 0 }
      acc[p.shop].count++
      acc[p.shop].commission += p.commission || 0
      return acc
    }, {})
  ).sort((a, b) => b[1].count - a[1].count).slice(0, 10).map(([name, vals]) => ({ name, ...vals }))

  return (
    <>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard title="Links Posted" value={state.totalPostedLinks} icon={<Link className="h-5 w-5" />} color="#6366f1" />
        <KpiCard title="Groups Reached" value={state.totalGroups} icon={<Users className="h-5 w-5" />} color="#8b5cf6" />
        <KpiCard title="Accounts" value={state.activeAccounts} icon={<UserCheck className="h-5 w-5" />} color="#a855f7" />
        <KpiCard title="Products" value={products.length} icon={<ShoppingBag className="h-5 w-5" />} color="#ec4899" />
        <KpiCard title="Offers" value={offers.length} icon={<Tag className="h-5 w-5" />} color="#f97316" />
        <KpiCard title="Cycle" value={state.currentCycle + 1} icon={<RefreshCw className="h-5 w-5" />} color="#22c55e" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader className="border-b border-border/50"><CardTitle className="flex items-center gap-2"><span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 inline-block" /> Product Categories</CardTitle></CardHeader>
          <CardContent>
            <PieChartCard data={categoryCounts} dataKey="value" nameKey="name" height={280}
              onSliceClick={(name) => setSelectedCategory(name === selectedCategory ? null : name)} />
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader><CardTitle>Commission Rate Distribution</CardTitle></CardHeader>
          <CardContent>
            <BarChartCard data={commData} dataKey="value" nameKey="name" color="#8b5cf6" height={280} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top 10 Products by Commission</CardTitle>
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-3 w-3" /> {selectedCategory}
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border text-sm">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-3 transition-colors duration-150 hover:bg-muted/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-muted-foreground w-5 text-xs font-medium">#{i + 1}</span>
                    <span className="truncate max-w-[300px]">{p.name}</span>
                    <Badge variant={selectedCategory && (p.category ?? '').toLowerCase().trim() === normCat ? 'default' : 'outline'}>{p.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-muted-foreground">{p.price_raw}</span>
                    <span className="font-semibold text-success">₫{p.commission?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader><CardTitle>Top Shops</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border text-sm">
              {topShops.slice(0, 8).map((s, i) => (
                <div key={s.name} className="flex items-center justify-between px-6 py-3 transition-colors duration-150 hover:bg-muted/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-muted-foreground w-5 text-xs font-medium">#{i + 1}</span>
                    <span className="truncate max-w-[300px]">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-muted-foreground">{s.count} products</span>
                    <span className="font-semibold">₫{(s.commission / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}