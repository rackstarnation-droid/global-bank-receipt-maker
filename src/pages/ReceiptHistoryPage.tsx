import { Page, PageHeader, PageTitle, PageBody, DataTable, Button, EmptyState, SearchInput } from '@blinkdotnew/ui'
import { Receipt, Search, Download, Eye } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'
import { format } from 'date-fns'

export function ReceiptHistoryPage() {
  const { user } = useAuth()
  const [receipts, setReceipts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchReceipts() {
      if (!user) return
      try {
        const data = await blink.db.receipts.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        })
        setReceipts(data)
      } catch (error) {
        console.error('Failed to fetch receipts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReceipts()
  }, [user])

  const filteredReceipts = receipts.filter(r => 
    r.receiverName.toLowerCase().includes(search.toLowerCase()) ||
    r.receiverAccount.includes(search) ||
    r.reference?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    {
      accessorKey: 'receiverName',
      header: 'Recipient',
      cell: ({ row }: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.receiverName}</span>
          <span className="text-xs text-muted-foreground">{row.original.receiverAccount}</span>
        </div>
      )
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: any) => (
        <span className="font-mono">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: row.original.currency }).format(row.original.amount)}
        </span>
      )
    },
    {
      accessorKey: 'transactionDate',
      header: 'Transaction Date',
      cell: ({ row }: any) => format(new Date(row.original.transactionDate), 'MMM dd, yyyy')
    },
    {
      accessorKey: 'reference',
      header: 'Reference'
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Link to={`/receipt/${row.original.id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="h-3.5 w-3.5" /> View
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <Page>
      <PageHeader>
        <PageTitle>Receipt History</PageTitle>
        <p className="text-muted-foreground">View and manage all your generated bank transfer documents.</p>
      </PageHeader>
      <PageBody className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="w-full max-w-md">
            <SearchInput 
              placeholder="Search by recipient or reference..." 
              value={search}
              onChange={(val) => setSearch(val)}
            />
          </div>
          <Button variant="outline">Export CSV</Button>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : filteredReceipts.length === 0 ? (
          <EmptyState 
            icon={<Receipt className="h-12 w-12 text-muted-foreground" />}
            title="No history found"
            description={search ? "No receipts match your search criteria." : "You haven't generated any receipts yet."}
          />
        ) : (
          <DataTable columns={columns} data={filteredReceipts} />
        )}
      </PageBody>
    </Page>
  )
}
