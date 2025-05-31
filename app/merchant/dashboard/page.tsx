"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Sample data - would be replaced with real API data
const chartData = [
  { name: 'Mon', collections: 4000, payouts: 2400 },
  { name: 'Tue', collections: 3000, payouts: 1398 },
  { name: 'Wed', collections: 2000, payouts: 9800 },
  { name: 'Thu', collections: 2780, payouts: 3908 },
  { name: 'Fri', collections: 1890, payouts: 4800 },
  { name: 'Sat', collections: 2390, payouts: 3800 },
  { name: 'Sun', collections: 3490, payouts: 4300 },
];

const transactionsData = [
  { id: '1', reference: 'TR-123456', amount: '₦15,000.00', type: 'Collection', status: 'Successful', date: '2023-05-12' },
  { id: '2', reference: 'TR-123457', amount: '₦25,000.00', type: 'Payout', status: 'Pending', date: '2023-05-12' },
  { id: '3', reference: 'TR-123458', amount: '₦5,000.00', type: 'Collection', status: 'Failed', date: '2023-05-11' },
  { id: '4', reference: 'TR-123459', amount: '₦12,000.00', type: 'Collection', status: 'Successful', date: '2023-05-11' },
  { id: '5', reference: 'TR-123460', amount: '₦8,000.00', type: 'Payout', status: 'Successful', date: '2023-05-10' },
  { id: '6', reference: 'TR-123461', amount: '₦9,500.00', type: 'Collection', status: 'Successful', date: '2023-05-10' },
  { id: '7', reference: 'TR-123462', amount: '₦18,000.00', type: 'Collection', status: 'Failed', date: '2023-05-09' },
  { id: '8', reference: 'TR-123463', amount: '₦22,000.00', type: 'Payout', status: 'Successful', date: '2023-05-09' },
  { id: '9', reference: 'TR-123464', amount: '₦7,000.00', type: 'Collection', status: 'Successful', date: '2023-05-08' },
  { id: '10', reference: 'TR-123465', amount: '₦13,000.00', type: 'Payout', status: 'Pending', date: '2023-05-08' },
];

const submerchants = [
  { id: '1', name: 'Store A' },
  { id: '2', name: 'Store B' },
  { id: '3', name: 'Store C' },
  { id: '4', name: 'Store D' },
];

export default function MerchantDashboardPage() {
  const [timeFilter, setTimeFilter] = useState("today");
  const [selectedSubmerchant, setSelectedSubmerchant] = useState("All Submerchants");
  const [transactionFilter, setTransactionFilter] = useState("all");

  // Filter transactions based on selected filter
  const filteredTransactions = transactionsData.filter(transaction => {
    if (transactionFilter === "all") return true;
    return transaction.status.toLowerCase() === transactionFilter.toLowerCase();
  }).slice(0, 10); // Show max 10 transactions

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Merchant Dashboard</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {selectedSubmerchant} <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedSubmerchant("All Submerchants")}>
              All Submerchants
            </DropdownMenuItem>
            {submerchants.map((merchant) => (
              <DropdownMenuItem 
                key={merchant.id} 
                onClick={() => setSelectedSubmerchant(merchant.name)}
              >
                {merchant.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
            <CardDescription>Total amount collected</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₦456,890.00</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Failed Transactions</CardTitle>
            <CardDescription>Number of failed transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Current available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₦235,410.00</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Collections & Payouts</CardTitle>
            <CardDescription>Overview of your financial activity</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={timeFilter === "today" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeFilter("today")}
            >
              Today
            </Button>
            <Button 
              variant={timeFilter === "7days" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeFilter("7days")}
            >
              7 Days
            </Button>
            <Button 
              variant={timeFilter === "monthly" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeFilter("monthly")}
            >
              Monthly
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="collections" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="payouts" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest transaction activities</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={transactionFilter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={transactionFilter === "successful" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("successful")}
            >
              Successful
            </Button>
            <Button 
              variant={transactionFilter === "pending" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("pending")}
            >
              Pending
            </Button>
            <Button 
              variant={transactionFilter === "failed" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTransactionFilter("failed")}
            >
              Failed
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'Successful' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 