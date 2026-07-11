'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AreaChartCard } from '@/components/charts'
import { Link, Users, RefreshCw, User } from 'lucide-react'
import type { DashboardState } from '@/lib/types'

interface Bucket { label: string; ts: string; count: number; index: number }

function bucketTimeline(entries: { ts: string; url: string }[]): Bucket[] {
  if (!entries.length) return []
  const sorted = [...entries].sort((a, b) => a.ts.localeCompare(b.ts))
  const buckets: Bucket[] = []
  const bucketSize = Math.max(1, Math.ceil(sorted.length / 30))
  for (let i = 0; i < sorted.length; i += bucketSize) {
    const slice = sorted.slice(i, i + bucketSize)
    const label = slice.length > 1
      ? `${slice[0].ts.slice(11, 16)}-${slice[slice.length - 1].ts.slice(11, 16)}`
      : slice[0].ts.slice(11, 16)
    buckets.push({ label, ts: slice[0].ts, count: slice.length, index: i })
  }
  return buckets
}

export default function TimelineClient({ state }: { state: DashboardState }) {
  const rawTimeline = state.postedTimeline || []
  const timeline: { ts: string; url: string }[] = rawTimeline.length > 0 ? rawTimeline
    : state.postedLinks.map(u => ({ ts: '', url: u }))
  const buckets = bucketTimeline(timeline)
  const [activeBucketIdx, setActiveBucketIdx] = useState<number | null>(null)

  const chartData = buckets.map(b => ({ name: b.label, posts: b.count }))
  const bucketSize = Math.max(1, Math.ceil(timeline.length / 30))

  const activeBucket = activeBucketIdx !== null ? buckets[activeBucketIdx] : null
  const highlightedEntries = activeBucket
    ? timeline.slice(activeBucket.index, activeBucket.index + bucketSize)
    : []

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Link className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{state.totalPostedLinks}</p></CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Groups</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{state.totalGroups}</p></CardContent>
        </Card>
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cycle</CardTitle>
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{state.currentCycle + 1}</p></CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 inline-block" />
              Post Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChartCard
              data={chartData} dataKey="posts" nameKey="name" height={200}
              onHover={(idx) => setActiveBucketIdx(idx ?? null)} />
            {activeBucket && (
              <div className="mt-3 text-xs text-center text-muted-foreground">
                Hovering: <span className="font-medium text-foreground">{activeBucket.label}</span> — {activeBucket.count} posts
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {state.accounts.length > 0 && (
        <Card className="card-hover">
          <CardHeader><CardTitle>Account Activity</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {state.accounts.map((acct, i) => (
                <div key={acct.email} className="flex items-center justify-between px-6 py-4 transition-colors duration-150 hover:bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{acct.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {acct.posted_count} posts in {acct.groups_used_count} groups
                        {acct.anonymous_commented > 0 ? ` | ${acct.anonymous_commented} anonymous comments` : ''}
                      </p>
                    </div>
                  </div>
                  <Badge variant={acct.status === 'active' ? 'success' : 'warning'}>
                    {acct.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Latest Posted Links</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
            {(activeBucket ? highlightedEntries : timeline.slice(-50).reverse()).map((entry, i) => {
              const url = typeof entry === 'string' ? entry : entry.url
              const ts = typeof entry === 'string' ? '' : entry.ts
              return (
                <div key={i} className={`flex items-center gap-3 px-6 py-2.5 text-xs truncate transition-colors duration-150 ${activeBucket ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                  {ts && <span className="shrink-0 w-14 text-right text-[10px] text-muted-foreground/60">{ts.slice(11, 16)}</span>}
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                    {url}
                  </a>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}