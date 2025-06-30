"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconWallet,
  IconArrowRight,
  IconAlertCircle,
  IconLockAccess,
  IconCreditCard,
  IconSend,
  IconClock
} from "@tabler/icons-react";
import { useCurrency } from "@/lib/currency-context";
import { useAuthStore } from "@/lib/store";

// Mock data for OVA balances
const ovaBalanceData = {
  collection: {
    balance: "1,250,000.00",
    accountNumber: "32498765120",
    bank: "Ghana Commercial Bank",
    lastUpdated: "2025-05-20T14:30:00",
  },
  payout: {
    balance: "850,000.00",
    accountNumber: "32498765121",
    bank: "Ghana Commercial Bank",
    lastUpdated: "2025-05-20T14:30:00",
  }
};

// Mock data for recent requests
const recentRequestsData = [
  {
    id: 1,
    requestDate: "2025-05-19T14:20:00",
    amount: "200,000.00",
    requestedBy: "John Doe",
    userId: "JD-001",
    status: "Approved",
    completedDate: "2025-05-19T15:10:00"
  },
  {
    id: 2,
    requestDate: "2025-05-18T10:15:00",
    amount: "300,000.00",
    requestedBy: "John Doe",
    userId: "JD-001",
    status: "Approved",
    completedDate: "2025-05-18T11:05:00"
  },
  {
    id: 3,
    requestDate: "2025-05-16T16:30:00",
    amount: "150,000.00",
    requestedBy: "Jane Smith",
    userId: "JS-002",
    status: "Declined",
    completedDate: "2025-05-16T17:00:00"
  }
];

interface RequestOVAProps {
  selectedProvider?: string;
}

export function RequestOVA({ selectedProvider: _selectedProvider }: RequestOVAProps) {
  const { currency } = useCurrency();
  const { user } = useAuthStore();
  
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestCompleted, setRequestCompleted] = useState(false);
  
  // Check if amount is valid
  const isAmountValid = () => {
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    const maxAmount = parseFloat(ovaBalanceData.collection.balance.replace(/,/g, ""));
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= maxAmount;
  };
  
  // Format amount with commas
  const formatAmount = (value: string) => {
    // Remove non-digit characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, "");
    
    // Split into whole and decimal parts
    const parts = cleaned.split(".");
    
    // Format whole part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Join with at most 2 decimal places
    return parts[0] + (parts.length > 1 ? "." + parts[1].slice(0, 2) : "");
  };
  
  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(formatAmount(value));
  };
  
  // Handle request submission
  const handleRequestSubmit = () => {
    if (!isAmountValid()) {
      alert("Please enter a valid amount");
      return;
    }
    
    setShowOtpDialog(true);
  };
  
  // Handle OTP verification
  const handleOtpSubmit = () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setSubmitting(false);
      setShowOtpDialog(false);
      setRequestCompleted(true);
      
      // Reset form after successful submission
      setAmount("");
      setNote("");
      setOtp("");
    }, 1500);
  };
  
  // Function to get status badge variant
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    switch(status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Declined":
        return "destructive";
      default:
        return "secondary";
    }
  };
  
  return (
    <div className="space-y-6">
      {requestCompleted && (
        <Alert className="bg-green-50 border-green-200">
          <IconSend className="h-4 w-4 text-green-600" />
          <AlertTitle>Request Submitted Successfully</AlertTitle>
          <AlertDescription>
            Your fund transfer request has been submitted and is pending approval.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <IconSend className="mr-2 h-5 w-5" />
              Request Fund Transfer
            </CardTitle>
            <CardDescription>
              Transfer funds from Collection OVA to Payout OVA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <IconWallet className="mr-2 h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Collection OVA</p>
                    <p className="text-xs text-muted-foreground">Available Balance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{currency} {ovaBalanceData.collection.balance}</p>
                </div>
              </div>
              
              <div className="flex justify-center my-2">
                <div className="rounded-full bg-muted p-2">
                  <IconArrowRight className="h-5 w-5" />
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <IconCreditCard className="mr-2 h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Payout OVA</p>
                    <p className="text-xs text-muted-foreground">Current Balance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{currency} {ovaBalanceData.payout.balance}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Transfer</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currency}
                  </span>
                  <Input
                    id="amount"
                    className="pl-10"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                {amount && !isAmountValid() && (
                  <p className="text-xs text-destructive">
                    Amount must be greater than 0 and not exceed available balance
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input
                  id="note"
                  placeholder="Reason for transfer"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full" 
                  onClick={handleRequestSubmit} 
                  disabled={!isAmountValid()}
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Request Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <IconClock className="mr-2 h-5 w-5" />
              Recent Requests
            </CardTitle>
            <CardDescription>
              History of your recent fund transfer requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequestsData.map((request) => (
                <div key={request.id} className="border rounded-md p-3 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">
                      {currency} {request.amount}
                    </p>
                    <Badge variant={getStatusBadgeVariant(request.status) as "secondary" | "destructive" | "default" | "outline"}>
                      {request.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <p>Requested by: {request.requestedBy} ({request.userId})</p>
                    <p>{new Date(request.requestDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              
              {recentRequestsData.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No recent requests found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Request Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Requester Name</Label>
                <div className="text-sm font-medium mt-1">
                  {user?.name || "John Doe"}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">User ID</Label>
                <div className="text-sm font-medium mt-1">
                  {user?.email || "JD-001"}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Position</Label>
                <div className="text-sm font-medium mt-1">
                  {user?.role === "admin" ? "Administrator" : "Financial Manager"}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Department</Label>
                <div className="text-sm font-medium mt-1">
                  Finance
                </div>
              </div>
            </div>
            
            <Alert>
              <IconAlertCircle className="h-4 w-4" />
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                All fund transfer requests require approval from an authorized personnel.
                You will receive an email notification once your request is processed.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <IconLockAccess className="mr-2 h-5 w-5" />
              Enter OTP to Confirm
            </DialogTitle>
            <DialogDescription>
              A one-time password has been sent to your registered mobile number and email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center letter-spacing-wide font-mono text-lg"
                maxLength={6}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Transaction Details:</p>
              <p>Amount: {currency} {amount}</p>
              <p>From: Collection OVA ({ovaBalanceData.collection.accountNumber})</p>
              <p>To: Payout OVA ({ovaBalanceData.payout.accountNumber})</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOtpDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOtpSubmit} disabled={otp.length !== 6 || submitting}>
              {submitting ? "Processing..." : "Confirm Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 