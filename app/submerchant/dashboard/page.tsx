"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowUpRight,
  IconCash,
  IconCheck,
  IconCreditCard,
  IconEye,
  IconDownload,
  IconBuilding,
} from "@tabler/icons-react";

// Sample data - would be replaced with real API data
const chartData = [
  { name: 'Jan', revenue: 1200000, transactions: 450 },
  { name: 'Feb', revenue: 980000, transactions: 380 },
  { name: 'Mar', revenue: 1450000, transactions: 520 },
  { name: 'Apr', revenue: 1300000, transactions: 490 },
  { name: 'May', revenue: 1650000, transactions: 610 },
  { name: 'Jun', revenue: 1580000, transactions: 580 },
];

const dailyTransactionsData = [
  { date: 'Mon', amount: 180000, count: 25 },
  { date: 'Tue', amount: 220000, count: 32 },
  { date: 'Wed', amount: 165000, count: 28 },
  { date: 'Thu', amount: 280000, count: 45 },
  { date: 'Fri', amount: 320000, count: 52 },
  { date: 'Sat', amount: 210000, count: 35 },
  { date: 'Sun', amount: 150000, count: 22 },
];

const recentTransactions = [
  { 
    id: 'TXN-67890', 
    amount: '₵25,000.00', 
    customer: 'John Doe',
    date: '2023-10-15T14:30:00',
    status: 'Successful',
    type: 'Payment'
  },
  { 
    id: 'TXN-67891', 
    amount: '₵45,000.00', 
    customer: 'Jane Smith',
    date: '2023-10-15T13:15:00',
    status: 'Successful',
    type: 'Payment'
  },
  { 
    id: 'TXN-67892', 
    amount: '₵12,500.00', 
    customer: 'Mike Johnson',
    date: '2023-10-15T11:45:00',
    status: 'Pending',
    type: 'Payment'
  },
  { 
    id: 'TXN-67893', 
    amount: '₵38,000.00', 
    customer: 'Sarah Wilson',
    date: '2023-10-15T10:20:00',
    status: 'Successful',
    type: 'Payment'
  },
  { 
    id: 'TXN-67894', 
    amount: '₵15,750.00', 
    customer: 'David Brown',
    date: '2023-10-15T09:30:00',
    status: 'Failed',
    type: 'Payment'
  },
];

export default function SubmerchantDashboardPage() {
  const [timeFilter, setTimeFilter] = useState("7days");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SubMerchant Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your business overview</p>
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
            variant={timeFilter === "30days" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeFilter("30days")}
          >
            30 Days
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IconCash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵8,450,000.00</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1" />
              <span>+15.2% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <IconCreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,085</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1" />
              <span>+8.7% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.8%</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <IconArrowUpRight className="h-3 w-3 mr-1" />
              <span>+1.2% from last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Parent Merchant</CardTitle>
            <IconBuilding className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">BluWave Limited</div>
            <div className="text-xs text-muted-foreground mt-1">
              Commission: 2.5%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue and transaction performance</CardDescription>
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
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? `₵${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Transactions'
                  ]} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
            <CardDescription>Transaction amounts this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyTransactionsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₵${value.toLocaleString()}`} />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Transaction Amount" 
                    fill="#82ca9d" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment activities</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <IconDownload className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{transaction.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "Successful" 
                          ? "default" 
                          : transaction.status === "Pending" 
                            ? "outline" 
                            : "destructive"
                      }
                      className={
                        transaction.status === "Successful" 
                          ? "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400" 
                          : ""
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <IconEye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center border-t px-6 py-4">
          <Button variant="outline">View All Transactions</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 