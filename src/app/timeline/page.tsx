import { getState } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link, Globe, RefreshCw, User } from 'lucide-react'

export default function TimelinePage() {
  const state = getState()

  const timeline = state.accounts.flatMap(acct =>
    (acct.groups_used_count > 0
      ? [{
          title: `${acct.email} posted in ${acct.groups_used_count} groups`,
          detail: `${acct.posted_count} posts total`,
          status: acct.status,
          comments: acct.anonymous_commented || 0,
        }]
      : [])
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Timeline</h1>
        <p className="text-muted-foreground text-sm mt-1">Account activity history</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Link className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{state.totalPostedLinks}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Groups</CardTitle>
            <Globe className="h-5 w-5 text-muted-foreground" />
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
        <CardHeader><CardTitle>Latest Posted Links</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
            {state.postedLinks.slice(-50).reverse().map((link, i) => (
              <div key={i} className="px-6 py-2.5 text-xs text-muted-foreground truncate">
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {link}
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
