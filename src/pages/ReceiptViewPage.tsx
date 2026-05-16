import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageBody, 
  Button,
  Card,
  Separator
} from '@blinkdotnew/ui'
import { useParams, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { blink } from '../blink/client'
import { 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Building2, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react'
import { format } from 'date-fns'

export function ReceiptViewPage() {
  const { id } = useParams({ from: '/receipt/$id' })
  const [receipt, setReceipt] = useState<any>(null)
  const [bank, setBank] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const r = await blink.db.receipts.get(id)
        if (r) {
          setReceipt(r)
          const b = await blink.db.banks.get(r.bankId)
          setBank(b)
        }
      } catch (error) {
        console.error('Failed to fetch receipt:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Bank Receipt - ${receipt.reference}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!receipt) {
    return (
      <Page>
        <PageBody>
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Receipt Not Found</h2>
            <p className="text-muted-foreground mt-2">The receipt you are looking for does not exist or has been deleted.</p>
            <Link to="/">
              <Button className="mt-6">Go to Dashboard</Button>
            </Link>
          </div>
        </PageBody>
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Link to="/history">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <PageTitle>Transfer Receipt</PageTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>ID: {receipt.id}</span>
                <Separator orientation="vertical" className="h-3" />
                <span>{format(new Date(receipt.createdAt), 'MMM dd, yyyy HH:mm')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>
      </PageHeader>
      
      <PageBody>
        <div className="max-w-3xl mx-auto py-8">
          <div 
            ref={receiptRef}
            className="bg-white text-slate-900 border border-slate-200 rounded-xl shadow-xl overflow-hidden print:shadow-none print:border-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-8 flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight uppercase">{bank?.name || 'Bank Transfer'}</span>
                    <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Official Payment Advice</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold uppercase">
                  <CheckCircle2 className="h-3 w-3" />
                  Transaction Successful
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date & Time</p>
                <p className="text-sm font-semibold">{format(new Date(receipt.transactionDate), 'dd MMM yyyy · HH:mm')}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4">Reference Number</p>
                <p className="text-sm font-mono font-semibold text-primary">{receipt.id.toUpperCase()}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8 space-y-10">
              {/* Amount Display */}
              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Amount Transferred</p>
                <h2 className="text-4xl font-black text-slate-900">
                  <span className="text-2xl font-bold mr-1">{receipt.currency}</span>
                  {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(receipt.amount)}
                </h2>
                <p className="text-[11px] text-slate-500 mt-2 font-medium italic">
                  "{toWords(receipt.amount)} {receipt.currency} Only"
                </p>
              </div>

              {/* Transfer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* From */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                      <ArrowLeft className="h-3 w-3 text-slate-500 rotate-180" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">From Sender</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Name</p>
                      <p className="text-sm font-bold text-slate-800 uppercase">{receipt.senderName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Account Details</p>
                      <p className="text-sm font-mono font-medium text-slate-600">{formatAccount(receipt.senderAccount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Issuing Bank</p>
                      <p className="text-sm font-bold text-slate-800">{bank?.name}</p>
                    </div>
                  </div>
                </div>

                {/* To */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                      <ChevronRight className="h-3 w-3 text-slate-500" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">To Recipient</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Name</p>
                      <p className="text-sm font-bold text-slate-800 uppercase">{receipt.receiverName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Account Details</p>
                      <p className="text-sm font-mono font-medium text-slate-600">{formatAccount(receipt.receiverAccount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Payment Reference</p>
                      <p className="text-sm font-bold text-slate-800 italic">"{receipt.reference}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Security Status</p>
                    <p className="text-[11px] font-bold text-slate-700">Verified & Secure</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Network</p>
                    <p className="text-[11px] font-bold text-slate-700">Global SWIFT/IBAN</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-900 p-6 text-center">
              <p className="text-[9px] text-slate-400 leading-relaxed max-w-md mx-auto italic">
                This is a computer-generated document and does not require a physical signature. 
                Please note that transfer times may vary depending on the banking network and holidays.
              </p>
              <div className="mt-4 flex justify-center items-center gap-4">
                <div className="h-6 w-16 bg-slate-800 rounded opacity-50 flex items-center justify-center">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">Verified</span>
                </div>
                <div className="h-6 w-16 bg-slate-800 rounded opacity-50 flex items-center justify-center">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">Secure</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full border border-border">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              This document is authentic for internal team verification purposes.
            </p>
          </div>
        </div>
      </PageBody>
    </Page>
  )
}

function toWords(num: number): string {
  // Simple to-words for v1
  return num.toLocaleString()
}

function formatAccount(acc: string): string {
  if (acc.length <= 8) return acc
  return acc.replace(/(.{4})/g, '$1 ').trim()
}
