"use client";

import { useAuthStore } from "@/lib/store";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/currency-context";
import Link from "next/link";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IconSearch, IconBuildingBank } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import dashboard data
import data from "@/app/admin/dashboard/data.json";

// List of Ghana banks
const ghanaBanks = [
  { id: "all", name: "All Partner Banks" },
  { id: "gcb", name: "Ghana Commercial Bank (GCB)" },
  { id: "ecobank", name: "Ecobank Ghana" },
  { id: "stanbic", name: "Stanbic Bank Ghana" },
  { id: "zenith", name: "Zenith Bank Ghana" },
  { id: "scb", name: "Standard Chartered Bank Ghana" },
  { id: "fidelity", name: "Fidelity Bank Ghana" },
  { id: "access", name: "Access Bank Ghana" },
  { id: "absa", name: "Absa Bank Ghana" },
  { id: "uba", name: "United Bank for Africa (UBA) Ghana" },
  { id: "fnb", name: "First National Bank Ghana" },
];

export function DashboardContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      // Give Zustand a moment to hydrate from storage
      const timer = setTimeout(() => {
        if (!useAuthStore.getState().user) {
          router.push("/login/merchant");
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setLoaded(true);
    }
  }, [user, router]);

  if (!loaded) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <DashboardSkeleton />;
  }

  return user.role === "admin" ? <AdminDashboard /> : <MerchantDashboard />;
}

