import { Page, PageHeader, PageTitle, PageBody, DataTable, Button, Badge, SearchInput } from '@blinkdotnew/ui'
import { Building2, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { blink } from '../blink/client'

export function BanksPage() {
  const [banks, setBanks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchBanks() {
      try {
        const data = await blink.db.banks.list()
        setBanks(data || [])
      } catch (error) {
        console.error('Failed to fetch banks:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBanks()
  }, [])

  const filteredBanks = (banks || []).filter(b => {
    const currentSearch = String(search || '').toLowerCase()
    const bankName = String(b?.name || '').toLowerCase()
    const country = String(b?.countryCode || '').toLowerCase()

    return bankName.includes(currentSearch) || country.includes(currentSearch)
  })

  const columns = [
    {
      accessorKey: 'name',
      header: 'Bank Name',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="font-medium">{row.original?.name || 'Unknown Bank'}</span>
        </div>
      )
    },
    {
      accessorKey: 'countryCode',
      header: 'Country',
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.original?.countryCode || 'N/A'}</Badge>
      )
    },
    {
      accessorKey: 'swiftCode',
      header: 'SWIFT / BIC',
      cell: ({ row }: any) => <span className="font-mono text-sm">{row.original?.swiftCode || 'N/A'}</span>
    },
    {
      id: 'actions',
      cell: () => (
        <Button variant="ghost" size="sm">Details</Button>
      )
    }
  ]

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <PageTitle>Supported Banks</PageTitle>
            <p className="text-muted-foreground">Browse the list of global banks available for receipt generation.</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Globe className="h-4 w-4" /> Request Bank
          </Button>
        </div>
      </PageHeader>
      <PageBody className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="w-full max-w-md">
            <SearchInput
              placeholder="Search by bank name or country..."
              value={search}
              onChange={(e: any) => {
                // Safeguard against custom library wrappers or raw events
                const value = e?.target ? e.target.value : String(e || '')
                setSearch(value)
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={filteredBanks} />
        )}
      </PageBody>
    </Page>
  )
}