"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconCreditCard, IconAlertTriangle } from "@tabler/icons-react"
import { format } from "date-fns"
import { ReversalForm, TransactionLookup, ReversalData, REVERSAL_REASONS } from "./types"

interface CreateReversalFormProps {
  onReversalCreated: () => void
  transactionsData: TransactionLookup[]
  reversalsData: ReversalData[]
}

export function CreateReversalForm({ 
  onReversalCreated, 
  transactionsData, 
  reversalsData 
}: CreateReversalFormProps) {
  const [reversalForm, setReversalForm] = useState<ReversalForm>({
    transactionId: "",
    reason: "",
    amount: "",
    notes: ""
  })
  const [lookupResult, setLookupResult] = useState<TransactionLookup | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle transaction lookup
  const handleTransactionLookup = () => {
    // First check in transactions data
    let transaction = transactionsData.find(t => t.id === reversalForm.transactionId)
    
    // If not found, check in original transactions from reversals (with default status)
    if (!transaction) {
      const originalTransaction = reversalsData
        .map(r => r.originalTransaction)
        .find(t => t.id === reversalForm.transactionId)
      
      if (originalTransaction) {
        transaction = {
          ...originalTransaction,
          status: "Completed" // Default status for original transactions
        }
      }
    }
    
    if (transaction) {
      setLookupResult(transaction)
      setReversalForm(prev => ({ ...prev, amount: transaction.amount }))
    } else {
      setLookupResult(null)
      alert("Transaction not found")
    }
  }

  // Handle reversal creation
  const handleCreateReversal = async () => {
    if (!lookupResult || !reversalForm.reason) {
      alert("Please fill all required fields")
      return
    }

    setIsProcessing(true)
    
    // Simulate API call
    setTimeout(() => {
      const newReversal: ReversalData = {
        id: `REV-${Date.now()}`,
        transactionId: reversalForm.transactionId,
        merchantName: lookupResult.merchantName,
        amount: reversalForm.amount,
        reason: reversalForm.reason,
        status: "Pending Approval",
        createdBy: "Current Admin",
        createdAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
        originalTransaction: lookupResult
      }
      
      // Add to data (in real app, this would be API call)
      reversalsData.unshift(newReversal)
      
      // Reset form
      setReversalForm({ transactionId: "", reason: "", amount: "", notes: "" })
      setLookupResult(null)
      setIsProcessing(false)
      
      alert("Reversal request created successfully!")
      onReversalCreated()
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconCreditCard className="h-5 w-5" />
          Create Fund Reversal
        </CardTitle>
        <CardDescription>
          Search for a transaction and create a reversal request
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Lookup */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="transactionId">Transaction ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="transactionId"
                placeholder="Enter transaction ID (e.g., TXN-111222)"
                value={reversalForm.transactionId}
                onChange={(e) => setReversalForm(prev => ({ ...prev, transactionId: e.target.value }))}
              />
              <Button 
                variant="outline" 
                onClick={handleTransactionLookup}
                disabled={!reversalForm.transactionId}
              >
                Lookup
              </Button>
            </div>
          </div>

          {/* Transaction Details */}
          {lookupResult && (
            <Alert>
              <IconAlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Transaction Found:</strong></p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <p><strong>ID:</strong> {lookupResult.id}</p>
                    <p><strong>Amount:</strong> {lookupResult.amount}</p>
                    <p><strong>Merchant:</strong> {lookupResult.merchantName}</p>
                    <p><strong>Customer:</strong> {lookupResult.customerName}</p>
                    <p><strong>Date:</strong> {format(new Date(lookupResult.date), "MMM dd, yyyy HH:mm")}</p>
                    <p><strong>Method:</strong> {lookupResult.paymentMethod}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Reversal Form */}
        {lookupResult && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reason">Reversal Reason *</Label>
                <Select 
                  value={reversalForm.reason} 
                  onValueChange={(value) => setReversalForm(prev => ({ ...prev, reason: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVERSAL_REASONS.map(reason => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Reversal Amount</Label>
                <Input
                  id="amount"
                  value={reversalForm.amount}
                  onChange={(e) => setReversalForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Amount to reverse"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information about this reversal..."
                value={reversalForm.notes}
                onChange={(e) => setReversalForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleCreateReversal}
              disabled={isProcessing || !reversalForm.reason}
              className="w-full sm:w-auto"
            >
              {isProcessing ? "Creating..." : "Create Reversal Request"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 