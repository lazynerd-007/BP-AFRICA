"use client";

import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useCurrency } from "@/lib/currency-context";
import { Label } from "@/components/ui/label";
import Image from "next/image";

// Sample commission data
const sampleCommissionData = [
  {
    id: 1,
    scheme: "/images/scheme-1.png",
    schemeAlt: "Banking Scheme 1",
    startDate: "May 20, 2025, 12:00:00 AM",
    endDate: "May 20, 2025, 11:59:59 PM",
    totalCommissions: 0,
  },
  {
    id: 2,
    scheme: "/images/scheme-2.png",
    schemeAlt: "Banking Scheme 2",
    startDate: "May 20, 2025, 12:00:00 AM",
    endDate: "May 20, 2025, 11:59:59 PM",
    totalCommissions: 0,
  },
  {
    id: 3,
    scheme: "/images/scheme-3.png",
    schemeAlt: "Banking Scheme 3",
    startDate: "May 20, 2025, 12:00:00 AM",
    endDate: "May 20, 2025, 11:59:59 PM",
    totalCommissions: 0,
  },
];

// Add interface for commission data
interface CommissionData {
  id: number;
  scheme: string;
  schemeAlt: string;
  startDate: string;
  endDate: string;
  totalCommissions: number;
}

export default function CommissionsPage() {
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState("collection");
  const [partnerBank, setPartnerBank] = useState("all");
  const [parentMerchant, setParentMerchant] = useState("all");
  const [subMerchant, setSubMerchant] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="px-4 lg:px-6 py-4">
      <div className="mb-6">
        <p className="text-muted-foreground mb-3">Filter data with the dropdown below.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <Label htmlFor="partner-bank" className="text-sm mb-1">Partner Bank</Label>
            <Select value={partnerBank} onValueChange={setPartnerBank}>
              <SelectTrigger id="partner-bank" className="h-9">
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- All --</SelectItem>
                <SelectItem value="bank1">Bank 1</SelectItem>
                <SelectItem value="bank2">Bank 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="parent-merchant" className="text-sm mb-1">Parent Merchant</Label>
            <Select value={parentMerchant} onValueChange={setParentMerchant}>
              <SelectTrigger id="parent-merchant" className="h-9">
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- All --</SelectItem>
                <SelectItem value="merchant1">Merchant 1</SelectItem>
                <SelectItem value="merchant2">Merchant 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="sub-merchant" className="text-sm mb-1">Sub Merchant</Label>
            <Select value={subMerchant} onValueChange={setSubMerchant}>
              <SelectTrigger id="sub-merchant" className="h-9">
                <SelectValue placeholder="-- All --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-- All --</SelectItem>
                <SelectItem value="sub1">Sub Merchant 1</SelectItem>
                <SelectItem value="sub2">Sub Merchant 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="start-date" className="text-sm mb-1">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9"
            />
          </div>
          
          <div>
            <Label htmlFor="end-date" className="text-sm mb-1">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Commissions From Collections</CardTitle>
            <p className="text-muted-foreground text-xs">(today)</p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(0.00)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Commissions From Payouts</CardTitle>
            <p className="text-muted-foreground text-xs">(today)</p>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(0.00)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">All Commissions</h2>
        <p className="text-muted-foreground text-sm mb-4">View all Commissions below.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="payout">Payout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="collection" className="mt-4">
          <CommissionsTable data={sampleCommissionData} />
        </TabsContent>
        
        <TabsContent value="payout" className="mt-4">
          <CommissionsTable data={sampleCommissionData} />
        </TabsContent>
      </Tabs>
      
      <div className="text-xs text-muted-foreground mt-8">
        © 2025 The Blu Penguin Ltd.
      </div>
    </div>
  );
}

function CommissionsTable({ data }: { data: CommissionData[] }) {
  const [perPage, setPerPage] = useState("10");
  
  return (
    <div>
      <div className="mb-4">
        <Select value={perPage} onValueChange={setPerPage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10 per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">SCHEME</TableHead>
              <TableHead className="font-medium">START DATE</TableHead>
              <TableHead className="font-medium">END DATE</TableHead>
              <TableHead className="font-medium">TOTAL COMMSN.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-md overflow-hidden relative">
                    {item.scheme ? (
                      <Image 
                        src="/placeholder-bank-logo.png" 
                        alt={item.schemeAlt}
                        className="object-contain"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.startDate}</TableCell>
                <TableCell>{item.endDate}</TableCell>
                <TableCell>{item.totalCommissions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        Showing 1-{Math.min(data.length, parseInt(perPage))} of {data.length}
      </div>
    </div>
  );
} 