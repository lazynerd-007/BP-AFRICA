"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  IconDownload, 
  IconCash, 
  IconReportMoney, 
  IconTrendingUp, 
  IconSearch
} from "@tabler/icons-react";
import { useCurrency } from "@/lib/currency-context";

// Mock data for financial reports
const financialData = [
  {
    id: 1,
    date: "2025-05-20",
    transactionType: "Collection",
    partnerBank: "Ghana Commercial Bank",
    merchant: "Chensha City Ghana Ltd",
    totalAmount: "15,230.00",
    commission: "304.60",
    partnerShare: "152.30",
    merchantShare: "76.15",
    systemShare: "76.15",
    transactionCount: 42,
    status: "Settled"
  },
  {
    id: 2,
    date: "2025-05-19",
    transactionType: "Payout",
    partnerBank: "Ecobank Ghana",
    merchant: "Timings Ltd",
    totalAmount: "8,750.00",
    commission: "175.00",
    partnerShare: "87.50",
    merchantShare: "43.75",
    systemShare: "43.75",
    transactionCount: 23,
    status: "Settled"
  },
  {
    id: 3,
    date: "2025-05-18",
    transactionType: "Collection",
    partnerBank: "Stanbic Bank Ghana",
    merchant: "BluWave Limited",
    totalAmount: "22,450.00",
    commission: "449.00",
    partnerShare: "224.50",
    merchantShare: "112.25",
    systemShare: "112.25",
    transactionCount: 56,
    status: "Pending"
  },
  {
    id: 4,
    date: "2025-05-17",
    transactionType: "Collection",
    partnerBank: "Zenith Bank Ghana",
    merchant: "Blu Penguin",
    totalAmount: "5,600.00",
    commission: "112.00",
    partnerShare: "56.00",
    merchantShare: "28.00",
    systemShare: "28.00",
    transactionCount: 18,
    status: "Settled"
  },
  {
    id: 5,
    date: "2025-05-16",
    transactionType: "Payout",
    partnerBank: "Standard Chartered Bank Ghana",
    merchant: "Chensha City Ghana Ltd",
    totalAmount: "12,350.00",
    commission: "247.00",
    partnerShare: "123.50",
    merchantShare: "61.75",
    systemShare: "61.75",
    transactionCount: 35,
    status: "Pending"
  },
  {
    id: 6,
    date: "2025-05-15",
    transactionType: "Collection",
    partnerBank: "Ghana Commercial Bank",
    merchant: "BluWave Limited",
    totalAmount: "18,920.00",
    commission: "378.40",
    partnerShare: "189.20",
    merchantShare: "94.60",
    systemShare: "94.60",
    transactionCount: 47,
    status: "Settled"
  },
  {
    id: 7,
    date: "2025-05-14",
    transactionType: "Payout",
    partnerBank: "Ecobank Ghana",
    merchant: "Timings Ltd",
    totalAmount: "9,480.00",
    commission: "189.60",
    partnerShare: "94.80",
    merchantShare: "47.40",
    systemShare: "47.40",
    transactionCount: 28,
    status: "Settled"
  },
  {
    id: 8,
    date: "2025-05-13",
    transactionType: "Collection",
    partnerBank: "Stanbic Bank Ghana",
    merchant: "Blu Penguin",
    totalAmount: "7,850.00",
    commission: "157.00",
    partnerShare: "78.50",
    merchantShare: "39.25",
    systemShare: "39.25",
    transactionCount: 22,
    status: "Pending"
  }
];

// Ghana banks for dropdown
const ghanaBanks = [
  { id: "all", name: "-- All --" },
  { id: "gcb", name: "Ghana Commercial Bank (GCB)" },
  { id: "ecobank", name: "Ecobank Ghana" },
  { id: "stanbic", name: "Stanbic Bank Ghana" },
  { id: "zenith", name: "Zenith Bank Ghana" },
  { id: "scb", name: "Standard Chartered Bank Ghana" },
];

