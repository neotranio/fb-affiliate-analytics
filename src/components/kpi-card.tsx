'use client'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; label: string }
  color?: string
}

export function KpiCard({ title, value, icon, trend, color }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold" style={color ? { color } : undefined}>{value}</p>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                {trend.value >= 0
                  ? <TrendingUp className="h-3 w-3 text-success" />
                  : <TrendingDown className="h-3 w-3 text-danger" />}
                <span className={trend.value >= 0 ? 'text-success' : 'text-danger'}>
                  {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
                </span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}