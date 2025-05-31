"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  IconSearch, 
  IconDownload, 
  IconFilter, 
  IconCalendar, 
  IconEye, 
  IconChevronLeft, 
  IconChevronRight, 
  IconChevronsLeft, 
  IconChevronsRight,
  IconArrowDown,
  IconArrowUp
} from "@tabler/icons-react";

// Mock transactions data with more detailed information
const mockTransactions = [
  {
    id: "TXN-SUB-67890",
    date: "2023-11-15T10:32:15",
    customer: "John Doe",
    customerNumber: "+233 24 123 4567",
    amount: 1250.00,
    netAmount: 1218.75,
    currency: "GHS",
    status: "completed",
    type: "payment",
    reference: "REF-ABC123",
    paymentMethod: "Card",
    scheme: "Visa",
    terminalId: "TRM-SUB-001",
    commission: 31.25,
    parentCommission: 12.50
  },
  {
    id: "TXN-SUB-67891",
    date: "2023-11-15T09:18:43",
    customer: "Sarah Johnson",
    customerNumber: "+233 24 987 6543",
    amount: 500.00,
    netAmount: 487.50,
    currency: "GHS",
    status: "completed",
    type: "payment",
    reference: "REF-DEF456",
    paymentMethod: "Bank Transfer",
    scheme: "Mobile Money",
    terminalId: "TRM-SUB-002",
    commission: 12.50,
    parentCommission: 5.00
  },
  {
    id: "TXN-SUB-67892",
    date: "2023-11-14T16:45:22",
    customer: "Michael Brown",
    customerNumber: "+233 20 555 1234",
    amount: 1850.75,
    netAmount: 1804.49,
    currency: "GHS",
    status: "pending",
    type: "payment",
    reference: "REF-GHI789",
    paymentMethod: "Card",
    scheme: "Visa",
    terminalId: "TRM-SUB-001",
    commission: 46.27,
    parentCommission: 18.51
  },
  {
    id: "TXN-SUB-67893",
    date: "2023-11-14T14:20:11",
    customer: "Emma Wilson",
    customerNumber: "+233 26 777 8888",
    amount: 750.50,
    netAmount: 731.74,
    currency: "GHS",
    status: "completed",
    type: "payment",
    reference: "REF-JKL012",
    paymentMethod: "Card",
    scheme: "Mastercard",
    terminalId: "TRM-SUB-003",
    commission: 18.76,
    parentCommission: 7.51
  },
  {
    id: "TXN-SUB-67894",
    date: "2023-11-14T11:05:38",
    customer: "David Lee",
    customerNumber: "+233 24 999 0000",
    amount: 2500.00,
    netAmount: 0.00,
    currency: "GHS",
    status: "failed",
    type: "payment",
    reference: "REF-MNO345",
    paymentMethod: "Card",
    scheme: "Mastercard",
    terminalId: "TRM-SUB-002",
    commission: 0.00,
    parentCommission: 0.00
  },
  {
    id: "TXN-SUB-67895",
    date: "2023-11-13T15:30:22",
    customer: "Alice Johnson",
    customerNumber: "+233 55 111 2222",
    amount: 125.00,
    netAmount: 121.88,
    currency: "GHS",
    status: "completed",
    type: "refund",
    reference: "REF-PQR678",
    paymentMethod: "Card",
    scheme: "Visa",
    terminalId: "TRM-SUB-001",
    commission: -3.12,
    parentCommission: -1.25
  }
];

// Transaction types
const transactionTypes = [
  { id: "all", name: "All Types" },
  { id: "payment", name: "Payment" },
  { id: "refund", name: "Refund" },
];

// Payment methods
const paymentMethods = [
  { id: "all", name: "All Methods" },
  { id: "Card", name: "Card" },
  { id: "Bank Transfer", name: "Bank Transfer" },
  { id: "Mobile Money", name: "Mobile Money" },
];

// Table columns for export selection
const tableColumns = [
  { id: "date", name: "Date", checked: true },
  { id: "customer", name: "Customer", checked: true },
  { id: "customerNumber", name: "Customer Number", checked: true },
  { id: "amount", name: "Amount", checked: true },
  { id: "netAmount", name: "Net Amount", checked: true },
  { id: "commission", name: "Commission", checked: true },
  { id: "scheme", name: "Scheme", checked: true },
  { id: "reference", name: "Reference", checked: true },
  { id: "status", name: "Status", checked: true },
  { id: "type", name: "Type", checked: true },
  { id: "terminalId", name: "Terminal ID", checked: false },
];

// Transaction interface
interface Transaction {
  id: string;
  date: string;
  customer: string;
  customerNumber: string;
  amount: number;
  netAmount: number;
  currency: string;
  status: string;
  type: string;
  reference: string;
  paymentMethod: string;
  scheme: string;
  terminalId: string;
  commission: number;
  parentCommission: number;
}