function AdminDashboard() {
  const { currency } = useCurrency();
  const [transactionTab, setTransactionTab] = useState("recent");
  const [merchantStatusTab, setMerchantStatusTab] = useState("active");
  const [merchantSearch, setMerchantSearch] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState("all");
  
  // Get bank-specific data based on selection
  const getBankSpecificData = () => {
    // In a real app, you'd fetch different data based on the selected bank
    // For demo purposes, we're just modifying the existing data
    if (selectedBank === "all") {
      return data;
    }
    
    // Some mock logic to show different data based on selection
    const bankSpecificData = [...data];
    
    // Change the amounts based on bank selection
    bankSpecificData.forEach(item => {
      // Use bank id as a seed for generating different values
      const bankSeed = selectedBank.length;
      const multiplier = (bankSeed % 5) + 0.8;
      
      // Parse amount, multiply by bank-specific factor, then format back
      const numValue = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""));
      const newValue = (numValue * multiplier).toFixed(2);
      item.amount = currency + " " + newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      // Also adjust the merchant name to include the bank
      const bank = ghanaBanks.find(b => b.id === selectedBank);
      if (bank && selectedBank !== "all") {
        item.merchant = `${item.merchant} (${bank.name.split(' ')[0]})`;
      }
    });
    
    return bankSpecificData;
  };
  
  // Use bank-specific data throughout the dashboard
  const bankData = getBankSpecificData();
  
  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2">
            <IconBuildingBank className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Partner Bank:</span>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a bank" />
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
        </div>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="merchants">Merchants</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <SectionCards />
            <div className="mt-6">
              <ChartAreaInteractive />
              {selectedBank !== "all" && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center justify-end">
                  <IconBuildingBank className="h-4 w-4 mr-1" />
                  Showing data for: {ghanaBanks.find(b => b.id === selectedBank)?.name}
                </div>
              )}
            </div>
            <div className="mt-6">
              <Tabs value={transactionTab} onValueChange={setTransactionTab}>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Transactions</h2>
                  <div className="flex items-center justify-between">
                    <TabsList className="mr-auto">
                      <TabsTrigger value="recent">Recent</TabsTrigger>
                      <TabsTrigger value="top-merchants">Top Merchants</TabsTrigger>
                      <TabsTrigger value="top-products">Top Products</TabsTrigger>
                    </TabsList>
                    <div className="relative max-w-xs w-72">
                      <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search transactions..."
                        className="pl-8"
                        value={transactionSearch}
                        onChange={(e) => setTransactionSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <TabsContent value="recent" className="mt-4">
                  <DataTable data={bankData.slice(0, 10)} currentTab="recent" />
                </TabsContent>
                <TabsContent value="top-merchants" className="mt-4">
                  <DataTable data={bankData.slice(0, 10)} currentTab="top-merchants" />
                </TabsContent>
                <TabsContent value="top-products" className="mt-4">
                  <DataTable data={bankData.slice(0, 10)} currentTab="top-products" />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="merchants" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Merchant Management</h2>
              <Button asChild>
                <Link href="/dashboard/merchant">Manage Merchants</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardDescription>Total Merchants</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {selectedBank === "all" ? "124" : Math.floor(Math.random() * 50) + 75}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Active Merchants</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {selectedBank === "all" ? "98" : Math.floor(Math.random() * 40) + 58}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>New This Month</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {selectedBank === "all" ? "12" : Math.floor(Math.random() * 10) + 2}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            
            <div className="mt-6">
              <Tabs value={merchantStatusTab} onValueChange={setMerchantStatusTab}>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Merchant Status</h2>
                  <div className="flex items-center justify-between">
                    <TabsList className="mr-auto">
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="new">New</TabsTrigger>
                      <TabsTrigger value="inactive">Inactive</TabsTrigger>
                      <TabsTrigger value="suspended">Suspended</TabsTrigger>
                    </TabsList>
                    <div className="relative max-w-xs w-72">
                      <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search merchants..."
                        className="pl-8"
                        value={merchantSearch}
                        onChange={(e) => setMerchantSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <TabsContent value="active" className="mt-4">
                  <DataTable 
                    data={bankData.slice(0, 10)} 
                    currentTab="active" 
                    tableType="merchant"
                    enableRowSelection={false}
                    enablePagination={true}
                  />
                </TabsContent>
                <TabsContent value="new" className="mt-4">
                  <DataTable 
                    data={bankData} 
                    currentTab="new" 
                    tableType="merchant"
                    enableRowSelection={false}
                    enablePagination={true}
                  />
                </TabsContent>
                <TabsContent value="inactive" className="mt-4">
                  <DataTable 
                    data={bankData} 
                    currentTab="inactive" 
                    tableType="merchant"
                    enableRowSelection={false}
                    enablePagination={true}
                  />
                </TabsContent>
                <TabsContent value="suspended" className="mt-4">
                  <DataTable 
                    data={bankData} 
                    currentTab="suspended" 
                    tableType="merchant"
                    enableRowSelection={false}
                    enablePagination={true}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Transaction History</h2>
              {selectedBank !== "all" && (
                <div className="text-sm text-muted-foreground flex items-center">
                  <IconBuildingBank className="h-4 w-4 mr-1" />
                  {ghanaBanks.find(b => b.id === selectedBank)?.name}
                </div>
              )}
            </div>
            <DataTable 
              data={bankData} 
              enableRowSelection={false}
              enablePagination={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function MerchantDashboard() {
  const [transactionTab, setTransactionTab] = useState("recent");
  
  return (
    <>
      <div className="px-4 lg:px-6">
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <SectionCards />
            <div className="mt-6">
              <ChartAreaInteractive />
            </div>
            <div className="mt-6">
              <Tabs value={transactionTab} onValueChange={setTransactionTab}>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Transactions</h2>
                  <div className="flex items-center justify-between">
                    <TabsList className="mr-auto">
                      <TabsTrigger value="recent">Recent</TabsTrigger>
                      <TabsTrigger value="top-merchants">Top Merchants</TabsTrigger>
                      <TabsTrigger value="top-products">Top Products</TabsTrigger>
                    </TabsList>
                    <div className="relative max-w-xs w-72">
                      <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search transactions..."
                        className="pl-8"
                        value=""
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
                <TabsContent value="recent" className="mt-4">
                  <DataTable data={data.slice(0, 10)} />
                </TabsContent>
                <TabsContent value="top-merchants" className="mt-4">
                  <DataTable data={data.slice(0, 10)} />
                </TabsContent>
                <TabsContent value="top-products" className="mt-4">
                  <DataTable data={data.slice(0, 10)} />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-4">
            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
            <DataTable 
              data={data} 
              enableRowSelection={false}
              enablePagination={true}
            />
          </TabsContent>
          
          <TabsContent value="customers" className="mt-4">
            <h2 className="text-lg font-semibold mb-4">Customer Management</h2>
            <DataTable 
              data={data}
              enableRowSelection={false}
              enablePagination={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
} 