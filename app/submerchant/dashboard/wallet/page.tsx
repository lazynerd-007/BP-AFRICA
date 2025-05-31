"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconWallet,
  IconDownload,
  IconHistory,
  IconSearch,
  IconArrowUp,
  IconArrowDown,
  IconBuilding,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";

// Mock wallet transaction data
const mockTransactions = [
  {
    id: "WTX-SUB-001",
    date: "2023-11-15T14:30:00",
    description: "Payment Settlement",
    type: "credit",
    amount: 1218.75,
    balance: 5432.10,
    status: "completed",
    reference: "STL-2023-1115-001"
  },
  {
    id: "WTX-SUB-002",
    date: "2023-11-15T10:15:00",
    description: "Commission Deduction",
    type: "debit",
    amount: 31.25,
    balance: 4213.35,
    status: "completed",
    reference: "COM-2023-1115-001"
  },
  {
    id: "WTX-SUB-003",
    date: "2023-11-14T16:45:00",
    description: "Payment Settlement",
    type: "credit",
    amount: 731.74,
    balance: 4244.60,
    status: "completed",
    reference: "STL-2023-1114-002"
  },
  {
    id: "WTX-SUB-004",
    date: "2023-11-14T11:20:00",
    description: "Withdrawal Request",
    type: "debit",
    amount: 500.00,
    balance: 3512.86,
    status: "pending",
    reference: "WDR-2023-1114-001"
  },
  {
    id: "WTX-SUB-005",
    date: "2023-11-13T09:30:00",
    description: "Payment Settlement",
    type: "credit",
    amount: 487.50,
    balance: 4012.86,
    status: "completed",
    reference: "STL-2023-1113-001"
  }
];

export default function SubmerchantWalletPage() {
  const [statementOpen, setStatementOpen] = useState(false);
  const [fundRequestOpen, setFundRequestOpen] = useState(false);
  const [withdrawalRequestOpen, setWithdrawalRequestOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fund request form states
  const [requestAmount, setRequestAmount] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [requestPurpose, setRequestPurpose] = useState("");
  
  // Withdrawal request form states
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalReason, setWithdrawalReason] = useState("");

  const currentBalance = 5432.10; // Mock balance
  const availableBalance = 5432.10; // Available for withdrawal
  const pendingSettlements = 125.50; // Pending settlements

  const downloadStatement = () => {
    console.log("Downloading statement from", startDate, "to", endDate);
    setStatementOpen(false);
  };

  const handleFundRequest = () => {
    if (!requestAmount || !requestDescription) {
      alert("Please fill in all required fields");
      return;
    }
    
    console.log("Fund request submitted:", {
      amount: requestAmount,
      description: requestDescription,
      purpose: requestPurpose
    });
    
    setRequestAmount("");
    setRequestDescription("");
    setRequestPurpose("");
    setFundRequestOpen(false);
    alert("Fund request submitted successfully. Your parent merchant will review and approve.");
  };

  const handleWithdrawalRequest = () => {
    if (!withdrawalAmount || !withdrawalReason) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (parseFloat(withdrawalAmount) > availableBalance) {
      alert("Insufficient balance for withdrawal");
      return;
    }
    
    console.log("Withdrawal request submitted:", {
      amount: withdrawalAmount,
      reason: withdrawalReason
    });
    
    setWithdrawalAmount("");
    setWithdrawalReason("");
    setWithdrawalRequestOpen(false);
    alert("Withdrawal request submitted successfully.");
  };

  const filteredTransactions = mockTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "credit" ? (
      <IconArrowDown className="h-4 w-4 text-green-500" />
    ) : (
      <IconArrowUp className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          View your submerchant wallet balance, transactions, and request funds
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          Your wallet is managed by your parent merchant. Fund transfers and withdrawals require parent merchant approval.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Balance Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Balance Overview</CardTitle>
            <CardDescription>Current wallet balance and available funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <IconWallet className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <p className="text-muted-foreground text-sm">Available Balance</p>
                    <p className="text-3xl font-bold">₦{currentBalance.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">Pending Settlements</p>
                  <p className="text-lg font-semibold text-yellow-600">₦{pendingSettlements.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Dialog open={fundRequestOpen} onOpenChange={setFundRequestOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <IconPlus className="h-4 w-4 mr-2" />
                      Request Funds
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Request Funds from Parent Merchant</DialogTitle>
                      <DialogDescription>
                        Submit a request to your parent merchant for additional funds. All requests require approval.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="request-amount">Amount (₦)</Label>
                        <Input
                          id="request-amount"
                          type="number"
                          placeholder="0.00"
                          value={requestAmount}
                          onChange={(e) => setRequestAmount(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="request-purpose">Purpose</Label>
                        <Select value={requestPurpose} onValueChange={setRequestPurpose}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operational">Operational Expenses</SelectItem>
                            <SelectItem value="inventory">Inventory Purchase</SelectItem>
                            <SelectItem value="marketing">Marketing & Promotion</SelectItem>
                            <SelectItem value="emergency">Emergency Funds</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="request-description">Description</Label>
                        <Textarea
                          id="request-description"
                          placeholder="Provide details about your fund request..."
                          value={requestDescription}
                          onChange={(e) => setRequestDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setFundRequestOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleFundRequest}>
                        Submit Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={withdrawalRequestOpen} onOpenChange={setWithdrawalRequestOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <IconArrowUp className="h-4 w-4 mr-2" />
                      Request Withdrawal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Request Withdrawal</DialogTitle>
                      <DialogDescription>
                        Submit a withdrawal request. Maximum available: ₦{availableBalance.toFixed(2)}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="withdrawal-amount">Amount (₦)</Label>
                        <Input
                          id="withdrawal-amount"
                          type="number"
                          placeholder="0.00"
                          max={availableBalance}
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Available for withdrawal: ₦{availableBalance.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="withdrawal-reason">Reason for Withdrawal</Label>
                        <Textarea
                          id="withdrawal-reason"
                          placeholder="Please specify the reason for this withdrawal..."
                          value={withdrawalReason}
                          onChange={(e) => setWithdrawalReason(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setWithdrawalRequestOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleWithdrawalRequest}>
                        Submit Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={statementOpen} onOpenChange={setStatementOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <IconDownload className="h-4 w-4 mr-2" />
                      Download Statement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Download Statement</DialogTitle>
                      <DialogDescription>
                        Select date range for your wallet statement
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            className="rounded-md border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            className="rounded-md border"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setStatementOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={downloadStatement}>
                        Download
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>This month&apos;s summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Total Settlements</p>
              <p className="text-xl font-bold">₦15,420.50</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Commission Paid</p>
              <p className="text-xl font-bold text-red-600">₦385.51</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Net Earnings</p>
              <p className="text-xl font-bold text-green-600">₦15,034.99</p>
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconBuilding className="h-4 w-4" />
                <span>Managed by: BluWave Limited</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconHistory className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>
                Recent wallet transactions and settlements
              </CardDescription>
            </div>
            
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8 w-full md:w-[240px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(transaction.date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs">{transaction.reference}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₦{transaction.balance.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 