// Merchants for dropdown
const merchants = [
  { id: "all", name: "-- All --" },
  { id: "bluwave", name: "BluWave Limited", parent: true },
  { id: "blupenguin", name: "Blu Penguin", parent: true },
  { id: "chensha", name: "Chensha City Ghana Ltd", parent: false, parentId: "bluwave" },
  { id: "timings", name: "Timings Ltd", parent: false, parentId: "blupenguin" },
  { id: "digitalplus", name: "Digital Plus", parent: false, parentId: "bluwave" },
  { id: "futuretech", name: "Future Tech Ghana", parent: false, parentId: "blupenguin" },
  { id: "quickserve", name: "QuickServe Ltd", parent: false, parentId: "bluwave" },
  { id: "payexpress", name: "PayExpress Ghana", parent: false, parentId: "blupenguin" },
];



// Available columns for export customization
const availableColumns = [
  { id: "date", label: "Date", checked: true },
  { id: "transactionType", label: "Transaction Type", checked: true },
  { id: "partnerBank", label: "Partner Bank", checked: true },
  { id: "merchant", label: "Merchant", checked: true },
  { id: "totalAmount", label: "Total Amount", checked: true },
  { id: "commission", label: "Commission", checked: true },
  { id: "partnerShare", label: "Partner Share", checked: true },
  { id: "merchantShare", label: "Merchant Share", checked: true },
  { id: "systemShare", label: "System Share", checked: true },
  { id: "transactionCount", label: "Transaction Count", checked: true },
  { id: "status", label: "Status", checked: true },
  { id: "averageValue", label: "Average Transaction Value", checked: false },
  { id: "highestValue", label: "Highest Transaction Value", checked: false },
  { id: "lowestValue", label: "Lowest Transaction Value", checked: false },
  { id: "failureRate", label: "Failure Rate", checked: false },
  { id: "settlementTime", label: "Settlement Time", checked: false },
];

