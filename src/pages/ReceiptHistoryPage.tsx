import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageBody, 
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  toast
} from '@blinkdotnew/ui'
import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'
import { Link } from '@tanstack/react-router'
import { Download, FileText, Eye, Calendar, DollarSign } from 'lucide-react'

export function ReceiptHistoryPage() {
  const { user } = useAuth()
  const [receipts, setReceipts] = useState<any[]>([])
  const [banks, setBanks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHistoryData() {
      if (!user) return
      try {
        const [receiptList, bankList] = await Promise.all([
          blink.db.receipts.list({ where: { userId: user.id } }),
          blink.db.banks.list()
        ])
        setReceipts(receiptList || [])
        setBanks(bankList || [])
      } catch (error) {
        console.error('Failed to load history metrics:', error)
        toast.error('Could not fetch historical records.')
      } finally {
        setLoading(false)
      }
    }
    loadHistoryData()
  }, [user])

  // Custom client side CSV parsing and string construction stream engine 
  const exportToCSV = () => {
    if (receipts.length === 0) {
      toast.error('No receipts available to export.')
      return
    }

    // Define CSV Columns Headers
    const headers = [
      'ID', 'Bank Name', 'Sender Name', 'Sender Account', 
      'Receiver Name', 'Receiver Account', 'Amount', 'Currency', 
      'Reference', 'Transaction Date', 'Status'
    ]

    const csvRows = [headers.join(',')]

    for (const receipt of receipts) {
      const bankName = banks.find(b => b.id === receipt.bankId)?.name || 'Unknown Bank'
      
      const values = [
        receipt.id,
        `"${bankName.replace(/"/g, '""')}"`,
        `"${receipt.senderName.replace(/"/g, '""')}"`,
        `"${receipt.senderAccount.replace(/"/g, '""')}"`,
        `"${receipt.receiverName.replace(/"/g, '""')}"`,
        `"${receipt.receiverAccount.replace(/"/g, '""')}"`,
        receipt.amount,
        receipt.currency,
        `"${(receipt.reference || '').replace(/"/g, '""')}"`,
        receipt.transactionDate,
        receipt.status
      ]
      csvRows.push(values.join(','))
    }

    // Construct download link trigger sequence dynamically
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `receipts_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    
    link.click()
    document.body.removeChild(link)
    toast.success('CSV Export download completed!')
  }

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div className="space-y-1">
            <PageTitle>Receipt Ledger History</PageTitle>
            <p className="text-sm text-muted-foreground">Manage, view details, and export all generated transaction assets.</p>
          </div>
          {receipts.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" /> Export Ledger (.CSV)
            </Button>
          )}
        </div>
      </PageHeader>

      <PageBody>
        {loading ? (
          <div className="text-center py-12">Loading collection history records...</div>
        ) : receipts.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed space-y-4">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No receipts created yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You haven't generated any bank documents under this profile layer. Get started by heading to the creation layout module.
            </p>
            <Link to="/create">
              <Button size="sm">Create Receipt Now</Button>
            </Link>
          </div>
        ) : (
          <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => {
                  const associatedBank = banks.find(b => b.id === receipt.bankId)
                  return (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {new Date(receipt.transactionDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </TableCell>
                      <TableCell>{associatedBank?.name || 'Generic Bank'}</TableCell>
                      <TableCell>{receipt.receiverName}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: receipt.currency }).format(receipt.amount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{receipt.reference || 'None'}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/receipt/${receipt.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4 mr-1.5" /> View
                      </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </PageBody>
    </Page>
  )
}
