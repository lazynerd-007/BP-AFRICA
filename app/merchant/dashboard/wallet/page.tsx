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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  IconSearch,
  IconArrowUp,
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

export default function MerchantWalletPage() {
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
    setExternalCustomers([...externalCustomers, {
      id: newId,
      name: "",
      email: "",
      mobile: "",
      amount: "",
      narration: "",
      network: ""
    }]);
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your merchant wallet, fund, and make transfers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Balance</CardTitle>
            <CardDescription>Current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <IconWallet className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-muted-foreground text-sm">Available Balance</p>
                  <p className="text-3xl font-bold">GHS 12,500.00</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* Funding Method Selection Dialog */}
                <Dialog open={fundingMethodModalOpen} onOpenChange={setFundingMethodModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <IconPlus className="h-4 w-4 mr-2" />
                      Fund Wallet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>BluPay Wallet Funding Form</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-6">
                      <h2 className="text-xl font-medium text-gray-700 mb-6">How do you wish to fund your wallet?</h2>
                      <Select onValueChange={handleFundingMethodSelect}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select funding method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collections">Collections</SelectItem>
                          <SelectItem value="momo">MoMo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setFundingMethodModalOpen(false)} className="bg-red-500 hover:bg-red-600 text-white">
                        Cancel
                      </Button>
                      <Button className="bg-blue-500 hover:bg-blue-600" disabled={true}>
                        Next
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Collections Modal */}
                <Dialog open={collectionsModalOpen} onOpenChange={setCollectionsModalOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Fund Wallet</DialogTitle>
                      <DialogDescription>
                        You can transfer into your wallet to make a payout. You cannot transfer in more than your daily inflow.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Enter amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                        />
                        <p className="text-sm text-red-500">*Max amount (0 GHS)</p>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCollectionsModalOpen(false)} className="bg-red-500 hover:bg-red-600 text-white">
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCollectionsProceed}
                        disabled={!fundAmount || parseFloat(fundAmount) <= 0}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Proceed
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* MoMo Modal */}
                <Dialog open={momoModalOpen} onOpenChange={setMomoModalOpen}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl">BluPay Wallet Funding Form</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-name">Customer Name:</Label>
                        <Input 
                          id="customer-name" 
                          placeholder="e.g. Banco Limited"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customer-email">Customer Email:</Label>
                        <Input 
                          id="customer-email" 
                          type="email"
                          placeholder="e.g. example@company.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount:</Label>
                        <Input 
                          id="amount" 
                          type="number"
                          placeholder="Enter amount"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customer-mobile">Customer Mobile Number:</Label>
                        <Input 
                          id="customer-mobile" 
                          placeholder="e.g. +233 XX XXX XXXX"
                          value={customerMobile}
                          onChange={(e) => setCustomerMobile(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sender-network">Sender&apos;s Mobile Network:</Label>
                        <Select onValueChange={setSenderNetwork} value={senderNetwork}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select network" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mtn">MTN</SelectItem>
                            <SelectItem value="vodafone">Vodafone</SelectItem>
                            <SelectItem value="airtel">Airtel</SelectItem>
                            <SelectItem value="tigo">Tigo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMomoModalOpen(false)} className="bg-red-500 hover:bg-red-600 text-white">
                        Cancel
                      </Button>
                      <Button onClick={handleMomoProceed} className="bg-blue-500 hover:bg-blue-600">
                        Fund Wallet
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Transfer Dialog */}
                <Dialog open={transferModalOpen} onOpenChange={(open) => {
                  setTransferModalOpen(open);
                  if (!open) resetTransferModal();
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <IconSend className="h-4 w-4 mr-2" />
                      Transfer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    {/* Transfer Type Selection */}
                    {transferStep === "type" && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-xl text-center">Merchant Payout</DialogTitle>
                          <DialogDescription className="text-center text-gray-500">
                            Make payout by entering MoMo details below.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-6">
                          <Label className="text-lg text-gray-700 mb-4 block">Who do you wish to send MoMo to?</Label>
                          <Select onValueChange={handleTransferTypeSelect}>
                            <SelectTrigger className="w-full h-12">
                              <SelectValue placeholder="Select transfer type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bluepay">BluPay Merchant</SelectItem>
                              <SelectItem value="external">External merchant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {/* BluPay Transfer Form */}
                    {transferStep === "form" && transferType === "bluepay" && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-xl">BluPay Merchant Transfer Form</DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid gap-6 py-4">
                          <div className="space-y-2">
                            <Label className="text-lg">Search for Bluepay merchant name</Label>
                            <div className="relative">
                              <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search by merchant name..."
                                className="pl-10"
                                value={bluepayMerchantSearch}
                                onChange={(e) => setBluepayMerchantSearch(e.target.value)}
                              />
                            </div>
                            {bluepayMerchantSearch && (
                              <div className="border rounded-md max-h-32 overflow-y-auto">
                                {bluepayMerchants
                                  .filter(m => m.name.toLowerCase().includes(bluepayMerchantSearch.toLowerCase()))
                                  .map(merchant => (
                                    <div
                                      key={merchant.id}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() => handleBluepayMerchantSelect(merchant.id)}
                                    >
                                      {merchant.name}
                                    </div>
                                  ))
                                }
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-lg">Enter Amount</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="0"
                                value={bluepayAmount}
                                onChange={(e) => setBluepayAmount(e.target.value)}
                                className="text-center text-xl pr-20"
                              />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                                <button 
                                  className="text-gray-400 hover:text-gray-600"
                                  onClick={() => setBluepayAmount(prev => String(Math.max(0, parseFloat(prev || "0") + 1)))}
                                >
                                  <IconArrowUp className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-gray-400 hover:text-gray-600"
                                  onClick={() => setBluepayAmount(prev => String(Math.max(0, parseFloat(prev || "0") - 1)))}
                                >
                                  <IconArrowDown className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setTransferStep("type")}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={proceedToBluepayPreview}
                            disabled={!selectedBluepayMerchant || !bluepayAmount}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Proceed
                          </Button>
                        </DialogFooter>
                      </>
                    )}

                    {/* External Transfer Form */}
                    {transferStep === "form" && transferType === "external" && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-xl text-center">Merchant Payout</DialogTitle>
                          <DialogDescription className="text-center text-gray-500">
                            Make payout by entering MoMo details below.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4">
                          <div className="mb-4">
                            <Label className="text-lg text-gray-700 mb-2 block">Who do you wish to send MoMo to?</Label>
                            <Select value="external" disabled>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="external">External merchant</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
                            {externalCustomers.map((customer, index) => (
                              <div key={customer.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-medium">Customer {index + 1}</h3>
                                  {externalCustomers.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeExternalCustomer(customer.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <IconTrash className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Name</Label>
                                    <Input
                                      value={customer.name}
                                      onChange={(e) => updateExternalCustomer(customer.id, "name", e.target.value)}
                                      placeholder="Customer name"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>Email</Label>
                                    <Input
                                      type="email"
                                      value={customer.email}
                                      onChange={(e) => updateExternalCustomer(customer.id, "email", e.target.value)}
                                      placeholder="Email address"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>Mobile Number</Label>
                                    <Input
                                      value={customer.mobile}
                                      onChange={(e) => updateExternalCustomer(customer.id, "mobile", e.target.value)}
                                      placeholder="+233 XX XXX XXXX"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>Amount</Label>
                                    <Input
                                      type="number"
                                      value={customer.amount}
                                      onChange={(e) => updateExternalCustomer(customer.id, "amount", e.target.value)}
                                      placeholder="0.00"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>Narration/Reference</Label>
                                    <Input
                                      value={customer.narration}
                                      onChange={(e) => updateExternalCustomer(customer.id, "narration", e.target.value)}
                                      placeholder="Payment reference"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>Receiver&apos;s Mobile Network</Label>
                                    <Select
                                      value={customer.network}
                                      onValueChange={(value) => updateExternalCustomer(customer.id, "network", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select network" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {mobileNetworks.map(network => (
                                          <SelectItem key={network.id} value={network.id}>
                                            {network.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between mt-6">
                            <Button
                              variant="outline"
                              onClick={addExternalCustomer}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <IconPlus className="h-4 w-4 mr-2" />
                              Add customer
                            </Button>
                            
                            <Button
                              onClick={proceedToExternalPreview}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Preview Transaction Details */}
                    {transferStep === "preview" && previewData && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-xl">Preview Transaction Details</DialogTitle>
                        </DialogHeader>
                        
                        <div className="py-6 space-y-4">
                          {previewData.type === "bluepay" ? (
                            <>
                              <div>
                                <h3 className="text-lg font-semibold">Merchant Name: {previewData.merchantName}</h3>
                              </div>
                              
                              <div>
                                <span className="text-lg font-semibold">Amount: </span>
                                <span className="text-lg font-semibold text-green-600">
                                  {previewData.amount} {previewData.currency}
                                </span>
                              </div>
                              
                              <div>
                                <span className="text-lg font-semibold">Service Charge: </span>
                                <span className="text-lg font-semibold text-red-500">
                                  {previewData.serviceCharge.toFixed(3)} {previewData.currency} (0.5%)
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">External Transfer Summary</h3>
                              {previewData.customers.map((customer: ExternalCustomer, index: number) => (
                                <div key={index} className="border rounded p-3 bg-gray-50">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><strong>Name:</strong> {customer.name}</div>
                                    <div><strong>Amount:</strong> {customer.amount} {previewData.currency}</div>
                                    <div><strong>Mobile:</strong> {customer.mobile}</div>
                                    <div><strong>Network:</strong> {customer.network.toUpperCase()}</div>
                                  </div>
                                </div>
                              ))}
                              <div className="pt-2 border-t">
                                <span className="text-lg font-semibold">Total Amount: </span>
                                <span className="text-lg font-semibold text-green-600">
                                  {previewData.customers.reduce((sum: number, c: ExternalCustomer) => sum + parseFloat(c.amount || "0"), 0).toFixed(2)} {previewData.currency}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setTransferStep("form")}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={proceedToOtp}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Proceed
                          </Button>
                        </DialogFooter>
                      </>
                    )}

                    {/* OTP Verification */}
                    {transferStep === "otp" && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-xl text-center">Enter OTP</DialogTitle>
                          <DialogDescription className="text-center text-gray-600">
                            An OTP has been sent to you registered mobile number. Please enter it below.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-8">
                          <div className="flex justify-center gap-3 mb-8">
                            {otpCode.map((digit, index) => (
                              <Input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                className="w-16 h-16 text-center text-xl font-semibold"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                              />
                            ))}
                          </div>
                          
                          <div className="flex justify-center">
                            <Button
                              onClick={verifyOtp}
                              disabled={otpCode.join("").length !== 4}
                              className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white py-3"
                            >
                              Verify Account
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common wallet operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Statement Download Dialog */}
              <Dialog open={statementOpen} onOpenChange={setStatementOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <IconReceipt className="h-4 w-4 mr-2" />
                    Download Statement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Download Statement</DialogTitle>
                    <DialogDescription>
                      Select a date range for your account statement
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${!startDate ? 'text-muted-foreground' : ''}`}
                          type="button"
                          onClick={() => {
                            const datePickerElement = document.getElementById('statement-start-date');
                            if (datePickerElement) {
                              datePickerElement.click();
                            }
                          }}
                        >
                          <IconCalendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : "Select start date"}
                        </Button>
                        <div className="hidden">
                          <Calendar
                            id="statement-start-date"
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>End Date</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${!endDate ? 'text-muted-foreground' : ''}`}
                          type="button"
                          onClick={() => {
                            const datePickerElement = document.getElementById('statement-end-date');
                            if (datePickerElement) {
                              datePickerElement.click();
                            }
                          }}
                        >
                          <IconCalendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, 'PPP') : "Select end date"}
                        </Button>
                        <div className="hidden">
                          <Calendar
                            id="statement-end-date"
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStatementOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={downloadStatement}
                      disabled={!startDate || !endDate}
                    >
                      Download
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="history" className="flex items-center">
            <IconHistory className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center">
            <IconAlertCircle className="h-4 w-4 mr-2" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="settlement" className="flex items-center">
            <IconBuildingBank className="h-4 w-4 mr-2" />
            Settlement
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Recent wallet transactions
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <IconDownload className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <IconDownload className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Wallet Funding</p>
                      <p className="text-sm text-muted-foreground">Yesterday, 14:30</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+GHS 5,000.00</p>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <IconSend className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Transfer to Bank</p>
                      <p className="text-sm text-muted-foreground">Oct 15, 2023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-GHS 2,500.00</p>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <Alert>
            <IconAlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have no pending transactions
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="settlement" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Bank Account</CardTitle>
                  <CardDescription>
                    Your settlement bank account information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <IconBuildingBank className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">First Bank</p>
                      <p className="text-sm text-muted-foreground">Primary Settlement Account</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">••••••••1234</p>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 