"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CreateReversalForm,
  ReversalsList,
  ReversalDialogs,
  ReversalData,
  TransactionLookup,
  ReversalFilters,
  PendingAction,
  ReversalStatus
} from "@/components/admin/reversals";

// Sample reversals data
const reversalsData: ReversalData[] = [
  {
    id: "REV-001",
    transactionId: "TXN-123456",
    merchantName: "BluWave Limited",
    amount: "GHS2,500.00",
    reason: "Customer complaint - unauthorized transaction",
    status: "Pending Approval",
    createdBy: "John Admin",
    createdAt: "2023-10-15T10:30:00",
    approvedBy: null,
    approvedAt: null,
    originalTransaction: {
      id: "TXN-123456",
      merchantName: "BluWave Limited",
      amount: "GHS2,500.00",
      date: "2023-10-14T14:30:00",
      customerName: "Alice Johnson",
      customerPhone: "+233 54 123 4567",
      paymentMethod: "Mobile Money",
      status: "Completed"
    }
  },
  {
    id: "REV-002", 
    transactionId: "TXN-789012",
    merchantName: "Chensha City Ghana Ltd",
    amount: "GHS1,200.00",
    reason: "Duplicate transaction",
    status: "Approved",
    createdBy: "Sarah Admin",
    createdAt: "2023-10-14T09:15:00",
    approvedBy: "Super Admin",
    approvedAt: "2023-10-14T10:45:00",
    originalTransaction: {
      id: "TXN-789012",
      merchantName: "Chensha City Ghana Ltd",
      amount: "GHS1,200.00", 
      date: "2023-10-13T11:20:00",
      customerName: "Michael Smith",
      customerPhone: "+233 50 987 6543",
      paymentMethod: "Card",
      status: "Completed"
    }
  },
  {
    id: "REV-003",
    transactionId: "TXN-345678", 
    merchantName: "Blu Penguin",
    amount: "GHS5,000.00",
    reason: "Fraudulent transaction",
    status: "Rejected",
    createdBy: "Mike Admin",
    createdAt: "2023-10-13T16:45:00",
    approvedBy: "Super Admin",
    approvedAt: "2023-10-13T17:30:00",
    originalTransaction: {
      id: "TXN-345678",
      merchantName: "Blu Penguin",
      amount: "GHS5,000.00",
      date: "2023-10-12T15:10:00", 
      customerName: "Emma Wilson",
      customerPhone: "+233 24 789 0123",
      paymentMethod: "Bank Transfer",
      status: "Completed"
    }
  }
];

// Sample transactions for lookup
const transactionsData: TransactionLookup[] = [
  {
    id: "TXN-111222",
    merchantName: "QuickServe Ltd",
    amount: "GHS850.00",
    date: "2023-10-15T12:00:00",
    customerName: "David Asante",
    customerPhone: "+233 27 345 6789",
    paymentMethod: "Mobile Money",
    status: "Successful"
  },
  {
    id: "TXN-333444", 
    merchantName: "GhanaTech Solutions",
    amount: "GHS3,200.00",
    date: "2023-10-15T08:30:00",
    customerName: "Grace Mensah",
    customerPhone: "+233 55 111 2233",
    paymentMethod: "Card",
    status: "Successful"
  }
];

export default function ReversalsPage() {
  const [activeTab, setActiveTab] = useState("create");
  const [filters, setFilters] = useState<ReversalFilters>({
    searchTerm: "",
    statusFilter: "all"
  });
  
  // Dialog states
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionLookup | null>(null);
  const [selectedReversal, setSelectedReversal] = useState<ReversalData | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is super admin (normally from auth context)
  const isSuperAdmin = true;

  // Handlers
  const handleReversalCreated = () => {
    setActiveTab("pending");
  };

  const handleViewTransaction = (transaction: TransactionLookup) => {
    setSelectedTransaction(transaction);
    setShowTransactionDialog(true);
  };

  const handleReviewReversal = (reversal: ReversalData) => {
    setSelectedReversal(reversal);
    setShowApprovalDialog(true);
  };

  const handleApprovalAction = (action: "approve" | "reject") => {
    if (!selectedReversal) return;
    
    setPendingAction({ action, reversal: selectedReversal });
    setShowApprovalDialog(false);
    setShowOtpDialog(true);
  };

  const handleOtpVerification = async () => {
    if (!pendingAction) return;
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { action, reversal } = pendingAction;
      const updatedStatus = action === "approve" ? "Approved" : "Rejected";
      const reversalIndex = reversalsData.findIndex(r => r.id === reversal.id);
      
      if (reversalIndex !== -1) {
        reversalsData[reversalIndex] = {
          ...reversalsData[reversalIndex],
          status: updatedStatus as ReversalStatus,
          approvedBy: "Super Admin",
          approvedAt: new Date().toISOString()
        };
      }
      
      // Close dialogs and reset state
      setShowOtpDialog(false);
      setPendingAction(null);
      setSelectedReversal(null);
      
      alert(`Reversal ${action}d successfully!`);
    } catch {
      throw new Error("OTP verification failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Fund Reversals</h1>
          <p className="text-sm text-muted-foreground">Manage transaction reversals and approvals</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Reversal</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Approvals
            {isSuperAdmin && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {reversalsData.filter(r => r.status === "Pending Approval").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <CreateReversalForm
            onReversalCreated={handleReversalCreated}
            transactionsData={transactionsData}
            reversalsData={reversalsData}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <ReversalsList
            reversalsData={reversalsData}
            filters={filters}
            onFiltersChange={setFilters}
            isSuperAdmin={isSuperAdmin}
            onViewTransaction={handleViewTransaction}
            onReviewReversal={handleReviewReversal}
          />
        </TabsContent>
      </Tabs>

      <ReversalDialogs
        showTransactionDialog={showTransactionDialog}
        setShowTransactionDialog={setShowTransactionDialog}
        selectedTransaction={selectedTransaction}
        showApprovalDialog={showApprovalDialog}
        setShowApprovalDialog={setShowApprovalDialog}
        selectedReversal={selectedReversal}
        onApprovalAction={handleApprovalAction}
        showOtpDialog={showOtpDialog}
        setShowOtpDialog={setShowOtpDialog}
        pendingAction={pendingAction}
        isProcessing={isProcessing}
        onOtpVerification={handleOtpVerification}
      />
    </div>
  );
} 