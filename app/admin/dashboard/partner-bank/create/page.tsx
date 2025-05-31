"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { toast } from "sonner"

export default function CreatePartnerBank() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<{
    bankName: string;
    emailAddress: string;
    settlementFile: File | null;
    commissionBankName: string;
    commissionAccountName: string;
    commissionAccountNumber: string;
    commissionRatio: string;
    settlementBankName: string;
    settlementAccountName: string;
    settlementAccountNumber: string;
  }>({
    // Partner Bank Details
    bankName: "",
    emailAddress: "",
    settlementFile: null,
    
    // Commission Bank Details
    commissionBankName: "",
    commissionAccountName: "",
    commissionAccountNumber: "",
    commissionRatio: "",
    
    // Settlement Bank Details
    settlementBankName: "",
    settlementAccountName: "",
    settlementAccountNumber: "",
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, settlementFile: e.target.files![0] }))
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Partner Bank created successfully!")
      resetForm()
      setIsSubmitting(false)
    }, 1500)
  }
  
  const resetForm = () => {
    setFormData({
      bankName: "",
      emailAddress: "",
      settlementFile: null,
      commissionBankName: "",
      commissionAccountName: "",
      commissionAccountNumber: "",
      commissionRatio: "",
      settlementBankName: "",
      settlementAccountName: "",
      settlementAccountNumber: "",
    })
    
    // Reset file input
    const fileInput = document.getElementById("settlementFile") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }
  
  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl font-semibold">Create New Partner Bank</CardTitle>
        <p className="text-sm text-muted-foreground">
          Setup new parent bank with the appropriate information.
        </p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          {/* Partner Bank Details Section */}
          <h3 className="text-lg font-medium mb-4">Partner Bank Details</h3>
          <Separator className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="bankName">Partner Bank Name</Label>
              <Input 
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input 
                id="emailAddress"
                name="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="settlementFile">Settlement File</Label>
              <Input 
                id="settlementFile"
                name="settlementFile"
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
          </div>
          
          {/* Commission Bank Details Section */}
          <h3 className="text-lg font-medium mb-4">Commission Bank Details</h3>
          <Separator className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="commissionBankName">Bank Name</Label>
              <Input 
                id="commissionBankName"
                name="commissionBankName"
                value={formData.commissionBankName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commissionAccountName">Account Name</Label>
              <Input 
                id="commissionAccountName"
                name="commissionAccountName"
                value={formData.commissionAccountName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commissionAccountNumber">Account Number</Label>
              <Input 
                id="commissionAccountNumber"
                name="commissionAccountNumber"
                value={formData.commissionAccountNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commissionRatio">Commission Ratio</Label>
              <Input 
                id="commissionRatio"
                name="commissionRatio"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.commissionRatio}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Settlement Bank Details Section */}
          <h3 className="text-lg font-medium mb-4">Settlement Bank Details</h3>
          <Separator className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="settlementBankName">Bank Name</Label>
              <Input 
                id="settlementBankName"
                name="settlementBankName"
                value={formData.settlementBankName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="settlementAccountName">Account Name</Label>
              <Input 
                id="settlementAccountName"
                name="settlementAccountName"
                value={formData.settlementAccountName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="settlementAccountNumber">Account Number</Label>
              <Input 
                id="settlementAccountNumber"
                name="settlementAccountNumber"
                value={formData.settlementAccountNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={resetForm}
              className="sm:order-1 w-full sm:w-auto"
            >
              Reset
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Creating..." : "Create Partner Bank"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 