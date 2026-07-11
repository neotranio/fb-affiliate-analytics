export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className || ''}`} {...props}>{children}</div>
}
export function CardHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}>{children}</div>
}
export function CardTitle({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}>{children}</h3>
}
export function CardContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-0 ${className || ''}`}>{children}</div>
}