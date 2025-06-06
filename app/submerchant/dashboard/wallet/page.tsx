"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconWallet,
  IconSend,
  IconDownload,
  IconPlus,
  IconHistory,
  IconReceipt,
  IconAlertCircle,
  IconCalendar,
  IconBuildingBank,
  IconArrowDown,
  IconTrash,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

// Type definitions
interface ExternalCustomer {
  id: number;
  name: string;
  email: string;
  mobile: string;
  amount: string;
  narration: string;
  network: string;
}

interface BluepayTransferData {
  type: "bluepay";
  merchantName: string;
  amount: number;
  serviceCharge: number;
  currency: string;
}

interface ExternalTransferData {
  type: "external";
  customers: ExternalCustomer[];
  currency: string;
}

type TransferData = BluepayTransferData | ExternalTransferData;

export default function SubmerchantWalletPage() {
  const [statementOpen, setStatementOpen] = useState(false);
  const [fundingMethodModalOpen, setFundingMethodModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [senderNetwork, setSenderNetwork] = useState("");
  const [momoModalOpen, setMomoModalOpen] = useState(false);
  const [collectionsModalOpen, setCollectionsModalOpen] = useState(false);

  // Transfer modal states
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<"bluepay" | "external" | null>(null);
  const [transferStep, setTransferStep] = useState<"type" | "form" | "preview" | "otp">("type");
  
  // BluPay transfer states
  const [bluepayMerchantSearch, setBluepayMerchantSearch] = useState("");
  const [selectedBluepayMerchant, setSelectedBluepayMerchant] = useState("");
  const [bluepayAmount, setBluepayAmount] = useState("");
  
  // External transfer states
  const [externalCustomers, setExternalCustomers] = useState<ExternalCustomer[]>([
    {
      id: 1,
      name: "",
      email: "",
      mobile: "",
      amount: "",
      narration: "",
      network: ""
    }
  ]);
  
  // OTP states
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  
  // Transaction preview states
  const [previewData, setPreviewData] = useState<TransferData | null>(null);

  // Mock BluPay merchants
  const bluepayMerchants = [
    { id: "STA1000", name: "De Naas - STA1000" },
    { id: "STA1001", name: "Kofi Store - STA1001" },
    { id: "STA1002", name: "Ama Shop - STA1002" },
    { id: "STA1003", name: "John Business - STA1003" },
  ];

  // Mobile networks
  const mobileNetworks = [
    { id: "mtn", name: "MTN" },
    { id: "vodafone", name: "Vodafone" },
    { id: "airtel", name: "AirtelTigo" },
    { id: "telecel", name: "Telecel" },
  ];

  const downloadStatement = () => {
    // In a real application, this would trigger the download
    console.log("Downloading statement from", startDate, "to", endDate);
    setStatementOpen(false);
  };

  const handleFundingMethodSelect = (method: string) => {
    setFundingMethodModalOpen(false);
    
    if (method === "collections") {
      setCollectionsModalOpen(true);
    } else if (method === "momo") {
      setMomoModalOpen(true);
    }
  };

  const handleCollectionsProceed = () => {
    console.log("Proceeding with Collections funding, amount:", fundAmount);
    setCollectionsModalOpen(false);
  };

  const handleMomoProceed = () => {
    console.log("Proceeding with MoMo funding");
    console.log("Customer:", customerName);
    console.log("Email:", customerEmail);
    console.log("Amount:", fundAmount);
    console.log("Mobile:", customerMobile);
    console.log("Network:", senderNetwork);
    setMomoModalOpen(false);
  };

  // Transfer handlers
  const resetTransferModal = () => {
    setTransferType(null);
    setTransferStep("type");
    setBluepayMerchantSearch("");
    setSelectedBluepayMerchant("");
    setBluepayAmount("");
    setExternalCustomers([{
      id: 1,
      name: "",
      email: "",
      mobile: "",
      amount: "",
      narration: "",
      network: ""
    }]);
    setOtpCode(["", "", "", ""]);
    setPreviewData(null);
  };

  const handleTransferTypeSelect = (type: "bluepay" | "external") => {
    setTransferType(type);
    setTransferStep("form");
  };

  const handleBluepayMerchantSelect = (merchantId: string) => {
    const merchant = bluepayMerchants.find(m => m.id === merchantId);
    if (merchant) {
      setSelectedBluepayMerchant(merchant.name);
      setBluepayMerchantSearch(merchant.name);
    }
  };

  const proceedToBluepayPreview = () => {
    if (!selectedBluepayMerchant || !bluepayAmount) return;
    
    const amount = parseFloat(bluepayAmount);
    const serviceCharge = amount * 0.005; // 0.5%
    
    setPreviewData({
      type: "bluepay",
      merchantName: selectedBluepayMerchant,
      amount: amount,
      serviceCharge: serviceCharge,
      currency: "GHS"
    });
    setTransferStep("preview");
  };

  const proceedToExternalPreview = () => {
    const validCustomers = externalCustomers.filter(c => 
      c.name && c.mobile && c.amount && c.network
    );
    
    if (validCustomers.length === 0) return;
    
    setPreviewData({
      type: "external",
      customers: validCustomers,
      currency: "GHS"
    });
    setTransferStep("preview");
  };

  const proceedToOtp = () => {
    setTransferStep("otp");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpCode];
      newOtp[index] = value;
      setOtpCode(newOtp);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const verifyOtp = () => {
    const otp = otpCode.join("");
    if (otp.length === 4) {
      // Handle OTP verification
      console.log("Verifying OTP:", otp);
      console.log("Transfer data:", previewData);
      setTransferModalOpen(false);
      resetTransferModal();
    }
  };

  const addExternalCustomer = () => {
    const newId = Math.max(...externalCustomers.map(c => c.id)) + 1;
    setExternalCustomers([
      ...externalCustomers,
      {
        id: newId,
        name: "",
        email: "",
        mobile: "",
        amount: "",
        narration: "",
        network: ""
      }
    ]);
  };

  const removeExternalCustomer = (id: number) => {
    if (externalCustomers.length > 1) {
      setExternalCustomers(externalCustomers.filter(c => c.id !== id));
    }
  };

  const updateExternalCustomer = (id: number, field: string, value: string) => {
    setExternalCustomers(externalCustomers.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const filteredMerchants = bluepayMerchants.filter(merchant =>
    merchant.name.toLowerCase().includes(bluepayMerchantSearch.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your account balance and transfers
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <IconWallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS235,410.00</div>
            <p className="text-xs text-muted-foreground">
              Available for transfer
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Settlement</CardTitle>
            <IconHistory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS45,670.00</div>
            <p className="text-xs text-muted-foreground">
              Settlement in 1-2 business days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved Funds</CardTitle>
            <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS8,250.00</div>
            <p className="text-xs text-muted-foreground">
              Held for risk management
            </p>
          </CardContent>
        </Card>
              </div>
              
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common wallet operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog open={transferModalOpen} onOpenChange={(open) => {
              setTransferModalOpen(open);
              if (!open) resetTransferModal();
            }}>
                  <DialogTrigger asChild>
                <Button className="h-20 flex flex-col gap-2">
                  <IconSend className="h-6 w-6" />
                  <span>Transfer Money</span>
                    </Button>
                  </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                {transferStep === "type" && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Choose Transfer Type</DialogTitle>
                      <DialogDescription>
                        Select how you want to send money
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card 
                          className="cursor-pointer border-2 hover:border-primary transition-colors"
                          onClick={() => handleTransferTypeSelect("bluepay")}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <IconBuildingBank className="h-12 w-12 text-primary mb-4" />
                            <h3 className="font-semibold">BluPay Merchant</h3>
                            <p className="text-sm text-muted-foreground text-center">
                              Transfer to another BluPay merchant
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className="cursor-pointer border-2 hover:border-primary transition-colors"
                          onClick={() => handleTransferTypeSelect("external")}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <IconSend className="h-12 w-12 text-primary mb-4" />
                            <h3 className="font-semibold">External Transfer</h3>
                            <p className="text-sm text-muted-foreground text-center">
                              Send money to mobile wallets
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </>
                )}

                {transferStep === "form" && transferType === "bluepay" && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Transfer to BluPay Merchant</DialogTitle>
                      <DialogDescription>
                        Enter the merchant details and amount
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="merchant-search">Search Merchant</Label>
                        <Input
                          id="merchant-search"
                          placeholder="Type merchant name or ID..."
                          value={bluepayMerchantSearch}
                          onChange={(e) => setBluepayMerchantSearch(e.target.value)}
                        />
                        {bluepayMerchantSearch && (
                          <div className="border rounded-md max-h-40 overflow-y-auto">
                            {filteredMerchants.map((merchant) => (
                              <div
                                key={merchant.id}
                                className="p-2 hover:bg-muted cursor-pointer"
                                onClick={() => handleBluepayMerchantSelect(merchant.id)}
                              >
                                {merchant.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (GHS)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={bluepayAmount}
                          onChange={(e) => setBluepayAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTransferStep("type")}>
                        Back
                      </Button>
                      <Button 
                        onClick={proceedToBluepayPreview}
                        disabled={!selectedBluepayMerchant || !bluepayAmount}
                      >
                        Continue
                      </Button>
                    </DialogFooter>
                  </>
                )}

                {transferStep === "form" && transferType === "external" && (
                  <>
                    <DialogHeader>
                      <DialogTitle>External Transfer</DialogTitle>
                      <DialogDescription>
                        Send money to mobile wallets. You can add multiple recipients.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                      {externalCustomers.map((customer, index) => (
                        <div key={customer.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Recipient {index + 1}</h4>
                            {externalCustomers.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExternalCustomer(customer.id)}
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            )}
                      </div>
                      
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Name</Label>
                              <Input
                                placeholder="Recipient name"
                                value={customer.name}
                                onChange={(e) => updateExternalCustomer(customer.id, "name", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Mobile Number</Label>
                              <Input
                                placeholder="Phone number"
                                value={customer.mobile}
                                onChange={(e) => updateExternalCustomer(customer.id, "mobile", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Amount</Label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={customer.amount}
                                onChange={(e) => updateExternalCustomer(customer.id, "amount", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Network</Label>
                              <Select 
                                value={customer.network} 
                                onValueChange={(value) => updateExternalCustomer(customer.id, "network", value)}
                              >
                          <SelectTrigger>
                                  <SelectValue placeholder="Select network" />
                          </SelectTrigger>
                          <SelectContent>
                                  {mobileNetworks.map((network) => (
                                    <SelectItem key={network.id} value={network.id}>
                                      {network.name}
                                    </SelectItem>
                                  ))}
                          </SelectContent>
                        </Select>
                      </div>
                          </div>
                          
                          <div>
                            <Label>Narration (Optional)</Label>
                            <Input
                              placeholder="Payment description"
                              value={customer.narration}
                              onChange={(e) => updateExternalCustomer(customer.id, "narration", e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={addExternalCustomer}
                        className="w-full"
                      >
                        <IconPlus className="h-4 w-4 mr-2" />
                        Add Another Recipient
                      </Button>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTransferStep("type")}>
                        Back
                      </Button>
                      <Button onClick={proceedToExternalPreview}>
                        Continue
                      </Button>
                    </DialogFooter>
                  </>
                )}

                {transferStep === "preview" && previewData && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Transfer Preview</DialogTitle>
                      <DialogDescription>
                        Review your transfer details before proceeding
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      {previewData.type === "bluepay" && (
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Recipient:</span>
                            <span className="font-medium">{previewData.merchantName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span className="font-medium">{previewData.currency} {previewData.amount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Service Charge:</span>
                            <span className="font-medium">{previewData.currency} {previewData.serviceCharge.toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex justify-between text-lg font-semibold">
                              <span>Total:</span>
                              <span>{previewData.currency} {(previewData.amount + previewData.serviceCharge).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {previewData.type === "external" && (
                        <div className="space-y-4">
                          {previewData.customers.map((customer, index) => (
                            <div key={customer.id} className="border rounded-lg p-3">
                              <h4 className="font-medium mb-2">Recipient {index + 1}</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Name:</span>
                                  <span>{customer.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Mobile:</span>
                                  <span>{customer.mobile}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Amount:</span>
                                  <span>{previewData.currency} {customer.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Network:</span>
                                  <span className="capitalize">{customer.network}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="border-t pt-3">
                            <div className="flex justify-between text-lg font-semibold">
                              <span>Total Amount:</span>
                              <span>
                                {previewData.currency} {previewData.customers.reduce((sum, c) => sum + parseFloat(c.amount), 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                      </div>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTransferStep("form")}>
                        Back
                      </Button>
                      <Button onClick={proceedToOtp}>
                        Proceed to OTP
                      </Button>
                    </DialogFooter>
                  </>
                )}

                {transferStep === "otp" && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Enter OTP</DialogTitle>
                      <DialogDescription>
                        We&apos;ve sent a 4-digit code to your registered phone number
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="flex justify-center gap-2">
                        {otpCode.map((digit, index) => (
                        <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center text-lg font-semibold"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                          />
                        ))}
                      </div>
                      
                      <div className="text-center">
                        <Button variant="link" className="text-sm">
                          Resend OTP
                        </Button>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTransferStep("preview")}>
                        Back
                      </Button>
                      <Button 
                        onClick={verifyOtp}
                        disabled={otpCode.join("").length !== 4}
                      >
                        Verify & Transfer
                      </Button>
                    </DialogFooter>
                  </>
                )}
                  </DialogContent>
                </Dialog>
                
            <Dialog open={fundingMethodModalOpen} onOpenChange={setFundingMethodModalOpen}>
                  <DialogTrigger asChild>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <IconPlus className="h-6 w-6" />
                  <span>Fund Wallet</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Fund Your Wallet</DialogTitle>
                  <DialogDescription>
                    Choose a funding method for your wallet
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fund-amount">Amount to Fund (GHS)</Label>
                    <Input
                      id="fund-amount"
                      type="number"
                      placeholder="0.00"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      className="h-16 justify-start"
                      onClick={() => handleFundingMethodSelect("collections")}
                      disabled={!fundAmount}
                    >
                      <div className="flex items-center gap-3">
                        <IconReceipt className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-medium">Collections</div>
                          <div className="text-sm text-muted-foreground">
                            Fund from your pending collections
                          </div>
                        </div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-16 justify-start"
                      onClick={() => handleFundingMethodSelect("momo")}
                      disabled={!fundAmount}
                    >
                      <div className="flex items-center gap-3">
                        <IconWallet className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-medium">Mobile Money</div>
                          <div className="text-sm text-muted-foreground">
                            Fund via mobile money transfer
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={statementOpen} onOpenChange={setStatementOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <IconDownload className="h-6 w-6" />
                  <span>Download Statement</span>
                    </Button>
                  </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Download Statement</DialogTitle>
                      <DialogDescription>
                    Select the date range for your wallet statement
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                          <Label>Start Date</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <IconCalendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                          initialFocus
                          />
                      </DialogContent>
                    </Dialog>
                        </div>
                  
                  <div className="grid gap-2">
                          <Label>End Date</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <IconCalendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                          initialFocus
                          />
                      </DialogContent>
                    </Dialog>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setStatementOpen(false)}>
                        Cancel
                      </Button>
                  <Button onClick={downloadStatement} disabled={!startDate || !endDate}>
                        Download
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
          </CardContent>
        </Card>

      {/* Collections Funding Modal */}
      <Dialog open={collectionsModalOpen} onOpenChange={setCollectionsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Fund from Collections</DialogTitle>
            <DialogDescription>
              Transfer funds from your pending collections to your wallet
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Alert>
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                Available collections balance: GHS45,670.00
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-2">
              <Label>Amount to Transfer (GHS)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                max={45670}
              />
              <p className="text-sm text-muted-foreground">
                Maximum available: GHS45,670.00
              </p>
            </div>
            </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCollectionsModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCollectionsProceed}
              disabled={!fundAmount || parseFloat(fundAmount) > 45670}
            >
              Transfer to Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Money Funding Modal */}
      <Dialog open={momoModalOpen} onOpenChange={setMomoModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mobile Money Funding</DialogTitle>
            <DialogDescription>
              Send money to your wallet via mobile money
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Sender Name</Label>
              <Input
                placeholder="Full name of sender"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Sender Email</Label>
              <Input
                type="email"
                placeholder="sender@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
      </div>

            <div className="grid gap-2">
              <Label>Amount (GHS)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                readOnly
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Sender Mobile Number</Label>
              <Input
                placeholder="+233 XX XXX XXXX"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Mobile Network</Label>
              <Select value={senderNetwork} onValueChange={setSenderNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {mobileNetworks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMomoModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMomoProceed}
              disabled={!customerName || !customerEmail || !customerMobile || !senderNetwork}
            >
              Send Payment Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <IconArrowDown className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Collections Settlement</p>
                  <p className="text-sm text-muted-foreground">Nov 15, 2023 at 2:30 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+GHS25,670.00</p>
                <Badge variant="outline" className="text-xs">Completed</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <IconSend className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Transfer to Kofi Store</p>
                  <p className="text-sm text-muted-foreground">Nov 14, 2023 at 11:45 AM</p>
                      </div>
                      </div>
              <div className="text-right">
                <p className="font-medium text-red-600">-GHS5,000.00</p>
                <Badge variant="outline" className="text-xs">Completed</Badge>
                      </div>
          </div>
          
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <IconWallet className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Mobile Money Funding</p>
                  <p className="text-sm text-muted-foreground">Nov 13, 2023 at 4:20 PM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+GHS10,000.00</p>
                <Badge variant="outline" className="text-xs">Completed</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 