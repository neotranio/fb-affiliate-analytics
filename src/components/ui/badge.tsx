interface BadgeProps { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline'; className?: string }
const variants: Record<string, string> = {
  default: 'bg-primary text-primary-foreground',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  outline: 'border border-border text-muted-foreground',
}
export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>
}