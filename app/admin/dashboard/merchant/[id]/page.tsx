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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      { name: "CARD", surcharge: "2.5%" },
      { name: "MOMO", surcharge: "1.5%" }
    ]
  },
  ovaSettings: {
    enabled: true,
    accountNumber: "9876543210",
    balanceLimit: "10000.00",
    mtn: "1234567890",
    airtel: "0987654321", 
    telecel: "1122334455"
  },
  settlementFrequency: "daily",
  momoDetails: {
    provider: "mtn",
    number: "024 123 4567",
    accountName: "John Doe"
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
  const [editMerchantOpen, setEditMerchantOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editMerchantData, setEditMerchantData] = useState({
    email: '',
    phone: '',
    address: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    swiftCode: '',
    surchargeValue: '',
    surchargeTotal: '',
    surchargeMerchant: '',
    surchargeCustomer: '',
    surchargeCap: '',
    settlementFrequency: '',
    momoProvider: '',
    momoNumber: '',
    momoAccountName: '',
    mtnOva: '',
    airtelOva: '',
    telecelOva: ''
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User'
  });
  
  useEffect(() => {
    // In a real app, fetch merchant data based on ID
    // For now using mock data
    setMerchant(merchantData);
    setLoading(false);
    
    // Initialize edit form data
    if (merchantData) {
      setEditMerchantData({
        email: merchantData.email,
        phone: merchantData.phone,
        address: merchantData.address,
        bankName: merchantData.bankDetails.bankName,
        accountNumber: merchantData.bankDetails.accountNumber,
        accountName: merchantData.bankDetails.accountName,
        swiftCode: merchantData.bankDetails.swiftCode,
        surchargeValue: merchantData.surchargeDetails.globalSurchargeValue.replace('%', ''),
        surchargeTotal: '3.5',
        surchargeMerchant: '1.5',
        surchargeCustomer: '2.0', 
        surchargeCap: '100',
        settlementFrequency: merchantData.settlementFrequency || 'daily',
        momoProvider: merchantData.momoDetails?.provider || 'mtn',
        momoNumber: merchantData.momoDetails?.number || '024 123 4567',
        momoAccountName: merchantData.momoDetails?.accountName || 'John Doe',
        mtnOva: merchantData.ovaSettings?.mtn || '1234567890',
        airtelOva: merchantData.ovaSettings?.airtel || '0987654321',
        telecelOva: merchantData.ovaSettings?.telecel || '1122334455'
      });
    }
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
  
  const handleOpenEditMerchant = () => {
    setEditMerchantOpen(true);
  };
  
  const handleSaveEditMerchant = () => {
    // Here you would call the API to update the merchant
    
    // Update local state for demo purposes
    setMerchant(prev => ({
      ...prev,
      email: editMerchantData.email,
      phone: editMerchantData.phone,
      address: editMerchantData.address,
      bankDetails: {
        bankName: editMerchantData.bankName,
        accountNumber: editMerchantData.accountNumber,
        accountName: editMerchantData.accountName,
        swiftCode: editMerchantData.swiftCode
      },
      surchargeDetails: {
        ...prev.surchargeDetails,
        globalSurchargeValue: `${editMerchantData.surchargeValue}%`
      },
      settlementFrequency: editMerchantData.settlementFrequency,
      momoDetails: {
        provider: editMerchantData.momoProvider,
        number: editMerchantData.momoNumber,
        accountName: editMerchantData.momoAccountName
      },
      ovaSettings: {
        mtn: editMerchantData.mtnOva,
        airtel: editMerchantData.airtelOva,
        telecel: editMerchantData.telecelOva
      }
    }));
    
    setEditMerchantOpen(false);
  };
  
  const handleEditMerchantChange = (field: string, value: string) => {
    setEditMerchantData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAddUser = () => {
    // Here you would call the API to add a new user
    
    // Update local state for demo purposes
    const newUserId = merchant.users.length + 1;
    
    setMerchant(prev => ({
      ...prev,
      users: [
        ...prev.users,
        {
          id: newUserId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      ]
    }));
    
    // Reset form and close modal
    setNewUser({
      name: '',
      email: '',
      role: 'User'
    });
    setAddUserOpen(false);
  };
  
  const handleNewUserChange = (field: string, value: string) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
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
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleOpenEditMerchant}
          >
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
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 md:grid-cols-4 h-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="surcharge">Surcharge</TabsTrigger>
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
                  ? `Total surcharge of ${merchant.surchargeDetails.globalSurchargeValue} applied` 
                  : "Custom surcharge per payment method"}
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
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Accounts</CardTitle>
              <Button size="sm" onClick={() => setAddUserOpen(true)}>Add User</Button>
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
      
      {/* Edit Merchant Dialog */}
      <Dialog open={editMerchantOpen} onOpenChange={setEditMerchantOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Merchant</DialogTitle>
            <DialogDescription>
              Update merchant information, banking details, settlement settings, MOMO details, and OVA configuration
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    value={editMerchantData.email} 
                    onChange={(e) => handleEditMerchantChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={editMerchantData.phone} 
                    onChange={(e) => handleEditMerchantChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    value={editMerchantData.address} 
                    onChange={(e) => handleEditMerchantChange('address', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Bank Details</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input 
                    id="bankName" 
                    value={editMerchantData.bankName} 
                    onChange={(e) => handleEditMerchantChange('bankName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input 
                    id="accountNumber" 
                    value={editMerchantData.accountNumber} 
                    onChange={(e) => handleEditMerchantChange('accountNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input 
                    id="accountName" 
                    value={editMerchantData.accountName} 
                    onChange={(e) => handleEditMerchantChange('accountName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">Swift Code</Label>
                  <Input 
                    id="swiftCode" 
                    value={editMerchantData.swiftCode} 
                    onChange={(e) => handleEditMerchantChange('swiftCode', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Surcharge Configuration</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="surchargeTotal">Total Surcharge (%)</Label>
                  <Input 
                    id="surchargeTotal" 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    value={editMerchantData.surchargeTotal} 
                    onChange={(e) => handleEditMerchantChange('surchargeTotal', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surchargeMerchant">Merchant Surcharge (%)</Label>
                  <Input 
                    id="surchargeMerchant" 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    value={editMerchantData.surchargeMerchant} 
                    onChange={(e) => handleEditMerchantChange('surchargeMerchant', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surchargeCustomer">Customer Surcharge (%)</Label>
                  <Input 
                    id="surchargeCustomer" 
                    type="number" 
                    min="0" 
                    step="0.1" 
                    value={editMerchantData.surchargeCustomer} 
                    onChange={(e) => handleEditMerchantChange('surchargeCustomer', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surchargeCap">Surcharge Cap (GHS)</Label>
                  <Input 
                    id="surchargeCap" 
                    type="number" 
                    min="0" 
                    value={editMerchantData.surchargeCap} 
                    onChange={(e) => handleEditMerchantChange('surchargeCap', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Settlement Details</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="settlementFrequency">Settlement Frequency</Label>
                  <select 
                    id="settlementFrequency" 
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editMerchantData.settlementFrequency} 
                    onChange={(e) => handleEditMerchantChange('settlementFrequency', e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">MOMO Details</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="momoProvider">MOMO Provider</Label>
                  <select 
                    id="momoProvider" 
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editMerchantData.momoProvider} 
                    onChange={(e) => handleEditMerchantChange('momoProvider', e.target.value)}
                  >
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="telecel">Telecel Cash</option>
                    <option value="airteltigo">AirtelTigo Money</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="momoNumber">MOMO Number</Label>
                  <Input 
                    id="momoNumber" 
                    value={editMerchantData.momoNumber} 
                    onChange={(e) => handleEditMerchantChange('momoNumber', e.target.value)}
                    placeholder="024 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="momoAccountName">MOMO Account Name</Label>
                  <Input 
                    id="momoAccountName" 
                    value={editMerchantData.momoAccountName} 
                    onChange={(e) => handleEditMerchantChange('momoAccountName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">OVA Selection</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="mtnOva">MTN OVA</Label>
                  <Input 
                    id="mtnOva" 
                    value={editMerchantData.mtnOva} 
                    onChange={(e) => handleEditMerchantChange('mtnOva', e.target.value)}
                    placeholder="MTN OVA Number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airtelOva">Airtel OVA</Label>
                  <Input 
                    id="airtelOva" 
                    value={editMerchantData.airtelOva} 
                    onChange={(e) => handleEditMerchantChange('airtelOva', e.target.value)}
                    placeholder="Airtel OVA Number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telecelOva">Telecel OVA</Label>
                  <Input 
                    id="telecelOva" 
                    value={editMerchantData.telecelOva} 
                    onChange={(e) => handleEditMerchantChange('telecelOva', e.target.value)}
                    placeholder="Telecel OVA Number"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMerchantOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditMerchant}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a new user account for this merchant
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={newUser.name} 
                onChange={(e) => handleNewUserChange('name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email Address</Label>
              <Input 
                id="userEmail" 
                type="email" 
                value={newUser.email} 
                onChange={(e) => handleNewUserChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <select 
                id="userRole" 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newUser.role} 
                onChange={(e) => handleNewUserChange('role', e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={!newUser.name || !newUser.email}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 