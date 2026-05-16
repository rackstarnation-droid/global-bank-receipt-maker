import { Page, PageHeader, PageTitle, PageBody, StatGroup, Stat, DataTable, Button, EmptyState } from '@blinkdotnew/ui'
import { Plus, History, Receipt, TrendingUp } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'
import { format } from 'date-fns'

export function DashboardPage() {
  const { user } = useAuth()
  const [receipts, setReceipts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReceipts() {
      if (!user) return
      try {
        const data = await blink.db.receipts.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          limit: 10
        })
        setReceipts(data || [])
      } catch (error) {
        console.error('Failed to fetch receipts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReceipts()
  }, [user])

  const columns = [
    {
      accessorKey: 'receiverName',
      header: 'Recipient',
      cell: ({ row }: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original?.receiverName || 'Unknown'}</span>
          <span className="text-xs text-muted-foreground">{row.original?.receiverAccount || ''}</span>
        </div>
      )
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: any) => (
        <span className="font-mono">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: row.original?.currency || 'USD'
          }).format(row.original?.amount || 0)}
        </span>
      )
    },
    {
      accessorKey: 'transactionDate',
      header: 'Date',
      cell: ({ row }: any) => {
        if (!row.original?.transactionDate) return 'N/A'
        try {
          return format(new Date(row.original.transactionDate), 'MMM dd, yyyy')
        } catch {
          return 'N/A'
        }
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          {row.original?.status || 'Completed'}
        </span>
      )
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <Link to={`/receipt/${row.original?.id}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
      )
    }
  ]

  const totalAmount = receipts.reduce((acc, curr) => acc + (curr?.amount || 0), 0)

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <PageTitle>Welcome back, {user?.displayName || 'User'}</PageTitle>
            <p className="text-muted-foreground">Here's what's happening with your receipts today.</p>
          </div>
          <Link to="/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Receipt
            </Button>
          </Link>
        </div>
      </PageHeader>
      <PageBody className="space-y-8">
        <StatGroup>
          <Stat
            label="Total Generated"
            value={receipts.length.toString()}
            icon={<Receipt className="h-4 w-4" />}
            trend={12}
            trendLabel="from last week"
          />
          <Stat
            label="Volume (USD eq)"
            value={`$${totalAmount.toLocaleString()}`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <Stat
            label="Active Banks"
            value="12"
            icon={<History className="h-4 w-4" />}
          />
        </StatGroup>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Receipts</h3>
            <Link to="/history" className="text-sm text-primary hover:underline">View all</Link>
          </div>

          {isLoading ? (
            <div className="rounded-lg border border-border p-8 text-center bg-card flex flex-col items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-primary opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-muted-foreground">Loading history...</p>
            </div>
          ) : receipts.length === 0 ? (
            <EmptyState
              icon={<Receipt className="h-12 w-12 text-muted-foreground" />}
              title="No receipts found"
              description="Start by generating your first bank transfer receipt."
              action={{
                label: 'Create Receipt',
                onClick: () => window.location.hash = '#/create'
              }}
            />
          ) : (
            <DataTable columns={columns} data={receipts} />
          )}
        </div>
      </PageBody>
    </Page>
  )
}