"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconWallet,
  IconArrowRight,
  IconArrowLeft,
  IconHistory,
  IconCreditCard,
  IconSend,
  IconRefresh,
  IconEye,
  IconEyeOff,
  IconCopy
} from "@tabler/icons-react";
import { useCurrency } from "@/lib/currency-context";

// Mock data for OVA balances
const ovaBalanceData = {
  collection: {
    balance: "1,250,000.00",
    accountNumber: "32498765120",
    lastUpdated: "2025-05-20T14:30:00",
  },
  payout: {
    balance: "850,000.00",
    accountNumber: "32498765121",
    lastUpdated: "2025-05-20T14:30:00",
  }
};

// Mock data for transaction history
const transactionHistoryData = [
  {
    id: 2,
    date: "2025-05-19T16:32:00",
    type: "Transfer",
    description: "Internal Transfer to Payout OVA",
    amount: "200,000.00",
    status: "Completed",
    reference: "BPT-987654"
  },
  {
    id: 5,
    date: "2025-05-16T14:10:00",
    type: "Transfer",
    description: "Internal Transfer to Payout OVA",
    amount: "300,000.00",
    status: "Completed",
    reference: "BPT-876543"
  }
];

interface ViewOVAProps {
  selectedProvider?: string;
}

export function ViewOVA({ selectedProvider: _selectedProvider }: ViewOVAProps) {
  const { currency } = useCurrency();
  const [transactionType, setTransactionType] = useState("all");
  const [showCollectionBalance, setShowCollectionBalance] = useState(false);
  const [showPayoutBalance, setShowPayoutBalance] = useState(false);
  
  // Filter transactions based on selected filters
  const filteredTransactions = transactionHistoryData.filter(transaction => {
    const matchesType = transactionType === "all" || transaction.type === transactionType;
    return matchesType;
  });
  
  // Function to copy account number to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you would show a toast notification here
    alert(`Copied to clipboard: ${text}`);
  };
  
  // Function to get status badge variant
  const getStatusBadgeVariant = (status: string): "success" | "warning" | "destructive" | "secondary" => {
    switch(status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "destructive";
      default:
        return "secondary";
    }
  };
  
  // Function to get transaction type badge variant
  const getTypeBadgeVariant = (type: string): "secondary" | "outline" | "default" => {
    switch(type) {
      case "Collection":
        return "secondary";
      case "Transfer":
        return "outline";
      case "Payout":
        return "default";
      default:
        return "secondary";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Collection OVA Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <IconWallet className="mr-2 h-5 w-5 text-blue-500" />
                Collection OVA
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCollectionBalance(!showCollectionBalance)}
              >
                {showCollectionBalance ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardDescription>
              Virtual account for receiving payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Account Balance</Label>
                <div className="text-2xl font-bold mt-1">
                  {showCollectionBalance ? (
                    `${currency} ${ovaBalanceData.collection.balance}`
                  ) : (
                    "••••••••••"
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">OVA Number</Label>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium mr-2">
                    {ovaBalanceData.collection.accountNumber}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => copyToClipboard(ovaBalanceData.collection.accountNumber)}
                  >
                    <IconCopy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Last updated: {new Date(ovaBalanceData.collection.lastUpdated).toLocaleString()}
          </CardFooter>
        </Card>
        
        {/* Payout OVA Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <IconCreditCard className="mr-2 h-5 w-5 text-green-500" />
                Payout OVA
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPayoutBalance(!showPayoutBalance)}
              >
                {showPayoutBalance ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardDescription>
              Virtual account for making payouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Account Balance</Label>
                <div className="text-2xl font-bold mt-1">
                  {showPayoutBalance ? (
                    `${currency} ${ovaBalanceData.payout.balance}`
                  ) : (
                    "••••••••••"
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">OVA Number</Label>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium mr-2">
                    {ovaBalanceData.payout.accountNumber}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => copyToClipboard(ovaBalanceData.payout.accountNumber)}
                  >
                    <IconCopy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Last updated: {new Date(ovaBalanceData.payout.lastUpdated).toLocaleString()}
          </CardFooter>
        </Card>
      </div>
      
      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-medium flex items-center">
                <IconHistory className="mr-2 h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>
                Recent transactions for both collection and payout OVAs
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Transfer">Internal Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <IconRefresh className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(transaction.type)}>
                        {transaction.type === "Collection" && <IconArrowRight className="mr-1 h-3 w-3" />}
                        {transaction.type === "Transfer" && <IconSend className="mr-1 h-3 w-3" />}
                        {transaction.type === "Payout" && <IconArrowLeft className="mr-1 h-3 w-3" />}
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {transaction.reference}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {transaction.amount.startsWith('-') ? transaction.amount : `+${transaction.amount}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(transaction.status) as "secondary" | "destructive" | "default" | "outline"}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 