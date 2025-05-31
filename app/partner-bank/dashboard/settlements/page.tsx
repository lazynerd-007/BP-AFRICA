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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  IconSearch,
  IconCalendar,
  IconFilter,
  IconDownload,
  IconEye,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";

// Sample data for settlements
const settlements = [
  {
    id: "ST-123456",
    merchantName: "BluWave Limited",
    amount: "₦2,450,000.00",
    date: "2023-10-15",
    transactionCount: 123,
    status: "Completed",
    reference: "REF-987654",
    account: "0123456789",
    bankName: "EcoBank Ghana",
    settlementTime: "T+1",
    commissionEarned: "₦24,500.00",
  },
  {
    id: "ST-123457",
    merchantName: "Chensha City Ghana Ltd",
    amount: "₦1,875,000.00",
    date: "2023-10-15",
    transactionCount: 98,
    status: "Pending",
    reference: "REF-987655",
    account: "0123456790",
    bankName: "EcoBank Ghana",
    settlementTime: "T+1",
    commissionEarned: "₦18,750.00",
  },
  {
    id: "ST-123458",
    merchantName: "Blu Penguin",
    amount: "₦3,125,000.00",
    date: "2023-10-14",
    transactionCount: 156,
    status: "Completed",
    reference: "REF-987656",
    account: "0123456791",
    bankName: "EcoBank Ghana",
    settlementTime: "T+1",
    commissionEarned: "₦31,250.00",
  },
  {
    id: "ST-123459",
    merchantName: "Timings Ltd",
    amount: "₦1,250,000.00",
    date: "2023-10-14",
    transactionCount: 67,
    status: "Completed",
    reference: "REF-987657",
    account: "0123456792",
    bankName: "EcoBank Ghana",
    settlementTime: "T+1",
    commissionEarned: "₦12,500.00",
  },
  {
    id: "ST-123460",
    merchantName: "QuickServe Ltd",
    amount: "₦950,000.00",
    date: "2023-10-13",
    transactionCount: 45,
    status: "Failed",
    reference: "REF-987658",
    account: "0123456793",
    bankName: "EcoBank Ghana",
    settlementTime: "T+1",
    commissionEarned: "₦0.00",
    failureReason: "Insufficient account balance"
  },
  {
    id: "ST-123461",
    merchantName: "GhanaTech Solutions",
    amount: "₦2,850,000.00",
    date: "2023-10-13",
    transactionCount: 142,
    status: "Completed",
    reference: "REF-987659",
    account: "0123456794",
    bankName: "Ghana Commercial Bank",
    settlementTime: "T+1",
    commissionEarned: "₦28,500.00",
  },
  {
    id: "ST-123462",
    merchantName: "BluWave Limited",
    amount: "₦1,950,000.00",
    date: "2023-10-12",
    transactionCount: 97,
    status: "Completed",
    reference: "REF-987660",
    account: "0123456789",
    bankName: "EcoBank Ghana",
    settlementTime: "T+1",
    commissionEarned: "₦19,500.00",
  },
  {
    id: "ST-123463",
    merchantName: "Chensha City Ghana Ltd",
    amount: "₦750,000.00",
    date: "2023-10-12",
    transactionCount: 37,
    status: "Pending",
    reference: "REF-987661",
    account: "0123456790",
    bankName: "EcoBank Ghana",
    settlementTime: "T+1",
    commissionEarned: "₦7,500.00",
  },
  {
    id: "ST-123464",
    merchantName: "QuickServe Ltd",
    amount: "₦1,350,000.00",
    date: "2023-10-11",
    transactionCount: 67,
    status: "Completed",
    reference: "REF-987662",
    account: "0123456793",
    bankName: "EcoBank Ghana",
    settlementTime: "T+1",
    commissionEarned: "₦13,500.00",
  },
  {
    id: "ST-123465",
    merchantName: "Blu Penguin",
    amount: "₦2,250,000.00",
    date: "2023-10-11",
    transactionCount: 112,
    status: "Completed",
    reference: "REF-987663",
    account: "0123456791",
    bankName: "EcoBank Ghana",
    settlementTime: "T+1",
    commissionEarned: "₦22,500.00",
  },
];

// Banks for filtering
const banks = [
  { id: "1", name: "EcoBank Ghana" },
  { id: "2", name: "Ghana Commercial Bank" },
  { id: "3", name: "Stanbic Bank Ghana" },
  { id: "4", name: "Fidelity Bank Ghana" },
];

// Merchants for filtering
const merchants = [
  { id: "1", name: "BluWave Limited" },
  { id: "2", name: "Chensha City Ghana Ltd" },
  { id: "3", name: "Blu Penguin" },
  { id: "4", name: "Timings Ltd" },
  { id: "5", name: "QuickServe Ltd" },
  { id: "6", name: "GhanaTech Solutions" },
];

