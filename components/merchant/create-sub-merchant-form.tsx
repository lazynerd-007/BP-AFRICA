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
import { Badge } from "@/components/ui/badge";
import { 
  IconBuilding, 
  IconUser, 
  IconCreditCard, 
  IconSettings, 
  IconBuildingBank,
  IconPhone
} from "@tabler/icons-react";

// Mock parent merchants data
const parentMerchants = [
  { id: "bluwave", name: "BluWave Limited" },
  { id: "blupenguin", name: "Blu Penguin" },
  { id: "skynet", name: "SkyNet Ghana" },
  { id: "smartpay", name: "SmartPay Solutions" },
];

const formSchema = z.object({
  // Parent Merchant
  parentMerchant: z.string({ required_error: "Parent merchant is required" }),
  
  // Sub-Merchant Details
  merchantCode: z.string().min(1, { message: "Merchant code is required" }),
  merchantName: z.string().min(3, { message: "Merchant name is required" }),
  merchantAddress: z.string().min(5, { message: "Address is required" }),
  notificationEmail: z.string().email({ message: "Valid email is required" }),
  tinNumber: z.string().optional(),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  
  // Surcharge Details
  inheritSurcharge: z.boolean().default(true),
  
  // Settlement Account
  useParentSettlement: z.boolean().default(true),
  merchantBank: z.string().optional(),
  branch: z.string().optional(),
  accountType: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  
  // OVA Settings
  mtn: z.string().optional(),
  airtel: z.string().optional(),
  telecel: z.string().optional(),
  
  // User Details
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  

}).refine(
  (data) => {
    if (!data.useParentSettlement) {
      return !!data.merchantBank && !!data.accountNumber && !!data.accountName;
    }
    return true;
  },
  {
    message: "Settlement account details are required when not using parent settlement",
    path: ["merchantBank"],
  }
);

export function CreateSubMerchant() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useParentSettlement, setUseParentSettlement] = useState(true);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      parentMerchant: "",
      merchantCode: "",
      merchantName: "",
      merchantAddress: "",
      notificationEmail: "",
      tinNumber: "",
      phoneNumber: "",
      inheritSurcharge: true,
      useParentSettlement: true,
      merchantBank: "",
      branch: "",
      accountType: "",
      accountNumber: "",
      accountName: "",
      mtn: "",
      airtel: "",
      telecel: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      toast.success("Sub-merchant created successfully");
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full">
              <IconBuilding className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create Sub-Merchant</h1>
              <p className="text-muted-foreground mt-1">
                Add a new sub-merchant to an existing parent merchant account
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">Step 1 of 1</Badge>
              <Badge variant="secondary">Sub-merchant Setup</Badge>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left Column - Main Details */}
              <div className="space-y-6">
                
                {/* Parent Merchant Selection */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconBuilding className="h-5 w-5" />
                      Parent Merchant Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="parentMerchant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Select Parent Merchant</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a parent merchant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {parentMerchants.map((merchant) => (
                                <SelectItem key={merchant.id} value={merchant.id}>
                                  {merchant.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Sub-Merchant Details */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUser className="h-5 w-5" />
                      Sub-Merchant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                            <FormLabel className="text-sm font-medium">Merchant Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter merchant name" {...field} />
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
                          <FormLabel className="text-sm font-medium">Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-4 md:grid-cols-2">
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
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="0244123456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="tinNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">TIN Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter TIN number" {...field} />
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
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="useParentSettlement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 bg-muted/50 rounded-lg">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                setUseParentSettlement(!!checked);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">Use Parent Settlement Account</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Funds will be settled to the parent merchant&apos;s account
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {!useParentSettlement && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <IconBuildingBank className="h-4 w-4" />
                          Custom Settlement Account
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="merchantBank"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">Bank</FormLabel>
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
                                    <SelectItem value="savings">Savings</SelectItem>
                                    <SelectItem value="current">Current</SelectItem>
                                    <SelectItem value="corporate">Corporate</SelectItem>
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
                  </CardContent>
                </Card>

                {/* OVA Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconPhone className="h-5 w-5" />
                      OVA Configuration
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Select OVA accounts for mobile money providers
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="mtn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">MTN OVA</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mtn_ova_001">EGANOW</SelectItem>
                                <SelectItem value="mtn_ova_002">BLUPAY</SelectItem>
                              </SelectContent>
                            </Select>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="airtel_ova_001">AIRTEL BLUPAY</SelectItem>
                              </SelectContent>
                            </Select>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="telecel_ova_001">BLUPAY3</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Configuration */}
              <div className="space-y-6">
                
                {/* Surcharge Configuration */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconSettings className="h-5 w-5" />
                      Surcharge Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="inheritSurcharge"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 bg-muted/50 rounded-lg">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">Inherit Parent Surcharge</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Use the same surcharge configuration as parent merchant
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    

                  </CardContent>
                </Card>

                {/* Admin User Setup */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUser className="h-5 w-5" />
                      Admin User Setup
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Configure the primary admin user for this sub-merchant
                    </p>
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
                              <Input placeholder="Enter first name" {...field} />
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
                              <Input placeholder="Enter last name" {...field} />
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
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Reset Form
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                {isSubmitting ? (
                  <>
                    <IconSettings className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Sub-Merchant"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
} 