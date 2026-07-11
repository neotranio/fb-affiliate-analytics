'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4']

export function BarChartCard({ data, dataKey, nameKey, title, color = '#6366f1', height = 300 }: {
  data: any[]; dataKey: string; nameKey: string; title?: string; color?: string; height?: number
}) {
  return (
    <div>
      {title && <h4 className="text-sm font-medium text-muted-foreground mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <XAxis dataKey={nameKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PieChartCard({ data, dataKey, nameKey, title, height = 300 }: {
  data: any[]; dataKey: string; nameKey: string; title?: string; height?: number
}) {
  return (
    <div>
      {title && <h4 className="text-sm font-medium text-muted-foreground mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={100}
            label={(entry: any) =>
              `${entry.name || ''} ${((entry.percent || 0) * 100).toFixed(0)}%`}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AreaChartCard({ data, dataKey, nameKey, title, height = 200 }: {
  data: any[]; dataKey: string; nameKey: string; title?: string; height?: number
}) {
  return (
    <div>
      {title && <h4 className="text-sm font-medium text-muted-foreground mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <XAxis dataKey={nameKey} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey={dataKey} stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export { COLORS }
