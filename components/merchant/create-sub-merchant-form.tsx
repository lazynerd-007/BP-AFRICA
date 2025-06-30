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
  totalSurcharge: z.string().optional(),
  merchantSurcharge: z.string().optional(),
  customerSurcharge: z.string().optional(),
  
  // Settlement Account
  useParentSettlement: z.boolean().default(true),
  merchantBank: z.string().optional(),
  branch: z.string().optional(),
  accountType: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  
  // User Details
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  

}).refine(
  (data) => {
    if (!data.inheritSurcharge) {
      return !!data.totalSurcharge && !!data.merchantSurcharge && !!data.customerSurcharge;
    }
    return true;
  },
  {
    message: "Surcharge details are required when not inheriting from parent",
    path: ["totalSurcharge"],
  }
).refine(
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
  const [inheritSurcharge, setInheritSurcharge] = useState(true);
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
      totalSurcharge: "",
      merchantSurcharge: "",
      customerSurcharge: "",
      useParentSettlement: true,
      merchantBank: "",
      branch: "",
      accountType: "",
      accountNumber: "",
      accountName: "",
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
    <div className="max-w-6xl mx-auto p-4">
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-semibold">Create New Sub-Merchant</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">Add a new sub-merchant to an existing parent merchant account.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Parent Merchant Selection */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">Parent Merchant Selection</h3>
                <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="parentMerchant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Parent Merchant</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
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
                </div>
              </div>
              
              <Separator />
              
              {/* Sub-Merchant Details Section */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">Sub-Merchant Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="merchantCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant code</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
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
                        <FormLabel>Merchant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="merchantAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant Address</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
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
                        <FormLabel>Notification Email</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tinNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TIN Number</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Surcharge Configuration */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">Surcharge Configuration</h3>
                
                <FormField
                  control={form.control}
                  name="inheritSurcharge"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setInheritSurcharge(!!checked);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Inherit surcharge configuration from parent merchant</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                {!inheritSurcharge && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="totalSurcharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Surcharge (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
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
                          <FormLabel>Merchant Surcharge (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
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
                          <FormLabel>Customer Surcharge (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Settlement Account */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">Settlement Account</h3>
                
                <FormField
                  control={form.control}
                  name="useParentSettlement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
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
                        <FormLabel>Use parent merchant settlement account</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                {!useParentSettlement && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="merchantBank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Merchant Bank</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gcb">Ghana Commercial Bank</SelectItem>
                              <SelectItem value="ecobank">Ecobank Ghana</SelectItem>
                              <SelectItem value="stanbic">Stanbic Bank Ghana</SelectItem>
                              <SelectItem value="absa">Absa Bank Ghana</SelectItem>
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
                          <FormLabel>Branch</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
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
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
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
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Sub-Merchant Admin User */}
              <div>
                <h3 className="text-base font-medium text-center mb-4 text-muted-foreground">Sub-Merchant Admin User</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              

              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[150px]"
                >
                  {isSubmitting ? "Creating..." : "Create Sub-Merchant"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 