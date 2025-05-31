"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  IconQrcode, 
  IconReceipt, 
  IconPlus, 
  IconCopy, 
  IconDownload, 
  IconEye,
  IconInfoCircle,
  IconBuilding
} from "@tabler/icons-react";

export default function SubmerchantPaymentsPage() {
  // State for modals
  const [paymentLinkModalOpen, setPaymentLinkModalOpen] = useState(false);
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
  
  // State for existing items (simulate existing items)
  const [hasPaymentLink, setHasPaymentLink] = useState(false);
  const [hasQrCode, setHasQrCode] = useState(false);
  
  // Form states for payment link
  const [linkTitle, setLinkTitle] = useState("");
  const [linkAmount, setLinkAmount] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [linkType, setLinkType] = useState("one-time");
  
  // Form states for QR code
  const [qrTitle, setQrTitle] = useState("");
  const [qrAmount, setQrAmount] = useState("");
  const [qrDescription, setQrDescription] = useState("");
  
  // Mock data for existing payment link and QR code
  const existingPaymentLink = {
    id: "PLK-SUB-001",
    title: "Product Payment",
    amount: 150.00,
    currency: "GHS",
    description: "Payment for premium product",
    type: "one-time",
    url: "https://pay.bluepay.com/sub/PLK-SUB-001",
    created: "2023-11-15T10:30:00",
    parentApproval: "Approved"
  };
  
  const existingQrCode = {
    id: "QRC-SUB-001",
    title: "Store Counter Payment",
    amount: 0, // Dynamic amount
    currency: "GHS",
    description: "Scan to pay at our store",
    qrCodeUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    created: "2023-11-15T09:15:00",
    parentApproval: "Approved"
  };
  
  // Handle form submissions
  const handleCreatePaymentLink = () => {
    if (!linkTitle || !linkAmount) return;
    
    setHasPaymentLink(true);
    setPaymentLinkModalOpen(false);
    
    // Reset form
    setLinkTitle("");
    setLinkAmount("");
    setLinkDescription("");
    setLinkType("one-time");
  };
  
  const handleCreateQrCode = () => {
    if (!qrTitle) return;
    
    setHasQrCode(true);
    setQrCodeModalOpen(false);
    
    // Reset form
    setQrTitle("");
    setQrAmount("");
    setQrDescription("");
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Create and manage payment links and QR codes for your submerchant account
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          As a submerchant, all payment links and QR codes require approval from your parent merchant before going live. 
          Transaction limits apply as set by your parent merchant.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="payment-links" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="payment-links">
            <IconReceipt className="h-4 w-4 mr-2" />
            Payment Links
          </TabsTrigger>
          <TabsTrigger value="qr-codes">
            <IconQrcode className="h-4 w-4 mr-2" />
            QR Codes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment-links" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your Payment Links</h2>
            {!hasPaymentLink && (
              <Dialog open={paymentLinkModalOpen} onOpenChange={setPaymentLinkModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Create New Link
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create Payment Link</DialogTitle>
                    <DialogDescription>
                      Create a payment link for your submerchant account. This will require approval from your parent merchant.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <Alert>
                      <IconBuilding className="h-4 w-4" />
                      <AlertDescription>
                        This payment link will be subject to your daily limit of ₦50,000 and monthly limit of ₦1,000,000.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="link-title">Title</Label>
                      <Input
                        id="link-title"
                        placeholder="Enter payment link title"
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="link-amount">Amount (GHS)</Label>
                      <Input
                        id="link-amount"
                        type="number"
                        placeholder="0.00"
                        max="50000"
                        value={linkAmount}
                        onChange={(e) => setLinkAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Maximum amount: ₦50,000 per transaction</p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="link-type">Payment Type</Label>
                      <Select value={linkType} onValueChange={setLinkType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time Payment</SelectItem>
                          <SelectItem value="recurring" disabled>Recurring Payment (Parent Approval Required)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="link-description">Description (Optional)</Label>
                      <Textarea
                        id="link-description"
                        placeholder="Enter payment description"
                        value={linkDescription}
                        onChange={(e) => setLinkDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPaymentLinkModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePaymentLink} disabled={!linkTitle || !linkAmount}>
                      Submit for Approval
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {hasPaymentLink ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{existingPaymentLink.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(existingPaymentLink.created).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {existingPaymentLink.parentApproval}
                    </Badge>
                    <Badge variant="outline">
                      {existingPaymentLink.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                    <p className="text-lg font-semibold">
                      {existingPaymentLink.currency} {existingPaymentLink.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Link ID</Label>
                    <p className="font-mono text-sm">{existingPaymentLink.id}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Payment URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      value={existingPaymentLink.url} 
                      readOnly 
                      className="bg-muted"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(existingPaymentLink.url)}
                    >
                      <IconCopy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <IconEye className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    <IconDownload className="h-4 w-4 mr-2" />
                    Download QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <IconReceipt className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payment Links Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first payment link to start accepting payments from customers.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="qr-codes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Your QR Codes</h2>
            {!hasQrCode && (
              <Dialog open={qrCodeModalOpen} onOpenChange={setQrCodeModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Create QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create QR Code</DialogTitle>
                    <DialogDescription>
                      Generate a QR code for in-person payments at your location.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <Alert>
                      <IconBuilding className="h-4 w-4" />
                      <AlertDescription>
                        QR code payments are subject to your transaction limits and require parent merchant approval.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="qr-title">QR Code Title</Label>
                      <Input
                        id="qr-title"
                        placeholder="e.g., Store Counter Payment"
                        value={qrTitle}
                        onChange={(e) => setQrTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="qr-amount">Fixed Amount (Optional)</Label>
                      <Input
                        id="qr-amount"
                        type="number"
                        placeholder="Leave empty for dynamic amount"
                        max="50000"
                        value={qrAmount}
                        onChange={(e) => setQrAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to allow customers to enter any amount (up to ₦50,000)
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="qr-description">Description (Optional)</Label>
                      <Textarea
                        id="qr-description"
                        placeholder="Payment description that customers will see"
                        value={qrDescription}
                        onChange={(e) => setQrDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setQrCodeModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateQrCode} disabled={!qrTitle}>
                      Submit for Approval
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {hasQrCode ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{existingQrCode.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(existingQrCode.created).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {existingQrCode.parentApproval}
                    </Badge>
                    <Badge variant="outline">
                      {existingQrCode.amount > 0 ? 'Fixed Amount' : 'Dynamic Amount'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Amount Type</Label>
                      <p className="text-lg font-semibold">
                        {existingQrCode.amount > 0 
                          ? `Fixed - ${existingQrCode.currency} ${existingQrCode.amount.toFixed(2)}`
                          : 'Dynamic - Customer enters amount'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">QR Code ID</Label>
                      <p className="font-mono text-sm">{existingQrCode.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="p-4 border-2 border-dashed rounded-lg">
                      <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                        <IconQrcode className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-center mt-2 text-muted-foreground">QR Code</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <IconDownload className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button variant="outline" size="sm">
                    <IconEye className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <IconQrcode className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No QR Codes Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create a QR code to accept in-person payments at your business location.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 