export default function SubmerchantTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  
  // Filter state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [transactionType, setTransactionType] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Export state
  const [exportColumns, setExportColumns] = useState(tableColumns);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Transaction details modal state
  const [viewTransactionOpen, setViewTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Filter transactions based on all filters
  const filteredTransactions = mockTransactions.filter(transaction => {
    // Search filter
    const matchesSearch = 
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Transaction type filter
    const matchesType = transactionType === "all" || transaction.type === transactionType;
    
    // Payment method filter
    const matchesPaymentMethod = paymentMethod === "all" || transaction.paymentMethod === paymentMethod;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    // Date range filter
    const transactionDate = new Date(transaction.date);
    const matchesDateRange = (!startDate || transactionDate >= startDate) && 
                             (!endDate || transactionDate <= endDate);
    
    return matchesSearch && matchesType && matchesPaymentMethod && matchesStatus && matchesDateRange;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setViewTransactionOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatDateTime = (dateString: string) => {
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

  const handleColumnToggle = (columnId: string) => {
    setExportColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, checked: !col.checked } : col
      )
    );
  };

  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setTransactionType("all");
    setPaymentMethod("all");
    setStatusFilter("all");
    setFilterOpen(false);
  };

  const applyFilters = () => {
    setFilterOpen(false);
    setCurrentPage(1);
  };

  const handleExport = () => {
    // In a real app, this would trigger a download
    console.log("Exporting transactions with columns:", exportColumns.filter(col => col.checked));
    setExportOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <IconArrowDown className="h-4 w-4 text-green-500" />;
      case "refund":
        return <IconArrowUp className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage all your submerchant transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <IconArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <IconArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            <IconArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{filteredTransactions.reduce((sum, t) => sum + t.netAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <IconArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((filteredTransactions.filter(t => t.status === 'completed').length / filteredTransactions.length) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All transactions processed through your submerchant account
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8 w-full sm:w-[240px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <IconFilter className="h-4 w-4 mr-2" />
                      Filters
                      {(startDate || endDate || transactionType !== "all" || paymentMethod !== "all" || statusFilter !== "all") && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                          •
                        </span>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Filter Transactions</DialogTitle>
                      <DialogDescription>
                        Apply filters to narrow down your transaction list
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <IconCalendar className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <IconCalendar className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Transaction Type</Label>
                          <Select value={transactionType} onValueChange={setTransactionType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {transactionTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method.id} value={method.id}>
                                  {method.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={resetFilters}>
                        Reset
                      </Button>
                      <Button onClick={applyFilters}>Apply Filters</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <IconDownload className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Export Transactions</DialogTitle>
                      <DialogDescription>
                        Choose which columns to include in your export
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium mb-3 block">Export Columns</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {exportColumns.map((column) => (
                              <div key={column.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={column.id}
                                  checked={column.checked}
                                  onCheckedChange={() => handleColumnToggle(column.id)}
                                />
                                <Label
                                  htmlFor={column.id}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {column.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setExportOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleExport}>Export CSV</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatDate(transaction.date)}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(transaction.date), "HH:mm")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.customer}</div>
                        <div className="text-sm text-muted-foreground">{transaction.customerNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {transaction.currency} {transaction.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {transaction.currency} {transaction.netAmount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={transaction.commission >= 0 ? "text-green-600" : "text-red-600"}>
                        {transaction.currency} {transaction.commission.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.scheme}</div>
                        <div className="text-sm text-muted-foreground">{transaction.paymentMethod}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <IconChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <IconChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      <Dialog open={viewTransactionOpen} onOpenChange={setViewTransactionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about transaction {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Transaction ID</Label>
                  <p className="font-mono text-sm">{selectedTransaction.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Reference</Label>
                  <p className="font-mono text-sm">{selectedTransaction.reference}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedTransaction.customer}</p>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.customerNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date & Time</Label>
                  <p className="font-medium">{formatDateTime(selectedTransaction.date)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <p className="text-lg font-semibold">
                    {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Net Amount</Label>
                  <p className="text-lg font-semibold text-green-600">
                    {selectedTransaction.currency} {selectedTransaction.netAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Commission</Label>
                  <p className="text-lg font-semibold">
                    {selectedTransaction.currency} {selectedTransaction.commission.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                  <p className="font-medium">{selectedTransaction.paymentMethod}</p>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.scheme}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Terminal</Label>
                  <p className="font-mono text-sm">{selectedTransaction.terminalId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeIcon(selectedTransaction.type)}
                    <span className="capitalize font-medium">{selectedTransaction.type}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTransactionOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 