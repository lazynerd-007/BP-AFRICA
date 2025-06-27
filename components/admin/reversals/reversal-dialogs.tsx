"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { OTPVerification } from "@/components/ui/otp-verification"
import { format } from "date-fns"
import { ReversalData, TransactionLookup, PendingAction } from "./types"

interface ReversalDialogsProps {
  // Transaction Details Dialog
  showTransactionDialog: boolean
  setShowTransactionDialog: (show: boolean) => void
  selectedTransaction: TransactionLookup | null
  
  // Approval Dialog
  showApprovalDialog: boolean
  setShowApprovalDialog: (show: boolean) => void
  selectedReversal: ReversalData | null
  onApprovalAction: (action: "approve" | "reject") => void
  
  // OTP Dialog
  showOtpDialog: boolean
  setShowOtpDialog: (show: boolean) => void
  pendingAction: PendingAction | null
  isProcessing: boolean
  onOtpVerification: () => Promise<void>
}

export function ReversalDialogs({
  showTransactionDialog,
  setShowTransactionDialog,
  selectedTransaction,
  showApprovalDialog,
  setShowApprovalDialog,
  selectedReversal,
  onApprovalAction,
  showOtpDialog,
  setShowOtpDialog,
  pendingAction,
  isProcessing,
  onOtpVerification
}: ReversalDialogsProps) {
  return (
    <>
      {/* Transaction Details Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>ID:</strong></div>
                <div>{selectedTransaction.id}</div>
                <div><strong>Amount:</strong></div>
                <div>{selectedTransaction.amount}</div>
                <div><strong>Customer:</strong></div>
                <div>{selectedTransaction.customerName}</div>
                <div><strong>Phone:</strong></div>
                <div>{selectedTransaction.customerPhone}</div>
                <div><strong>Method:</strong></div>
                <div>{selectedTransaction.paymentMethod}</div>
                <div><strong>Date:</strong></div>
                <div>{format(new Date(selectedTransaction.date), "MMM dd, yyyy HH:mm")}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransactionDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Reversal Request</DialogTitle>
            <DialogDescription>
              Review the details and approve or reject this reversal request.
            </DialogDescription>
          </DialogHeader>
          {selectedReversal && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Reversal ID:</strong></div>
                  <div>{selectedReversal.id}</div>
                  <div><strong>Transaction:</strong></div>
                  <div>{selectedReversal.transactionId}</div>
                  <div><strong>Amount:</strong></div>
                  <div>{selectedReversal.amount}</div>
                  <div><strong>Merchant:</strong></div>
                  <div>{selectedReversal.merchantName}</div>
                  <div><strong>Reason:</strong></div>
                  <div className="col-span-2">{selectedReversal.reason}</div>
                  <div><strong>Created by:</strong></div>
                  <div>{selectedReversal.createdBy}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onApprovalAction("reject")}
            >
              Reject
            </Button>
            <Button 
              onClick={() => onApprovalAction("approve")}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Action</DialogTitle>
            <DialogDescription>
              Enter your OTP to confirm this {pendingAction?.action} action.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <OTPVerification
              onComplete={onOtpVerification}
              length={6}
              loading={isProcessing}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowOtpDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 