"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  IconBuilding, 
  IconUser, 
  IconCreditCard, 
  IconSettings, 
  IconBuildingBank,
  IconDeviceMobile,
  IconPhone,
  IconWallet,
  IconCoins
} from "@tabler/icons-react";
import { mockCharges } from "@/components/admin/charges/types";
import { useCurrency } from "@/lib/currency-context";

const formSchema = z.object({
  // Merchant Details
  merchantCode: z.string().min(1, { message: "Merchant code is required" }),
  merchantName: z.string().min(3, { message: "Merchant name is required" }),
  merchantAddress: z.string().min(5, { message: "Address is required" }),
  notificationEmail: z.string().email({ message: "Valid email is required" }),
  country: z.string({ required_error: "Country is required" }),
  tinNumber: z.string().optional(),
  settlementFrequency: z.string({ required_error: "Settlement frequency is required" }),
  surchargeOn: z.string({ required_error: "Surcharge setting is required" }),
  partnerBank: z.string({ required_error: "Partner bank is required" }),
  bdm: z.string().optional(),
  terminalId: z.string().optional(),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  organizationType: z.string({ required_error: "Organization type is required" }),
  merchantCategory: z.string({ required_error: "Merchant category is required" }),
  
  // Charge Configuration Type
  chargeConfigType: z.string({ required_error: "Charge configuration type is required" }),
  
  // Custom Surcharge Details (only required if custom is selected)
  totalSurcharge: z.string().optional(),
  merchantSurcharge: z.string().optional(),
  customerSurcharge: z.string().optional(),
  noSurchargeCap: z.boolean().default(false),
  
  // OVA Settings
  mtn: z.string().optional(),
  airtel: z.string().optional(),
  telecel: z.string().optional(),
  
  // User Details
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  
  // Settlement Details
  settlementType: z.string({ required_error: "Settlement type is required" }),
  // Bank Settlement fields
  merchantBank: z.string().optional(),
  branch: z.string().optional(),
  accountType: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  // MOMO Settlement fields
  momoProvider: z.string().optional(),
  momoNumber: z.string().optional(),
  momoAccountName: z.string().optional(),
}).refine(
  (data) => {
    if (data.settlementType === "bank") {
      return !!data.merchantBank && !!data.branch && !!data.accountType && !!data.accountNumber && !!data.accountName;
    }
    if (data.settlementType === "momo") {
      return !!data.momoProvider && !!data.momoNumber && !!data.momoAccountName;
    }
    return true;
  },
  {
    message: "Settlement details are required based on selected settlement type",
    path: ["settlementType"],
  }
).refine(
  (data) => {
    if (data.chargeConfigType === "custom") {
      return !!data.totalSurcharge && !!data.merchantSurcharge && !!data.customerSurcharge;
    }
    return true;
  },
  {
    message: "Custom charge details are required when custom configuration is selected",
    path: ["totalSurcharge"],
  }
);