export default function FinancialReportsPage() {
  const { currency } = useCurrency();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBank, setSelectedBank] = useState("all");
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [selectedSubMerchant, setSelectedSubMerchant] = useState("all");
  const [merchantSearchTerm, setMerchantSearchTerm] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [exportColumns, setExportColumns] = useState(availableColumns);
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportType, setExportType] = useState<"collection" | "payout" | "all">("all");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSettlementDialog, setShowSettlementDialog] = useState(false);
  
  // For merchant report pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [merchantReportSearchTerm, setMerchantReportSearchTerm] = useState("");

  // Toggle column selection for export
  const toggleExportColumn = (id: string) => {
    setExportColumns(
      exportColumns.map((col) => 
        col.id === id ? { ...col, checked: !col.checked } : col
      )
    );
  };

  // Select all columns
  const selectAllColumns = () => {
    setExportColumns(exportColumns.map((col) => ({ ...col, checked: true })));
  };

  // Deselect all columns
  const deselectAllColumns = () => {
    setExportColumns(exportColumns.map((col) => ({ ...col, checked: false })));
  };

  // Export specific transaction type data (collection or payout)
  const handleExportTransactionType = (type: "collection" | "payout" | "all") => {
    const typeLabel = type === "all" ? "All Transactions" : type === "collection" ? "Collections" : "Payouts";
    
    const filteredForExport = financialData.filter(item => {
      return type === "all" || item.transactionType.toLowerCase() === type.toLowerCase();
    });
    
    const exportableColumns = exportColumns.filter((col) => col.checked).map((col) => col.id);
    
    console.log(`Exporting ${typeLabel} in ${exportFormat} format with columns:`, exportableColumns);
    console.log('Data to export:', filteredForExport);
    
    // In a real application, this would make an API call to generate the export file
    alert(`Export initiated: ${typeLabel} in ${exportFormat.toUpperCase()} format with ${exportableColumns.length} columns`);
  };

  // Export settlement data
  const handleExportSettlement = () => {
    // Prepare columns for export
    const typeLabel = exportType === "all" 
      ? "All Transactions" 
      : exportType === "collection" 
        ? "Collections" 
        : "Payouts";
    
    console.log(`Exporting settlement report in ${exportFormat} format`);
    alert(`Settlement Export initiated: ${typeLabel} in ${exportFormat.toUpperCase()} format`);
    
    // Here you would implement the actual export functionality
    // For example:
    // downloadReport({
    //   type: exportType,
    //   format: exportFormat,
    //   columns: exportColumns.filter(col => col.checked).map(col => col.id),
    //   startDate,
    //   endDate,
    //   bank: selectedBank,
    //   merchant: selectedMerchant
    // });
  };

  // Status badge variant mapper
  const getStatusVariant = (status: string): "default" | "outline" | "destructive" | "secondary" => {
    const statusMap: Record<string, "default" | "outline" | "destructive" | "secondary"> = {
      "Settled": "default",
      "Pending": "outline",
      "Failed": "destructive"
    };
    
    return statusMap[status] || "secondary";
  };

  // Filter merchants for dropdown search
  const filteredMerchants = useMemo(() => {
    return merchants.filter(merchant => 
      merchantSearchTerm === "" || 
      merchant.name.toLowerCase().includes(merchantSearchTerm.toLowerCase())
    );
  }, [merchantSearchTerm]);

  // Get available submerchants based on selected parent merchant
  const availableSubMerchants = useMemo(() => {
    if (selectedMerchant === "all") {
      return merchants.filter(m => !m.parent);
    }
    return merchants.filter(m => !m.parent && m.parentId === selectedMerchant);
  }, [selectedMerchant]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return financialData.filter(item => {
      const matchesSearch = 
        searchTerm === "" || 
        item.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partnerBank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.transactionType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBank = selectedBank === "all" || 
        item.partnerBank.includes(ghanaBanks.find(bank => bank.id === selectedBank)?.name.replace("-- All --", "") || "");
      
      const matchesMerchant = selectedMerchant === "all" || 
        item.merchant.includes(merchants.find(m => m.id === selectedMerchant)?.name.replace("-- All --", "") || "");
      
      const matchesSubMerchant = selectedSubMerchant === "all" || 
        item.merchant.includes(merchants.find(m => m.id === selectedSubMerchant)?.name.replace("-- All --", "") || "");
      
      const matchesType = transactionType === "all" || 
        item.transactionType.toLowerCase() === transactionType.toLowerCase();
      
      return matchesSearch && matchesBank && matchesMerchant && matchesSubMerchant && matchesType;
    });
  }, [searchTerm, selectedBank, selectedMerchant, selectedSubMerchant, transactionType]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalTransactions = filteredData.reduce((sum: number, item: typeof financialData[number]) => sum + item.transactionCount, 0);
    const totalAmount = filteredData.reduce((sum: number, item: typeof financialData[number]) => sum + parseFloat(item.totalAmount.replace(/,/g, '')), 0);
    const totalCommission = filteredData.reduce((sum: number, item: typeof financialData[number]) => sum + parseFloat(item.commission.replace(/,/g, '')), 0);
    const totalPartnerShare = filteredData.reduce((sum: number, item: typeof financialData[number]) => sum + parseFloat(item.partnerShare.replace(/,/g, '')), 0);
    const totalMerchantShare = filteredData.reduce((sum: number, item: typeof financialData[number]) => sum + parseFloat(item.merchantShare.replace(/,/g, '')), 0);
    const totalSystemShare = filteredData.reduce((sum: number, item: typeof financialData[number]) => sum + parseFloat(item.systemShare.replace(/,/g, '')), 0);
    
    return {
      totalTransactions,
      totalAmount: totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalCommission: totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalPartnerShare: totalPartnerShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalMerchantShare: totalMerchantShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalSystemShare: totalSystemShare.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
  }, [filteredData]);
  
  // Filter data for merchant report tab
  const filteredMerchantData = useMemo(() => {
    return financialData.filter(item => {
      const matchesSearch = 
        merchantReportSearchTerm === "" || 
        item.merchant.toLowerCase().includes(merchantReportSearchTerm.toLowerCase()) ||
        item.partnerBank.toLowerCase().includes(merchantReportSearchTerm.toLowerCase());
      
      const matchesBank = selectedBank === "all" || 
        item.partnerBank.includes(ghanaBanks.find(bank => bank.id === selectedBank)?.name.replace("-- All --", "") || "");
      
      const matchesMerchant = selectedMerchant === "all" || 
        item.merchant.includes(merchants.find(m => m.id === selectedMerchant)?.name.replace("-- All --", "") || "");
      
      const matchesSubMerchant = selectedSubMerchant === "all" || 
        item.merchant.includes(merchants.find(m => m.id === selectedSubMerchant)?.name.replace("-- All --", "") || "");
      
      const matchesType = transactionType === "all" || 
        item.transactionType.toLowerCase() === transactionType.toLowerCase();
      
      return matchesSearch && matchesBank && matchesMerchant && matchesSubMerchant && matchesType;
    });
  }, [merchantReportSearchTerm, selectedBank, selectedMerchant, selectedSubMerchant, transactionType]);
  
  // Paginate merchant report data
  const paginatedMerchantData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredMerchantData.slice(startIndex, startIndex + pageSize);
  }, [filteredMerchantData, currentPage, pageSize]);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredMerchantData.length / pageSize);
  }, [filteredMerchantData, pageSize]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="px-4 lg:px-6 space-y-6">
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary Reports</TabsTrigger>
          <TabsTrigger value="merchant">Merchant Reports</TabsTrigger>
          <TabsTrigger value="commission">Commission Reports</TabsTrigger>
          <TabsTrigger value="settlement">Settlement Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filter Financial Reports</CardTitle>
              <CardDescription>
                Refine your financial reports with the filters below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Partner Bank</label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger className="w-full min-w-[200px]">
                      <SelectValue placeholder="-- All --" />
                    </SelectTrigger>
                    <SelectContent>
                      {ghanaBanks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Merchant</label>
                  <Select value={selectedMerchant} onValueChange={setSelectedMerchant}>
                    <SelectTrigger className="w-full min-w-[200px]">
                      <SelectValue placeholder="-- All --" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Search merchants..."
                          value={merchantSearchTerm}
                          onChange={(e) => setMerchantSearchTerm(e.target.value)}
                          className="mb-2"
                        />
                      </div>
                      <SelectItem value="all">-- All --</SelectItem>
                      {filteredMerchants
                        .filter(m => m.parent)
                        .map((merchant) => (
                          <SelectItem key={merchant.id} value={merchant.id}>
                            {merchant.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sub Merchant</label>
                  <Select value={selectedSubMerchant} onValueChange={setSelectedSubMerchant}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- All --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">-- All --</SelectItem>
                      {availableSubMerchants.map((merchant) => (
                        <SelectItem key={merchant.id} value={merchant.id}>
                          {merchant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex gap-2 min-w-[200px]">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-1/2 min-w-[120px]"
                    />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-1/2 min-w-[120px]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction Type</label>
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger className="w-full min-w-[200px]">
                      <SelectValue placeholder="-- All --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">-- All --</SelectItem>
                      <SelectItem value="collection">Collection</SelectItem>
                      <SelectItem value="payout">Payout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 lg:col-span-5 flex justify-end">
                  <div className="flex space-x-2">
                    <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-1">
                          <IconDownload className="h-4 w-4" />
                          <span>Export Report</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Export Financial Report</DialogTitle>
                          <DialogDescription>
                            Select format and customize columns for export
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label>Transaction Type</Label>
                            <Select value={exportType} onValueChange={(value) => setExportType(value as "collection" | "payout" | "all")}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Transactions</SelectItem>
                                <SelectItem value="collection">Collections Only</SelectItem>
                                <SelectItem value="payout">Payouts Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Export Format</Label>
                            <Select value={exportFormat} onValueChange={setExportFormat}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="excel">Excel</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Columns to Export</Label>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={selectAllColumns}
                                >
                                  Select All
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={deselectAllColumns}
                                >
                                  Clear All
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                              {exportColumns.map((column) => (
                                <div key={column.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`col-${column.id}`} 
                                    checked={column.checked} 
                                    onCheckedChange={(checked) => {
                                      if (typeof checked === 'boolean') {
                                        toggleExportColumn(column.id);
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`col-${column.id}`}>{column.label}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button>
                          <Button onClick={() => handleExportTransactionType(exportType)}>
                            Export Report
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Input
                  placeholder="Search by merchant, bank, or transaction type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Transaction Value
                </CardTitle>
                <IconCash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency} {summaryStats.totalAmount}</div>
                <p className="text-xs text-muted-foreground">
                  {summaryStats.totalTransactions} transactions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Commission
                </CardTitle>
                <IconReportMoney className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency} {summaryStats.totalCommission}</div>
                <p className="text-xs text-muted-foreground">
                  Across all transactions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  BP Revenue
                </CardTitle>
                <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currency} {summaryStats.totalSystemShare}</div>
                <p className="text-xs text-muted-foreground">
                  From commissions
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>
                    Overview of financial performance across all channels
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleExportTransactionType("collection")}
                  >
                    <IconDownload className="h-4 w-4" />
                    <span>Export Collections</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleExportTransactionType("payout")}
                  >
                    <IconDownload className="h-4 w-4" />
                    <span>Export Payouts</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Partner Bank</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Partner Share</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.transactionType}</TableCell>
                      <TableCell>{item.partnerBank}</TableCell>
                      <TableCell>{item.merchant}</TableCell>
                      <TableCell className="text-right">{currency} {item.totalAmount}</TableCell>
                      <TableCell className="text-right">{currency} {item.commission}</TableCell>
                      <TableCell className="text-right">{currency} {item.partnerShare}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="merchant" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Merchant Financial Report</CardTitle>
                  <CardDescription>
                    Detailed breakdown of financial transactions by merchant
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={paginatedMerchantData.length === 0}
                    onClick={() => alert(`Export ${paginatedMerchantData.length} rows from current page`)}
                  >
                    <IconDownload className="h-4 w-4 mr-2" />
                    Export Current Page
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search merchants or banks..."
                    className="pl-8"
                    value={merchantReportSearchTerm}
                    onChange={(e) => {
                      setMerchantReportSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                  />
                </div>
                
                <div>
                  <Select value={selectedMerchant} onValueChange={(value) => {
                    setSelectedMerchant(value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Merchant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">-- All Merchants --</SelectItem>
                      {merchants
                        .filter(m => m.parent)
                        .map((merchant) => (
                          <SelectItem key={merchant.id} value={merchant.id}>
                            {merchant.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Partner Bank</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead className="text-center">Transaction Count</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMerchantData.length > 0 ? (
                      paginatedMerchantData.map((item) => {
                        // Calculate balance (total amount minus commission)
                        const totalAmount = parseFloat(item.totalAmount.replace(/,/g, ''));
                        const commission = parseFloat(item.commission.replace(/,/g, ''));
                        const balance = (totalAmount - commission).toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        });
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                            <TableCell>{item.partnerBank}</TableCell>
                            <TableCell>{item.merchant}</TableCell>
                            <TableCell className="text-right">{currency} {item.totalAmount}</TableCell>
                            <TableCell className="text-right">{currency} {item.commission}</TableCell>
                            <TableCell className="text-center">{item.transactionCount}</TableCell>
                            <TableCell className="text-right">{currency} {balance}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span>Showing {paginatedMerchantData.length} of {filteredMerchantData.length} entries</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Select value={pageSize.toString()} onValueChange={(value) => {
                      setPageSize(parseInt(value));
                      setCurrentPage(1); // Reset to first page when changing page size
                    }}>
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={pageSize.toString()} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">per page</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">First page</span>
                      ⟪
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous page</span>
                      ←
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <span className="sr-only">Next page</span>
                      →
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <span className="sr-only">Last page</span>
                      ⟫
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Distribution Report</CardTitle>
              <CardDescription>
                Detailed breakdown of commission distribution between parties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Partner Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currency} {summaryStats.totalPartnerShare}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total BP Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currency} {summaryStats.totalSystemShare}</div>
                  </CardContent>
                </Card>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Partner Bank</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-right">Partner Share</TableHead>
                    <TableHead className="text-right">BP Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.partnerBank}</TableCell>
                      <TableCell>{item.merchant}</TableCell>
                      <TableCell className="text-right">{currency} {item.totalAmount}</TableCell>
                      <TableCell className="text-right">{currency} {item.commission}</TableCell>
                      <TableCell className="text-right">{currency} {item.partnerShare}</TableCell>
                      <TableCell className="text-right">{currency} {item.systemShare}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settlement" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Settlement Status Report</CardTitle>
                  <CardDescription>
                    Status of settlements across all transactions
                  </CardDescription>
                </div>
                <Dialog open={showSettlementDialog} onOpenChange={setShowSettlementDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                    >
                      <IconDownload className="h-4 w-4" />
                      <span>Download Settlement File</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Download Settlement Report</DialogTitle>
                      <DialogDescription>
                        Select filters and format for the settlement report
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label>Partner Bank</Label>
                        <Select value={selectedBank} onValueChange={setSelectedBank}>
                          <SelectTrigger>
                            <SelectValue placeholder="-- All --" />
                          </SelectTrigger>
                          <SelectContent>
                            {ghanaBanks.map((bank) => (
                              <SelectItem key={bank.id} value={bank.id}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Merchant</Label>
                        <Select value={selectedMerchant} onValueChange={setSelectedMerchant}>
                          <SelectTrigger>
                            <SelectValue placeholder="-- All --" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="p-2">
                              <Input
                                placeholder="Search merchants..."
                                value={merchantSearchTerm}
                                onChange={(e) => setMerchantSearchTerm(e.target.value)}
                                className="mb-2"
                              />
                            </div>
                            <SelectItem value="all">-- All --</SelectItem>
                            {filteredMerchants
                              .filter(m => m.parent)
                              .map((merchant) => (
                                <SelectItem key={merchant.id} value={merchant.id}>
                                  {merchant.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-1/2"
                          />
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-1/2"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select value={exportFormat} onValueChange={setExportFormat}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>File Type</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="-- All --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">-- All --</SelectItem>
                            <SelectItem value="dr">DR</SelectItem>
                            <SelectItem value="cr">CR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowSettlementDialog(false)}>Cancel</Button>
                      <Button onClick={handleExportSettlement}>
                        Download Settlement File
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Settled Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredData.filter(item => item.status === "Settled").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((filteredData.filter(item => item.status === "Settled").length / filteredData.length) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pending Settlements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredData.filter(item => item.status === "Pending").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((filteredData.filter(item => item.status === "Pending").length / filteredData.length) * 100).toFixed(1)}% of total
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium">Settlement Transactions</h3>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Partner Bank</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-center">Transaction Count</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.transactionType}</TableCell>
                      <TableCell>{item.partnerBank}</TableCell>
                      <TableCell>{item.merchant}</TableCell>
                      <TableCell className="text-right">{currency} {item.totalAmount}</TableCell>
                      <TableCell className="text-center">{item.transactionCount}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 