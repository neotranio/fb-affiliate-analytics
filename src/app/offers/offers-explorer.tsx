'use client'
import { useState, useMemo } from 'react'
import type { Offer } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, THead, Th, TBody, Tr, Td } from '@/components/ui/table'
import { BarChartCard } from '@/components/charts'
import { Search } from 'lucide-react'

export function OffersExplorer({ offers }: { offers: Offer[] }) {
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('All')

  const filtered = useMemo(() => {
    let list = [...offers]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(o => o.name.toLowerCase().includes(q))
    }
    if (source !== 'All') list = list.filter(o => o.source === source)
    return list
  }, [offers, search, source])

  const sourceData = useMemo(() => {
    const map: Record<string, number> = {}
    offers.forEach(o => { map[o.source] = (map[o.source] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [offers])

  const withRate = offers.filter(o => o.commissionRate)
  const rateBuckets = useMemo(() => {
    const buckets: Record<string, number> = {}
    withRate.forEach(o => {
      const m = o.commissionRate.match(/(\d+)/)
      if (!m) return
      const v = parseInt(m[1])
      const key = o.commissionRate.includes('%')
        ? v <= 5 ? '0-5%'
        : v <= 10 ? '6-10%'
        : v <= 20 ? '11-20%'
        : '20%+'
        : 'Fixed'
      buckets[key] = (buckets[key] || 0) + 1
    })
    return Object.entries(buckets).map(([name, value]) => ({ name, value }))
  }, [withRate])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Offers</h1>
        <p className="text-muted-foreground text-sm mt-1">{offers.length} affiliate offers from Shopee</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader className="border-b border-border/50"><CardTitle className="flex items-center gap-2"><span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 inline-block" /> By Source</CardTitle></CardHeader>
          <CardContent><BarChartCard data={sourceData} dataKey="value" nameKey="name" color="#a855f7" height={200} /></CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader><CardTitle>Commission Rate Distribution</CardTitle></CardHeader>
          <CardContent><BarChartCard data={rateBuckets} dataKey="value" nameKey="name" color="#f97316" height={200} /></CardContent>
        </Card>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>All Offers</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input className="h-9 w-48 rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="Search offers..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                value={source} onChange={e => setSource(e.target.value)}>
                <option value="All">All Sources</option>
                {[...new Set(offers.map(o => o.source))].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <THead>
              <Tr>
                <Th>#</Th>
                <Th>Offer Name</Th>
                <Th>Commission</Th>
                <Th>Period</Th>
                <Th>Type</Th>
                <Th>Source</Th>
                <Th>Link</Th>
              </Tr>
            </THead>
            <TBody>
              {filtered.map((o, i) => (
                <Tr key={i} className="transition-colors duration-150 hover:bg-muted/30">
                  <Td className="text-muted-foreground text-xs">{i + 1}</Td>
                  <Td className="max-w-[350px] truncate font-medium" title={o.name}>{o.name}</Td>
                  <Td><Badge variant={o.commissionRate.includes('up to') ? 'warning' : 'success'}>{o.commissionRate}</Badge></Td>
                  <Td className="text-xs text-muted-foreground max-w-[200px] truncate">{o.period}</Td>
                  <Td><Badge variant="outline">{o.type || o.source}</Badge></Td>
                  <Td className="text-xs">{o.source}</Td>
                  <Td>
                    <a href={o.link} target="_blank" rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs">Open</a>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
