import { getState } from '@/lib/data'
import TimelineClient from '@/components/timeline-client'

export default function TimelinePage() {
  const state = getState()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Timeline</h1>
        <p className="text-muted-foreground text-sm mt-1">Account activity history</p>
      </div>
      <TimelineClient state={state} />
    </div>
  )
}