"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { IconArrowLeft, IconEdit, IconBan, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";

// Mock merchant data - in a real app, this would come from an API
const merchantData = {
  id: "1",
  name: "Banco Limited",
  code: "BLUPAY1000",
  status: "Active",
  email: "info@bancolimited.com",
  phone: "+233 55 123 4567",
  address: "123 Main Street, Accra, Ghana",
  businessType: "Financial Institution",
  registrationNumber: "REG12345678",
  taxId: "TAX8765432",
  dateCreated: "2023-07-15",
  bankDetails: {
    bankName: "First Bank",
    accountNumber: "1234567890",
    accountName: "Banco Limited",
    swiftCode: "FBGHACAC"
  },
  surchargeDetails: {
    hasGlobalSurcharge: true,
    globalSurchargeValue: "2.5%",
    cardSchemes: [
      { name: "VISA", surcharge: "2.5%" },
      { name: "Mastercard", surcharge: "2.5%" },
      { name: "Amex", surcharge: "3.0%" }
    ]
  },
  ovaSettings: {
    enabled: true,
    accountNumber: "9876543210",
    balanceLimit: "10000.00"
  },
  recentTransactions: [
    { id: 1, date: "2023-09-15", reference: "TRX123456", amount: "5,000.00", status: "Completed" },
    { id: 2, date: "2023-09-14", reference: "TRX123455", amount: "1,200.00", status: "Completed" },
    { id: 3, date: "2023-09-13", reference: "TRX123454", amount: "3,500.00", status: "Failed" },
    { id: 4, date: "2023-09-12", reference: "TRX123453", amount: "800.00", status: "Pending" }
  ],
  users: [
    { id: 1, name: "John Doe", email: "john@bancolimited.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@bancolimited.com", role: "Manager" },
    { id: 3, name: "Mark Wilson", email: "mark@bancolimited.com", role: "Accountant" }
  ]
};

// Define badge variant type
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export default function MerchantDetailPage() {
  const params = useParams();
  const [merchant, setMerchant] = useState(merchantData);
  const [loading, setLoading] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'suspend' | 'deactivate' | 'activate' | null>(null);
  const [actionReason, setActionReason] = useState('');
  
  useEffect(() => {
    // In a real app, fetch merchant data based on ID
    // For now using mock data
    setMerchant(merchantData);
    setLoading(false);
  }, [params.id]);
  
  const handleStatusChange = (action: 'suspend' | 'deactivate' | 'activate') => {
    setStatusAction(action);
    setStatusDialogOpen(true);
  };
  
  const executeStatusChange = () => {
    // Here you would call the API to update the merchant's status
    let newStatus;
    
    switch (statusAction) {
      case 'suspend':
        newStatus = 'Suspended';
        break;
      case 'deactivate':
        newStatus = 'Inactive';
        break;
      case 'activate':
        newStatus = 'Active';
        break;
      default:
        return;
    }
    
    setMerchant(prev => ({
      ...prev,
      status: newStatus
    }));
    
    setStatusDialogOpen(false);
    setActionReason('');
    
    // In a real app, you would show a success notification here
  };
  
  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch(status) {
      case 'Active':
        return 'secondary';
      case 'Suspended':
        return 'destructive';
      case 'Inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  if (loading) {
    return <div className="p-6">Loading merchant details...</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link href="/dashboard/merchant">
              <IconArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{merchant.name}</h1>
          <Badge variant={getStatusBadgeVariant(merchant.status)}>
            {merchant.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {merchant.status === 'Active' && (
            <>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-amber-500 text-amber-500 hover:bg-amber-50"
                onClick={() => handleStatusChange('suspend')}
              >
                <IconPlayerPause className="h-4 w-4" />
                Suspend
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => handleStatusChange('deactivate')}
              >
                <IconBan className="h-4 w-4" />
                Deactivate
              </Button>
            </>
          )}
          
          {(merchant.status === 'Suspended' || merchant.status === 'Inactive') && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-green-500 text-green-500 hover:bg-green-50"
              onClick={() => handleStatusChange('activate')}
            >
              <IconPlayerPlay className="h-4 w-4" />
              Activate
            </Button>
          )}
          
          <Button variant="outline" className="flex items-center gap-2">
            <IconEdit className="h-4 w-4" />
            Edit Merchant
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Merchant Code</CardDescription>
            <CardTitle>{merchant.code}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Date Created</CardDescription>
            <CardTitle>{new Date(merchant.dateCreated).toLocaleDateString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Account Status</CardDescription>
            <CardTitle>{merchant.status}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 md:grid-cols-5 h-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="surcharge">Surcharge</TabsTrigger>
          <TabsTrigger value="ova">OVA Settings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                  <p>{merchant.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Type</p>
                  <p>{merchant.businessType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                  <p>{merchant.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tax ID</p>
                  <p>{merchant.taxId}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{merchant.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{merchant.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p>{merchant.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                  <p>{merchant.bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                  <p>{merchant.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Name</p>
                  <p>{merchant.bankDetails.accountName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Swift Code</p>
                  <p>{merchant.bankDetails.swiftCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="surcharge" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Surcharge Configuration</CardTitle>
              <CardDescription>
                {merchant.surchargeDetails.hasGlobalSurcharge 
                  ? `Global surcharge of ${merchant.surchargeDetails.globalSurchargeValue} applied` 
                  : "Custom surcharge per card scheme"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {merchant.surchargeDetails.cardSchemes.map((scheme, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <p className="font-medium">{scheme.name}</p>
                    <Badge variant="outline">{scheme.surcharge}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ova" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>OVA Settings</CardTitle>
              <CardDescription>
                {merchant.ovaSettings.enabled 
                  ? "Online Virtual Account is enabled" 
                  : "Online Virtual Account is disabled"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {merchant.ovaSettings.enabled ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                    <p>{merchant.ovaSettings.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Balance Limit</p>
                    <p>GHS{merchant.ovaSettings.balanceLimit}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">OVA is not enabled for this merchant</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Accounts</CardTitle>
              <Button size="sm">Add User</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {merchant.users.map((user) => (
                  <div key={user.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge>{user.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Most recent transactions for this merchant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {merchant.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">{transaction.reference}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">GHS{transaction.amount}</p>
                      <Badge 
                        variant={
                          transaction.status === "Completed" ? "secondary" :
                          transaction.status === "Pending" ? "outline" : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusAction === 'suspend' && 'Suspend Merchant'}
              {statusAction === 'deactivate' && 'Deactivate Merchant'}
              {statusAction === 'activate' && 'Activate Merchant'}
            </DialogTitle>
            <DialogDescription>
              {statusAction === 'suspend' && 'This will temporarily suspend the merchant\'s account. They will not be able to process transactions until activated again.'}
              {statusAction === 'deactivate' && 'This will deactivate the merchant\'s account. All services will be disabled.'}
              {statusAction === 'activate' && 'This will activate the merchant\'s account and restore all services.'}
            </DialogDescription>
          </DialogHeader>
          
          {(statusAction === 'suspend' || statusAction === 'deactivate') && (
            <div className="py-4">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason
              </label>
              <textarea
                id="reason"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder="Please provide a reason for this action"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              ></textarea>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={executeStatusChange}
              variant={statusAction === 'activate' ? 'default' : 'destructive'}
              disabled={(statusAction === 'suspend' || statusAction === 'deactivate') && !actionReason.trim()}
            >
              {statusAction === 'suspend' && 'Suspend'}
              {statusAction === 'deactivate' && 'Deactivate'}
              {statusAction === 'activate' && 'Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 