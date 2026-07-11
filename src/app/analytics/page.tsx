import { getProducts, getCategories, summarizeCommissionRates, summarizePriceRanges } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChartCard, PieChartCard } from '@/components/charts'

export default function AnalyticsPage() {
  const products = getProducts()
  const categories = getCategories(products)
  const categoryCounts = categories.map(c => ({
    name: c, value: products.filter(p => p.category === c).length
  }))
  const commBuckets = summarizeCommissionRates(products)
  const commData = Object.entries(commBuckets).map(([name, value]) => ({ name, value }))
  const priceBuckets = summarizePriceRanges(products)
  const priceData = Object.entries(priceBuckets).map(([name, value]) => ({ name, value }))

  const cats = categoryCounts.map(c => {
    const catProducts = products.filter(p => p.category === c.name)
    const withComm = catProducts.filter(p => p.commission != null)
    return {
      ...c,
      avgCommission: withComm.length > 0
        ? withComm.reduce((s, p) => s + (p.commission || 0), 0) / withComm.length
        : 0,
      avgPrice: catProducts.filter(p => p.price).reduce((s, p) => s + (p.price || 0), 0) / Math.max(catProducts.filter(p => p.price).length, 1),
      totalCommission: withComm.reduce((s, p) => s + (p.commission || 0), 0),
    }
  })

  const topBySales = [...products]
    .sort((a, b) => {
      const aSales = parseInt(a.sales.replace(/\D/g, '')) || 0
      const bSales = parseInt(b.sales.replace(/\D/g, '')) || 0
      return bSales - aSales
    })
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Category breakdown & commission analysis</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader className="border-b border-border/50"><CardTitle className="flex items-center gap-2"><span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 inline-block" /> Category Distribution</CardTitle></CardHeader>
          <CardContent><PieChartCard data={categoryCounts} dataKey="value" nameKey="name" height={300} /></CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader><CardTitle>Product Categories</CardTitle></CardHeader>
          <CardContent><BarChartCard data={categoryCounts} dataKey="value" nameKey="name" title="Count by category" height={250} /></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader><CardTitle>Commission Rates</CardTitle></CardHeader>
          <CardContent><BarChartCard data={commData} dataKey="value" nameKey="name" title="Number of products per commission tier" height={250} /></CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader><CardTitle>Price Ranges</CardTitle></CardHeader>
          <CardContent><BarChartCard data={priceData} dataKey="value" nameKey="name" title="Products grouped by price" height={250} color="#f97316" /></CardContent>
        </Card>
      </div>

      <Card className="card-hover">
        <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border text-sm">
            {cats.map(c => (
              <div key={c.name} className="flex items-center justify-between px-6 py-3 transition-colors duration-150 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <Badge>{c.name}</Badge>
                  <span className="text-muted-foreground">{c.value} products</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-muted-foreground">
                    Avg price: <strong>₫{c.avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Avg commission: <strong className="text-success">₫{c.avgCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                  </span>
                  <span className="text-xs font-semibold">
                    Total: ₫{c.totalCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader><CardTitle>Top 10 by Sales Volume</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border text-sm">
            {topBySales.map((p, i) => (
              <div key={p.id + i} className="flex items-center justify-between px-6 py-3 transition-colors duration-150 hover:bg-muted/30">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-muted-foreground w-5 text-xs font-medium">#{i + 1}</span>
                  <span className="truncate max-w-[350px]">{p.name}</span>
                  <Badge variant="outline">{p.category}</Badge>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-medium">{p.sales}</span>
                  <span className="text-success font-semibold">₫{p.commission?.toLocaleString() || '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
