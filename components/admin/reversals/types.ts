export interface ReversalData {
  id: string
  transactionId: string
  merchantName: string
  amount: string
  reason: string
  status: 'Pending Approval' | 'Approved' | 'Rejected'
  createdBy: string
  createdAt: string
  approvedBy: string | null
  approvedAt: string | null
  originalTransaction: TransactionLookup
}

export interface TransactionLookup {
  id: string
  merchantName: string
  amount: string
  date: string
  customerName: string
  customerPhone: string
  paymentMethod: string
  status: string
}

export interface ReversalForm {
  transactionId: string
  reason: string
  amount: string
  notes: string
}

export interface ReversalFilters {
  searchTerm: string
  statusFilter: string
}

export interface PendingAction {
  action: 'approve' | 'reject'
  reversal: ReversalData
}

export const REVERSAL_REASONS = [
  "Customer complaint",
  "Duplicate transaction", 
  "Fraudulent transaction",
  "Technical error",
  "Merchant request",
  "Other"
] as const

export type ReversalReason = typeof REVERSAL_REASONS[number]
export type ReversalStatus = 'Pending Approval' | 'Approved' | 'Rejected' 