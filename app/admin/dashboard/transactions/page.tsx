"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconDownload } from "@tabler/icons-react";
import { DataTable } from "@/components/data-table"

// Mock data for transactions
const transactionData = [
  {
    id: 1,
    merchantName: "TechStore Ghana",
    date: "2024-05-15",
    tid: "TID123456",
    terminalId: "AB123456",
    scheme: "MTN Mobile Money",
    reference: "REF78901234",
    amount: "GHS 2,500.00",
    netAmount: "GHS 2,475.00",
    customerNumber: "233541234567",
    status: "SUCCESS"
  },
  {
    id: 2,
    merchantName: "FoodMart Accra",
    date: "2024-05-14",
    tid: "TID789012",
    terminalId: "CD789012",
    scheme: "Vodafone Cash",
    reference: "REF56789012",
    amount: "GHS 850.00",
    netAmount: "GHS 841.50",
    customerNumber: "233551234567",
    status: "SUCCESS"
  },
  {
    id: 3,
    merchantName: "Pharmacy Plus",
    date: "2024-05-14",
    tid: "TID345678",
    terminalId: "EF345678",
    scheme: "AirtelTigo Money",
    reference: "REF34567890",
    amount: "GHS 1,200.00",
    netAmount: "GHS 1,188.00",
    customerNumber: "233561234567",
    status: "PENDING"
  },
  {
    id: 4,
    merchantName: "ElectroWorld",
    date: "2024-05-13",
    tid: "TID901234",
    terminalId: "GH901234",
    scheme: "MTN Mobile Money",
    reference: "REF12345678",
    amount: "GHS 5,000.00",
    netAmount: "GHS 4,950.00",
    customerNumber: "233571234567",
    status: "SUCCESS"
  },
  {
    id: 5,
    merchantName: "Fashion House",
    date: "2024-05-13",
    tid: "TID567890",
    terminalId: "IJ567890",
    scheme: "Vodafone Cash",
    reference: "REF90123456",
    amount: "GHS 3,200.00",
    netAmount: "GHS 3,168.00",
    customerNumber: "233581234567",
    status: "FAILED"
  }
];

// Convert to the schema format expected by DataTable
const transformedData = transactionData.map(item => ({
  id: item.id,
  merchant: item.merchantName,
  date: item.date,
  tid: item.terminalId,
  scheme: item.scheme,
  amount: item.amount,
  status: item.status
}));

// Ghana banks for dropdown
const ghanaBanks = [
  { id: "all", name: "-- All --" },
  { id: "gcb", name: "Ghana Commercial Bank (GCB)" },
  { id: "ecobank", name: "Ecobank Ghana" },
  { id: "stanbic", name: "Stanbic Bank Ghana" },
  { id: "zenith", name: "Zenith Bank Ghana" },
  { id: "scb", name: "Standard Chartered Bank Ghana" },
];

export default function TransactionsPage() {
  const [transactionType, setTransactionType] = useState("collection");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBank, setSelectedBank] = useState("all");
  const [parentMerchant, setParentMerchant] = useState("all");
  const [subMerchant, setSubMerchant] = useState("all");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState("10");
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View, manage and download transaction reports
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <p className="text-muted-foreground">
            Filter and download transaction reports within a date range
          </p>
        </div>
        <Button className="ml-auto" size="sm">
          <IconDownload className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Transactions</CardTitle>
          <CardDescription>
            Refine your search with the filters below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Partner Bank</label>
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
              <label className="text-sm font-medium">Parent Merchant</label>
              <Select value={parentMerchant} onValueChange={setParentMerchant}>
                <SelectTrigger>
                  <SelectValue placeholder="-- All --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">-- All --</SelectItem>
                  <SelectItem value="bluwave">BluWave Limited</SelectItem>
                  <SelectItem value="blupenguin">Blu Penguin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Merchant</label>
              <Select value={subMerchant} onValueChange={setSubMerchant}>
                <SelectTrigger>
                  <SelectValue placeholder="-- All --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">-- All --</SelectItem>
                  <SelectItem value="chensha">Chensha City Ghana Ltd</SelectItem>
                  <SelectItem value="timings">Timings Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Type</label>
              <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="-- All --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">-- All --</SelectItem>
                  <SelectItem value="collection">Collection</SelectItem>
                  <SelectItem value="payout">Payout</SelectItem>
                  <SelectItem value="reversal">Reversal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Successful Collections
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-success"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Count</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">GHS0.02</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Failed Transactions
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-destructive"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Count</p>
                <p className="text-2xl font-bold">1868</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">GHS950,421.45</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Successful Payouts
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-primary"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Count</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">GHS0.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>View all MoMo transactions below.</CardDescription>
          <Tabs defaultValue={transactionType} onValueChange={setTransactionType} className="mt-2">
            <TabsList>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="reversal">Reversal</TabsTrigger>
              <TabsTrigger value="payout">Payout</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <Select value={perPage} onValueChange={setPerPage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="10 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-full max-w-sm">
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <DataTable 
            data={transformedData} 
            enableRowSelection={false}
            enablePagination={true}
          />
        </CardContent>
      </Card>
    </div>
  );
} 