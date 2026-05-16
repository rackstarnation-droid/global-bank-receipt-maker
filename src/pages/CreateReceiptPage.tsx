import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageBody, 
  StepForm, 
  StepFormStep, 
  Input, 
  Button, 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem,
  toast
} from '@blinkdotnew/ui'
import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { Building2, User, Landmark, DollarSign, CheckCircle2 } from 'lucide-react'

export function CreateReceiptPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [countries, setCountries] = useState<any[]>([])
  const [banks, setBanks] = useState<any[]>([])
  const [formData, setFormData] = useState({
    countryCode: '',
    bankId: '',
    senderName: '',
    senderAccount: '',
    receiverName: '',
    receiverAccount: '',
    amount: '',
    currency: 'USD',
    reference: 'Transfer',
    transactionDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    async function fetchData() {
      const countryList = await blink.db.countries.list()
      setCountries(countryList)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchBanks() {
      if (!formData.countryCode) return
      const bankList = await blink.db.banks.list({
        where: { countryCode: formData.countryCode }
      })
      setBanks(bankList)
      
      const country = countries.find(c => c.code === formData.countryCode)
      if (country) {
        setFormData(prev => ({ ...prev, currency: country.currency }))
      }
    }
    fetchBanks()
  }, [formData.countryCode, countries])

  const handleSubmit = async () => {
    if (!user) return
    
    try {
      const receipt = await blink.db.receipts.create({
        userId: user.id,
        bankId: formData.bankId,
        senderName: formData.senderName,
        senderAccount: formData.senderAccount,
        receiverName: formData.receiverName,
        receiverAccount: formData.receiverAccount,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        reference: formData.reference,
        transactionDate: new Date(formData.transactionDate).toISOString(),
        status: 'completed'
      })
      
      toast.success('Receipt generated successfully!')
      navigate({ to: '/receipt/$id', params: { id: receipt.id } })
    } catch (error) {
      console.error('Failed to create receipt:', error)
      toast.error('Failed to generate receipt. Please try again.')
    }
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Create Bank Receipt</PageTitle>
        <p className="text-muted-foreground">Follow the steps to generate a professional bank transfer document.</p>
      </PageHeader>
      <PageBody>
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-8 shadow-sm">
          <StepForm onComplete={handleSubmit}>
            {/* Step 1: Bank Selection */}
            <StepFormStep 
              title="Bank Details" 
              description="Select the issuing bank and country"
              icon={<Building2 className="h-4 w-4" />}
            >
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Select 
                    value={formData.countryCode} 
                    onValueChange={(val) => setFormData({ ...formData, countryCode: val, bankId: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank</label>
                  <Select 
                    value={formData.bankId} 
                    onValueChange={(val) => setFormData({ ...formData, bankId: val })}
                    disabled={!formData.countryCode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.countryCode ? "Select bank" : "Select country first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </StepFormStep>

            {/* Step 2: Sender Info */}
            <StepFormStep 
              title="Sender" 
              description="Enter sender account information"
              icon={<User className="h-4 w-4" />}
            >
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sender Name</label>
                  <Input 
                    placeholder="e.g. John Doe" 
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sender Account Number / IBAN</label>
                  <Input 
                    placeholder="e.g. US1234567890" 
                    value={formData.senderAccount}
                    onChange={(e) => setFormData({ ...formData, senderAccount: e.target.value })}
                  />
                </div>
              </div>
            </StepFormStep>

            {/* Step 3: Receiver Info */}
            <StepFormStep 
              title="Receiver" 
              description="Enter recipient account information"
              icon={<Landmark className="h-4 w-4" />}
            >
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Receiver Name</label>
                  <Input 
                    placeholder="e.g. Jane Smith" 
                    value={formData.receiverName}
                    onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Receiver Account Number / IBAN</label>
                  <Input 
                    placeholder="e.g. US0987654321" 
                    value={formData.receiverAccount}
                    onChange={(e) => setFormData({ ...formData, receiverAccount: e.target.value })}
                  />
                </div>
              </div>
            </StepFormStep>

            {/* Step 4: Transaction Details */}
            <StepFormStep 
              title="Transaction" 
              description="Enter transfer amount and date"
              icon={<DollarSign className="h-4 w-4" />}
            >
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <Input value={formData.currency} readOnly disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input 
                    type="date" 
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reference (Optional)</label>
                  <Input 
                    placeholder="e.g. Invoice #123" 
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  />
                </div>
              </div>
            </StepFormStep>

            {/* Step 5: Review */}
            <StepFormStep 
              title="Review" 
              description="Confirm details before generating"
              icon={<CheckCircle2 className="h-4 w-4" />}
            >
              <div className="space-y-4 pt-4 border rounded-lg p-4 bg-muted/20">
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="font-medium">{banks.find(b => b.id === formData.bankId)?.name || 'N/A'}</span>
                  
                  <span className="text-muted-foreground">Sender:</span>
                  <span className="font-medium">{formData.senderName}</span>
                  
                  <span className="text-muted-foreground">Receiver:</span>
                  <span className="font-medium">{formData.receiverName}</span>
                  
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-primary">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: formData.currency }).format(parseFloat(formData.amount) || 0)}
                  </span>
                  
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{formData.transactionDate}</span>
                </div>
              </div>
            </StepFormStep>
          </StepForm>
        </div>
      </PageBody>
    </Page>
  )
}
