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
import { IconQrcode, IconReceipt, IconPlus, IconCopy, IconDownload, IconEye } from "@tabler/icons-react";

export default function MerchantPaymentsPage() {
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
    id: "PLK-001",
    title: "Product Payment",
    amount: 150.00,
    currency: "GHS",
    description: "Payment for premium product",
    type: "one-time",
    url: "https://pay.bluepay.com/link/PLK-001",
    created: "2023-11-15T10:30:00"
  };
  
  const existingQrCode = {
    id: "QRC-001",
    title: "Store Counter Payment",
    amount: 0, // Dynamic amount
    currency: "GHS",
    description: "Scan to pay at our store",
    qrCodeUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    created: "2023-11-15T09:15:00"
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
          Manage payment links and QR codes
        </p>
      </div>

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
                      Create a payment link to share with your customers for payments.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
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
                        value={linkAmount}
                        onChange={(e) => setLinkAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="link-type">Payment Type</Label>
                      <Select value={linkType} onValueChange={setLinkType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time Payment</SelectItem>
                          <SelectItem value="recurring">Recurring Payment</SelectItem>
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
                      Create Link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {hasPaymentLink ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{existingPaymentLink.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(existingPaymentLink.created).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {existingPaymentLink.currency} {existingPaymentLink.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {existingPaymentLink.type}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {existingPaymentLink.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      value={existingPaymentLink.url}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(existingPaymentLink.url)}
                    >
                      <IconCopy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <IconEye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>No Payment Links</CardTitle>
                <CardDescription>
                  You haven&apos;t created any payment links yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create a payment link to share with your customers for one-time or recurring payments.
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
                    Generate QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Generate QR Code</DialogTitle>
                    <DialogDescription>
                      Generate a QR code for in-person payments at your store.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="qr-title">Title</Label>
                      <Input
                        id="qr-title"
                        placeholder="Enter QR code title"
                        value={qrTitle}
                        onChange={(e) => setQrTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="qr-amount">Fixed Amount (GHS) - Optional</Label>
                      <Input
                        id="qr-amount"
                        type="number"
                        placeholder="Leave empty for dynamic amount"
                        value={qrAmount}
                        onChange={(e) => setQrAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        If left empty, customers can enter any amount when scanning
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="qr-description">Description (Optional)</Label>
                      <Textarea
                        id="qr-description"
                        placeholder="Enter QR code description"
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
                      Generate QR Code
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {hasQrCode ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{existingQrCode.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(existingQrCode.created).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {existingQrCode.amount > 0 ? 
                        `${existingQrCode.currency} ${existingQrCode.amount.toFixed(2)}` : 
                        'Dynamic Amount'
                      }
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {existingQrCode.description}
                  </p>
                  
                  <div className="flex items-center justify-center p-6 bg-white border-2 border-dashed border-muted rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="w-32 h-32 bg-muted/20 border-2 border-muted rounded-lg flex items-center justify-center">
                        <IconQrcode className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">QR Code Preview</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <IconDownload className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <IconCopy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>No QR Codes</CardTitle>
                <CardDescription>
                  You haven&apos;t generated any QR codes yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate a QR code for in-person payments. Your customers can scan the code to complete payment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 