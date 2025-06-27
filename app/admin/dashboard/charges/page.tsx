"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  IconWallet, 
  IconDeviceMobile, 
  IconBuildingBank, 
  IconEdit, 
  IconDeviceFloppy,
  IconX 
} from "@tabler/icons-react"
import { useState } from "react"
import { useCurrency } from "@/lib/currency-context"
import { useErrorHandler } from "@/hooks/use-error-handler"
import ErrorBoundary, { PageErrorFallback } from "@/components/error-boundary"

// Type definitions
interface ChargeData {
  amount: number
  percentage: number
  cap: number
  chargeType: "fixed" | "percentage"
  status: "Active" | "Inactive"
  lastUpdated: string
}

interface ChargeFormData {
  amount: number
  percentage: number
  cap: number
  chargeType: "fixed" | "percentage"
  status: "Active" | "Inactive"
}

interface ChargeCardProps {
  title: string
  icon: React.ReactNode
  charge: ChargeData
  chargeType: string
  isEditing: boolean
  onEdit: (chargeType: string) => void
  onCancel: () => void
  onSave: (chargeType: string, formData: ChargeFormData) => void
  currency: string
}

// Mock data for current active charges (only one per settlement type)
const mockCharges: {
  walletToWallet: ChargeData
  momoSettlement: ChargeData
  bankSettlement: ChargeData
} = {
  walletToWallet: {
    amount: 2.00,
    percentage: 1.0,
    cap: 10.00,
    chargeType: "fixed", // "fixed" or "percentage"
    status: "Active",
    lastUpdated: "2024-01-15"
  },
  momoSettlement: {
    amount: 5.00,
    percentage: 0.8,
    cap: 15.00,
    chargeType: "percentage",
    status: "Active",
    lastUpdated: "2024-01-12"
  },
  bankSettlement: {
    amount: 10.00,
    percentage: 1.5,
    cap: 20.00,
    chargeType: "percentage",
    status: "Active",
    lastUpdated: "2024-01-10"
  }
}

