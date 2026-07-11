import React from 'react'

export function Table({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <div className="overflow-x-auto"><table className={`w-full text-sm ${className || ''}`} {...props}>{children}</table></div>
}
export function THead({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`border-b border-border ${className || ''}`} {...props}>{children}</thead>
}
export function Th({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`h-10 px-4 text-left align-middle font-medium text-muted-foreground ${className || ''}`} {...props}>{children}</th>
}
export function Td({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`p-4 align-middle ${className || ''}`} {...props}>{children}</td>
}
export function TBody({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="[&_tr:last-child]:border-0" {...props}>{children}</tbody>
}
export function Tr({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`border-b border-border transition-colors hover:bg-muted/50 ${className || ''}`} {...props}>{children}</tr>
}