export function CreateMerchant() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settlementType, setSettlementType] = useState<string>("");
  const [chargeConfigType, setChargeConfigType] = useState<string>("");
  const { currency } = useCurrency();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      merchantCode: "",
      merchantName: "",
      merchantAddress: "",
      notificationEmail: "",
      country: "",
      tinNumber: "",
      settlementFrequency: "",
      surchargeOn: "",
      partnerBank: "",
      bdm: "",
      terminalId: "",
      phoneNumber: "",
      organizationType: "",
      merchantCategory: "",
      chargeConfigType: "",
      totalSurcharge: "1.5",
      merchantSurcharge: "0",
      customerSurcharge: "0",
      noSurchargeCap: false,
      mtn: "",
      airtel: "",
      telecel: "",
      firstName: "",
      lastName: "",
      email: "",
      settlementType: "",
      merchantBank: "",
      branch: "",
      accountType: "",
      accountNumber: "",
      accountName: "",
      momoProvider: "",
      momoNumber: "",
      momoAccountName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // If default charges are selected, include the default charges in the submission
    const submissionData = {
      ...values,
      ...(values.chargeConfigType === "default" && {
        defaultCharges: mockCharges
      })
    };
    
    // Simulate API call
    setTimeout(() => {
      console.log(submissionData);
      toast.success("Merchant created successfully");
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconBuilding className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create New Merchant</h1>
              <p className="text-muted-foreground">Set up a new BluPay merchant account with complete configuration</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline" className="text-xs">
              <IconBuilding className="h-3 w-3 mr-1" />
              Merchant Setup
            </Badge>
            <Badge variant="outline" className="text-xs">
              <IconUser className="h-3 w-3 mr-1" />
              User Account
            </Badge>
            <Badge variant="outline" className="text-xs">
              <IconCreditCard className="h-3 w-3 mr-1" />
              Payment Config
            </Badge>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Business Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconBuilding className="h-5 w-5" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="merchantCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Merchant Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter merchant code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="merchantName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter business name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="merchantAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Business Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter complete business address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="organizationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Organization Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select organization type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="individual">Individual</SelectItem>
                                <SelectItem value="ngo">NGO</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="merchantCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Business Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select business category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="food">Food & Beverage</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ghana">Ghana</SelectItem>
                                <SelectItem value="nigeria">Nigeria</SelectItem>
                                <SelectItem value="kenya">Kenya</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tinNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">TIN Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Tax identification number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Business phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Admin User Setup */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUser className="h-5 w-5" />
                      Admin User Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Admin first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Admin last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notificationEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Notification Email</FormLabel>
                          <FormControl>
                            <Input placeholder="notifications@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Settlement Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconCreditCard className="h-5 w-5" />
                      Settlement Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="settlementFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Settlement Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="partnerBank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Partner Bank</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select partner bank" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gcb">GCB Bank</SelectItem>
                                <SelectItem value="ecobank">Ecobank</SelectItem>
                                <SelectItem value="absa">Absa Bank</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="settlementType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Settlement Method</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            setSettlementType(value);
                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select settlement method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bank">
                                <div className="flex items-center gap-2">
                                  <IconBuildingBank className="h-4 w-4" />
                                  Bank Transfer
                                </div>
                              </SelectItem>
                              <SelectItem value="momo">
                                <div className="flex items-center gap-2">
                                  <IconDeviceMobile className="h-4 w-4" />
                                  Mobile Money
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bank Settlement Details */}
                    {settlementType === "bank" && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <IconBuildingBank className="h-4 w-4" />
                          Bank Account Details
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="merchantBank"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Bank Name</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select bank" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="gcb">GCB Bank</SelectItem>
                                    <SelectItem value="ecobank">Ecobank</SelectItem>
                                    <SelectItem value="absa">Absa Bank</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="branch"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Branch</FormLabel>
                                <FormControl>
                                  <Input placeholder="Bank branch" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="accountType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Account Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="current">Current</SelectItem>
                                    <SelectItem value="savings">Savings</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Account Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Account number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="accountName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Account Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Account holder name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* MOMO Settlement Details */}
                    {settlementType === "momo" && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <IconDeviceMobile className="h-4 w-4" />
                          Mobile Money Details
                        </h4>
                        <div className="grid gap-4 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="momoProvider"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Provider</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="mtn">MTN MoMo</SelectItem>
                                    <SelectItem value="airtel">AirtelTigo Money</SelectItem>
                                    <SelectItem value="telecel">Telecel Cash</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="momoNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Mobile Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="0244123456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="momoAccountName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Account Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Account holder name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Configuration */}
              <div className="space-y-6">
                
                {/* Charges Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconSettings className="h-5 w-5" />
                      Charges Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Charge Configuration Type Selection */}
                    <FormField
                      control={form.control}
                      name="chargeConfigType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Charge Configuration</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            setChargeConfigType(value);
                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select configuration type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="default">
                                <div className="flex items-center gap-2">
                                  <IconSettings className="h-4 w-4" />
                                  Use Default Charges
                                </div>
                              </SelectItem>
                              <SelectItem value="custom">
                                <div className="flex items-center gap-2">
                                  <IconWallet className="h-4 w-4" />
                                  Custom Charges
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Default Charges Display */}
                    {chargeConfigType === "default" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <IconSettings className="h-4 w-4" />
                            Applied Default Charges
                          </h4>
                          <div className="space-y-3 text-sm">
                            {Object.entries(mockCharges).map(([key, charge]) => (
                              <div key={key} className="flex justify-between items-center p-2 bg-background rounded border">
                                <div className="flex items-center gap-2">
                                  {key.includes('wallet') && <IconWallet className="h-4 w-4" />}
                                  {key.includes('momo') && <IconDeviceMobile className="h-4 w-4" />}
                                  {key.includes('bank') && <IconBuildingBank className="h-4 w-4" />}
                                  {key.includes('Collection') && <IconCoins className="h-4 w-4" />}
                                  <span className="font-medium capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">
                                    {charge.chargeType === "fixed" 
                                      ? `${currency}${charge.amount.toFixed(2)}` 
                                      : `${charge.percentage}%`}
                                  </div>
                                  {charge.chargeType === "percentage" && (
                                    <div className="text-xs text-muted-foreground">
                                      Cap: {currency}{charge.cap.toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="surchargeOn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Surcharge Applied To</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="merchant">Merchant</SelectItem>
                                  <SelectItem value="customer">Customer</SelectItem>
                                  <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Custom Charges Form */}
                    {chargeConfigType === "custom" && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="surchargeOn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Surcharge Applied To</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="merchant">Merchant</SelectItem>
                                  <SelectItem value="customer">Customer</SelectItem>
                                  <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-3">
                          <FormField
                            control={form.control}
                            name="totalSurcharge"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Total Surcharge (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.1" placeholder="1.5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="merchantSurcharge"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Merchant Surcharge (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.1" placeholder="0.0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="customerSurcharge"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Customer Surcharge (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.1" placeholder="0.0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="noSurchargeCap"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 bg-muted/50 rounded-lg">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium">No Surcharge Cap</FormLabel>
                                <p className="text-xs text-muted-foreground">Remove maximum surcharge limits</p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* OVA Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconPhone className="h-5 w-5" />
                      OVA Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="mtn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">MTN OVA</FormLabel>
                          <FormControl>
                            <Input placeholder="MTN virtual account" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="airtel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">AirtelTigo OVA</FormLabel>
                          <FormControl>
                            <Input placeholder="AirtelTigo virtual account" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="telecel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Telecel OVA</FormLabel>
                          <FormControl>
                            <Input placeholder="Telecel virtual account" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Additional Settings */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Additional Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bdm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Business Development Manager</FormLabel>
                          <FormControl>
                            <Input placeholder="Assigned BDM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="terminalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Terminal ID</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select terminal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="term1">Terminal 1</SelectItem>
                              <SelectItem value="term2">Terminal 2</SelectItem>
                              <SelectItem value="term3">Terminal 3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Please review all information before creating the merchant account. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={isSubmitting} 
                  onClick={() => form.reset()}
                  className="min-w-[100px]"
                >
                  Reset Form
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting ? "Creating..." : "Create Merchant"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 