export default function ChargesPage() {
  const { currency } = useCurrency()
  const { showSuccess, showError } = useErrorHandler()
  const [editingCharge, setEditingCharge] = useState<string | null>(null)
  const [charges, setCharges] = useState(mockCharges)

  const handleEdit = (chargeType: string) => {
    setEditingCharge(chargeType)
  }

  const handleCancel = () => {
    setEditingCharge(null)
  }

  const handleSave = (chargeType: string, formData: ChargeFormData) => {
    try {
      setCharges(prev => ({
        ...prev,
        [chargeType]: {
          ...prev[chargeType as keyof typeof prev],
          ...formData,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      }))
      setEditingCharge(null)
      showSuccess("UPDATE", "default", `${chargeType} charge updated successfully`)
    } catch (error) {
      showError(error)
    }
  }

  const formatAmount = (amount: number) => `${currency}${amount.toFixed(2)}`

  return (
    <ErrorBoundary fallback={PageErrorFallback}>
      <div className="px-4 lg:px-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Charges Management</h1>
          <p className="text-muted-foreground">Configure transaction charges and fees for each settlement type</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet to Wallet</CardTitle>
            <IconWallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {charges.walletToWallet.chargeType === "fixed" ? formatAmount(charges.walletToWallet.amount) : 
               `${charges.walletToWallet.percentage}% (Cap: ${formatAmount(charges.walletToWallet.cap)})`}
            </div>
            <p className="text-xs text-muted-foreground">Current charge</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MOMO Settlement</CardTitle>
            <IconDeviceMobile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {charges.momoSettlement.chargeType === "fixed" ? formatAmount(charges.momoSettlement.amount) : 
               `${charges.momoSettlement.percentage}% (Cap: ${formatAmount(charges.momoSettlement.cap)})`}
            </div>
            <p className="text-xs text-muted-foreground">Current charge</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Settlement</CardTitle>
            <IconBuildingBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {charges.bankSettlement.chargeType === "fixed" ? formatAmount(charges.bankSettlement.amount) : 
               `${charges.bankSettlement.percentage}% (Cap: ${formatAmount(charges.bankSettlement.cap)})`}
            </div>
            <p className="text-xs text-muted-foreground">Current charge</p>
          </CardContent>
        </Card>
      </div>

      {/* Charge Configuration Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Wallet to Wallet Charges */}
        <ChargeCard
          title="Wallet to Wallet Charges"
          icon={<IconWallet className="h-5 w-5" />}
          charge={charges.walletToWallet}
          chargeType="walletToWallet"
          isEditing={editingCharge === "walletToWallet"}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          currency={currency}
        />

        {/* MOMO Settlement Charges */}
        <ChargeCard
          title="MOMO Settlement Charges"
          icon={<IconDeviceMobile className="h-5 w-5" />}
          charge={charges.momoSettlement}
          chargeType="momoSettlement"
          isEditing={editingCharge === "momoSettlement"}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          currency={currency}
        />

        {/* Bank Settlement Charges */}
        <ChargeCard
          title="Bank Settlement Charges"
          icon={<IconBuildingBank className="h-5 w-5" />}
          charge={charges.bankSettlement}
          chargeType="bankSettlement"
          isEditing={editingCharge === "bankSettlement"}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          currency={currency}
        />
      </div>
    </div>
    </ErrorBoundary>
  )
}

// Charge Card Component
function ChargeCard({ 
  title, 
  icon, 
  charge, 
  chargeType, 
  isEditing, 
  onEdit, 
  onCancel, 
  onSave, 
  currency 
}: ChargeCardProps) {
  const [formData, setFormData] = useState({
    amount: charge.amount.toString(),
    percentage: charge.percentage.toString(),
    cap: charge.cap.toString(),
    chargeType: charge.chargeType,
    status: charge.status
  })

  const handleSubmit = () => {
    onSave(chargeType, {
      amount: parseFloat(formData.amount),
      percentage: parseFloat(formData.percentage),
      cap: parseFloat(formData.cap),
      chargeType: formData.chargeType,
      status: formData.status
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {!isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(chargeType)}
            >
              <IconEdit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  {charge.chargeType === "fixed" ? "Fixed Amount" : "Percentage"}
                </Label>
                <p className="text-lg font-semibold">
                  {charge.chargeType === "fixed" ? `${currency}${charge.amount.toFixed(2)}` : `${charge.percentage}%`}
                </p>
              </div>
              {charge.chargeType === "percentage" && (
                <div>
                  <Label className="text-sm text-muted-foreground">Cap Amount</Label>
                  <p className="text-lg font-semibold">{currency}{charge.cap.toFixed(2)}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Charge Type</Label>
                <p className="text-sm font-medium capitalize">{charge.chargeType}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={charge.status === "Active" ? "default" : "secondary"}>
                    {charge.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground">Last Updated</Label>
              <p className="text-sm">{charge.lastUpdated}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${chargeType}-chargeType`}>Charge Type</Label>
              <Select 
                value={formData.chargeType} 
                onValueChange={(value) => setFormData({...formData, chargeType: value as "fixed" | "percentage"})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount Only</SelectItem>
                  <SelectItem value="percentage">Percentage Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.chargeType === "fixed" && (
              <div className="space-y-2">
                <Label htmlFor={`${chargeType}-amount`}>Fixed Amount ({currency})</Label>
                <Input
                  id={`${chargeType}-amount`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            )}
            
            {formData.chargeType === "percentage" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor={`${chargeType}-percentage`}>Percentage (%)</Label>
                  <Input
                    id={`${chargeType}-percentage`}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => setFormData({...formData, percentage: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${chargeType}-cap`}>Cap Amount ({currency})</Label>
                  <Input
                    id={`${chargeType}-cap`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cap}
                    onChange={(e) => setFormData({...formData, cap: e.target.value})}
                    placeholder="Maximum charge amount"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor={`${chargeType}-status`}>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value as "Active" | "Inactive"})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onCancel}>
                <IconX className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <IconDeviceFloppy className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}