export default function SettlementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bankFilter, setBankFilter] = useState("all");
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<typeof settlements[0] | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRetryDialog, setShowRetryDialog] = useState(false);
  
  // Filter settlements based on search and filters
  const filteredSettlements = settlements.filter(settlement => {
    // Search filter
    const matchesSearch = 
      searchTerm === "" || 
      settlement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || settlement.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Bank filter
    const matchesBank = bankFilter === "all" || settlement.bankName === bankFilter;
    
    // Merchant filter
    const matchesMerchant = merchantFilter === "all" || settlement.merchantName === merchantFilter;
    
    // Date filter
    const settlementDate = new Date(settlement.date);
    const matchesStartDate = !startDate || settlementDate >= startDate;
    const matchesEndDate = !endDate || settlementDate <= endDate;
    
    return matchesSearch && matchesStatus && matchesBank && matchesMerchant && matchesStartDate && matchesEndDate;
  });

  // Status badge variant mapper
  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const statusMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      "Completed": "default",
      "Pending": "outline",
      "Failed": "destructive"
    };
    
    return statusMap[status] || "secondary";
  };

  // Get badge classes based on status
  const getStatusClasses = (status: string): string => {
    if (status === "Completed") {
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400";
    }
    return "";
  };

  // Handle settlement retry
  const handleRetrySettlement = () => {
    // In a real app, this would make an API call to retry the settlement
    alert(`Settlement ${selectedSettlement?.id} retry initiated.`);
    setShowRetryDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Settlements</h1>
        <p className="text-muted-foreground">
          Manage and track all settlement transactions to merchants
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>Settlement Transactions</CardTitle>
              <CardDescription>
                View and manage settlement transactions for all merchants
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search settlements..."
                  className="pl-8 w-full sm:w-[240px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-muted" : ""}
                >
                  <IconFilter className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" className="flex items-center gap-1">
                  <IconDownload className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                
                <Button className="flex items-center gap-1">
                  <IconPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Settlement</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bank</label>
                <Select value={bankFilter} onValueChange={setBankFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Banks</SelectItem>
                    {banks.map(bank => (
                      <SelectItem key={bank.id} value={bank.name}>{bank.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Merchant</label>
                <Select value={merchantFilter} onValueChange={setMerchantFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by merchant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Merchants</SelectItem>
                    {merchants.map(merchant => (
                      <SelectItem key={merchant.id} value={merchant.name}>{merchant.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
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
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
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
              
              <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("all");
                    setBankFilter("all");
                    setMerchantFilter("all");
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                  className="mr-2"
                >
                  Reset Filters
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Settlement ID</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Transactions</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettlements.length > 0 ? (
                filteredSettlements.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell className="font-medium">{settlement.id}</TableCell>
                    <TableCell>{settlement.merchantName}</TableCell>
                    <TableCell>{settlement.date}</TableCell>
                    <TableCell className="text-center">{settlement.transactionCount}</TableCell>
                    <TableCell className="text-right">{settlement.amount}</TableCell>
                    <TableCell className="text-right">{settlement.commissionEarned}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(settlement.status)}
                        className={getStatusClasses(settlement.status)}
                      >
                        {settlement.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSettlement(settlement);
                            setShowDetailsDialog(true);
                          }}
                          title="View Details"
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                        
                        {settlement.status === "Failed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                            onClick={() => {
                              setSelectedSettlement(settlement);
                              setShowRetryDialog(true);
                            }}
                            title="Retry Settlement"
                          >
                            <IconRefresh className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No settlement transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredSettlements.length}</strong> of <strong>{settlements.length}</strong> settlements
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="px-4">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Settlement Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Settlement Details</DialogTitle>
            <DialogDescription>
              {selectedSettlement?.id} - {selectedSettlement?.merchantName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Settlement ID</p>
                <p className="font-medium">{selectedSettlement?.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reference</p>
                <p>{selectedSettlement?.reference}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Merchant</p>
                <p>{selectedSettlement?.merchantName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{selectedSettlement?.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bank</p>
                <p>{selectedSettlement?.bankName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account</p>
                <p>{selectedSettlement?.account}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p>{selectedSettlement?.amount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Commission</p>
                <p>{selectedSettlement?.commissionEarned}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p>{selectedSettlement?.transactionCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge 
                  variant={selectedSettlement ? getStatusVariant(selectedSettlement.status) : "default"}
                  className={selectedSettlement ? getStatusClasses(selectedSettlement.status) : ""}
                >
                  {selectedSettlement?.status}
                </Badge>
              </div>
            </div>
            
            {selectedSettlement?.status === "Failed" && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failure Reason</p>
                <p className="text-sm text-red-500">{selectedSettlement.failureReason}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {selectedSettlement?.status === "Failed" && (
              <Button 
                onClick={() => {
                  setShowDetailsDialog(false);
                  setShowRetryDialog(true);
                }}
              >
                Retry Settlement
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Retry Settlement Dialog */}
      <Dialog open={showRetryDialog} onOpenChange={setShowRetryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-yellow-600">
              <IconRefresh className="h-5 w-5" />
              <DialogTitle>Retry Settlement</DialogTitle>
            </div>
            <DialogDescription>
              {selectedSettlement?.id} - {selectedSettlement?.merchantName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p>
              Are you sure you want to retry this failed settlement?
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium">Failure Reason:</p>
              <p className="text-sm text-red-500">{selectedSettlement?.failureReason}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="font-medium">{selectedSettlement?.amount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{selectedSettlement?.date}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRetryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRetrySettlement}>
              Confirm Retry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 