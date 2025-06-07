"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OTPVerification } from "@/components/ui/otp-verification";
import { IconSearch, IconEye, IconCheck, IconX, IconAlertTriangle, IconCreditCard } from "@tabler/icons-react";
import { format } from "date-fns";

// Sample reversals data
const reversalsData = [
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
      paymentMethod: "Mobile Money"
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
      paymentMethod: "Card"
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
      paymentMethod: "Bank Transfer"
    }
  }
];

// Sample transactions for lookup
const transactionsData = [
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

// Create a unified transaction type for lookups
type TransactionLookup = {
  id: string;
  merchantName: string;
  amount: string;
  date: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  status: string;
};

interface ReversalForm {
  transactionId: string;
  reason: string;
  amount: string;
  notes: string;
}

export default function ReversalsPage() {
  const [activeTab, setActiveTab] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: "approve" | "reject"; reversal: typeof reversalsData[0] } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionLookup | null>(null);
  const [selectedReversal, setSelectedReversal] = useState<typeof reversalsData[0] | null>(null);
  const [reversalForm, setReversalForm] = useState<ReversalForm>({
    transactionId: "",
    reason: "",
    amount: "",
    notes: ""
  });
  const [lookupResult, setLookupResult] = useState<TransactionLookup | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is super admin (normally from auth context)
  const isSuperAdmin = true; // This would come from your auth system

  // Filter reversals
  const filteredReversals = useMemo(() => {
    return reversalsData.filter(reversal => {
      const matchesSearch = searchTerm === "" || 
        reversal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reversal.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reversal.merchantName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        reversal.status.toLowerCase().replace(" ", "") === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved": return "default";
      case "Pending Approval": return "outline";
      case "Rejected": return "destructive";
      default: return "secondary";
    }
  };

  // Handle transaction lookup
  const handleTransactionLookup = () => {
    // First check in transactions data
    let transaction = transactionsData.find(t => t.id === reversalForm.transactionId);
    
    // If not found, check in original transactions from reversals (with default status)
    if (!transaction) {
      const originalTransaction = reversalsData
        .map(r => r.originalTransaction)
        .find(t => t.id === reversalForm.transactionId);
      
      if (originalTransaction) {
        transaction = {
          ...originalTransaction,
          status: "Completed" // Default status for original transactions
        };
      }
    }
    
    if (transaction) {
      setLookupResult(transaction);
      setReversalForm(prev => ({ ...prev, amount: transaction.amount }));
    } else {
      setLookupResult(null);
      alert("Transaction not found");
    }
  };

  // Handle reversal creation
  const handleCreateReversal = async () => {
    if (!lookupResult || !reversalForm.reason) {
      alert("Please fill all required fields");
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReversal = {
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
      };
      
      // Add to data (in real app, this would be API call)
      reversalsData.unshift(newReversal);
      
      // Reset form
      setReversalForm({ transactionId: "", reason: "", amount: "", notes: "" });
      setLookupResult(null);
      setIsProcessing(false);
      
      alert("Reversal request created successfully!");
      setActiveTab("pending");
    }, 2000);
  };

  // Handle approval/rejection with OTP
  const handleApprovalAction = (action: "approve" | "reject") => {
    if (!selectedReversal) return;
    
    // Set pending action and show OTP dialog
    setPendingAction({ action, reversal: selectedReversal });
    setShowApprovalDialog(false);
    setShowOtpDialog(true);
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    if (!pendingAction) return;
    
    setIsProcessing(true);
    
    // Simulate OTP verification and API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { action, reversal } = pendingAction;
      const updatedStatus = action === "approve" ? "Approved" : "Rejected";
      const reversalIndex = reversalsData.findIndex(r => r.id === reversal.id);
      
      if (reversalIndex !== -1) {
        reversalsData[reversalIndex] = {
          ...reversalsData[reversalIndex],
          status: updatedStatus,
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

        {/* Create Reversal Tab */}
        <TabsContent value="create" className="space-y-6">
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
                          <SelectItem value="Customer complaint">Customer complaint</SelectItem>
                          <SelectItem value="Duplicate transaction">Duplicate transaction</SelectItem>
                          <SelectItem value="Fraudulent transaction">Fraudulent transaction</SelectItem>
                          <SelectItem value="Technical error">Technical error</SelectItem>
                          <SelectItem value="Merchant request">Merchant request</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
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
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <CardTitle>Reversal Requests</CardTitle>
                  <CardDescription>
                    {isSuperAdmin ? "Review and approve/reject reversal requests" : "View reversal requests"}
                  </CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reversals..."
                      className="pl-8 w-full sm:w-[240px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pendingapproval">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reversal ID</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReversals.map((reversal) => (
                      <TableRow key={reversal.id}>
                        <TableCell className="font-medium">{reversal.id}</TableCell>
                        <TableCell>{reversal.transactionId}</TableCell>
                        <TableCell>{reversal.merchantName}</TableCell>
                        <TableCell>{reversal.amount}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{reversal.reason}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(reversal.status)}>
                            {reversal.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{reversal.createdBy}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                                                          onClick={() => {
                              setSelectedTransaction({
                                ...reversal.originalTransaction,
                                status: "Completed"
                              });
                              setShowTransactionDialog(true);
                            }}
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                            {isSuperAdmin && reversal.status === "Pending Approval" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedReversal(reversal);
                                    setShowApprovalDialog(true);
                                  }}
                                >
                                  <IconCheck className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3">
                {filteredReversals.map((reversal) => (
                  <Card key={reversal.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-sm">{reversal.id}</p>
                        <p className="text-xs text-muted-foreground">{reversal.transactionId}</p>
                      </div>
                      <Badge variant={getStatusVariant(reversal.status)}>
                        {reversal.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold">{reversal.amount}</p>
                        <p className="text-sm text-muted-foreground">{reversal.merchantName}</p>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{reversal.reason}</p>
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-xs text-muted-foreground">By: {reversal.createdBy}</p>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTransaction({
                                ...reversal.originalTransaction,
                                status: "Completed"
                              });
                              setShowTransactionDialog(true);
                            }}
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>
                          {isSuperAdmin && reversal.status === "Pending Approval" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedReversal(reversal);
                                setShowApprovalDialog(true);
                              }}
                            >
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredReversals.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No reversal requests found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
            <Button 
              variant="outline" 
              onClick={() => setShowApprovalDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleApprovalAction("reject")}
              disabled={isProcessing}
            >
              <IconX className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button 
              onClick={() => handleApprovalAction("approve")}
              disabled={isProcessing}
            >
              <IconCheck className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <OTPVerification
        isOpen={showOtpDialog}
        onClose={() => {
          setShowOtpDialog(false);
          setPendingAction(null);
          setIsProcessing(false);
        }}
        onVerify={handleOtpVerification}
        title={`${pendingAction?.action === "approve" ? "Approve" : "Reject"} Reversal`}
        description={`Enter your OTP to ${pendingAction?.action === "approve" ? "approve" : "reject"} this reversal request`}
        actionLabel={pendingAction?.action === "approve" ? "Approve" : "Reject"}
        actionDetails={pendingAction ? {
          reversalId: pendingAction.reversal.id,
          transactionId: pendingAction.reversal.transactionId,
          amount: pendingAction.reversal.amount,
          merchant: pendingAction.reversal.merchantName,
          reason: pendingAction.reversal.reason
        } : undefined}
        isProcessing={isProcessing}
      />
    </div>
  );
} 