'use client'
import { useState, useMemo } from 'react'
import type { Product } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, THead, Th, TBody, Tr, Td } from '@/components/ui/table'
import { BarChartCard } from '@/components/charts'
import { Search, ArrowUpDown } from 'lucide-react'

export function ProductExplorer({ products }: { products: Product[] }) {
  const categories = useMemo(() => [...new Set(products.map(p => p.category))].sort(), [products])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'commission', dir: 'desc' })
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let list = [...products]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.shop.toLowerCase().includes(q))
    }
    if (cat !== 'All') list = list.filter(p => p.category === cat)
    list.sort((a, b) => {
      const aV = (a as any)[sort.key] ?? ''
      const bV = (b as any)[sort.key] ?? ''
      if (typeof aV === 'number') return sort.dir === 'asc' ? aV - bV : bV - aV
      return sort.dir === 'asc' ? String(aV).localeCompare(String(bV)) : String(bV).localeCompare(String(aV))
    })
    return list
  }, [products, search, cat, sort])

  const pageSize = 25
  const totalPages = Math.ceil(filtered.length / pageSize)
  const pageItems = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const toggleSort = (key: string) => setSort(s => s.key === key && s.dir === 'desc' ? { key, dir: 'asc' } : { key, dir: 'desc' })

  const categoryStats = useMemo(() => categories.map(c => ({
    name: c, count: products.filter(p => p.category === c).length,
    avgComm: products.filter(p => p.category === c && p.commission).reduce((a, p) => a + (p.commission || 0), 0) / Math.max(products.filter(p => p.category === c && p.commission).length, 1)
  })), [products, categories])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground text-sm mt-1">{products.length} products from {categories.length} categories</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Products by Category</CardTitle></CardHeader>
        <CardContent>
          <BarChartCard data={categoryStats} dataKey="count" nameKey="name" color="#8b5cf6" height={250} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>Product Explorer</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  className="h-9 w-48 rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="Search products..."
                  value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
                />
              </div>
              <select className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                value={cat} onChange={e => { setCat(e.target.value); setPage(0) }}>
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0
            ? <div className="p-6 text-center text-muted-foreground">No matching products found.</div>
            : <Table>
                <THead>
                  <Tr>
                    <Th>#</Th>
                    <Th className="cursor-pointer select-none" onClick={() => toggleSort('name')}>Name <ArrowUpDown className="inline h-3 w-3 ml-1" /></Th>
                    <Th className="cursor-pointer select-none" onClick={() => toggleSort('price')}>Price <ArrowUpDown className="inline h-3 w-3 ml-1" /></Th>
                    <Th>Sales</Th>
                    <Th>Shop</Th>
                    <Th className="cursor-pointer select-none" onClick={() => toggleSort('commissionRate')}>Rate <ArrowUpDown className="inline h-3 w-3 ml-1" /></Th>
                    <Th className="cursor-pointer select-none" onClick={() => toggleSort('commission')}>Commission <ArrowUpDown className="inline h-3 w-3 ml-1" /></Th>
                    <Th>Category</Th>
                  </Tr>
                </THead>
                <TBody>
                  {pageItems.map((p, i) => (
                    <Tr key={p.id + i + ''}>
                      <Td className="text-muted-foreground text-xs">{page * pageSize + i + 1}</Td>
                      <Td className="max-w-[300px] truncate font-medium" title={p.name}>{p.name}</Td>
                      <Td>{p.price_raw}</Td>
                      <Td className="text-xs">{p.sales}</Td>
                      <Td className="max-w-[150px] truncate text-xs text-muted-foreground">{p.shop}</Td>
                      <Td><Badge variant="outline">{p.commissionRate}</Badge></Td>
                      <Td className="font-semibold text-success">
                        {p.commission ? `₫${p.commission.toLocaleString()}` : '-'}
                      </Td>
                      <Td><Badge variant="default">{p.category}</Badge></Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
          }
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">{filtered.length} total results</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-40" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
                <span className="text-xs text-muted-foreground">Page {page + 1}/{totalPages}</span>
                <button className="px-3 py-1 text-sm rounded-md border border-border disabled:opacity-40" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
