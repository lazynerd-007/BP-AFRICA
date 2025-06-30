"use client"

import { useState } from "react"
import { IconDeviceMobile, IconBuildingBank, IconSettings, IconDeviceFloppy, IconX } from "@tabler/icons-react"
import { useCurrency } from "@/lib/currency-context"
import { useErrorHandler } from "@/hooks/use-error-handler"
import ErrorBoundary, { PageErrorFallback } from "@/components/error-boundary"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ChargeStatsCards,
  ChargeCard,
  ChargesData,
  ChargeFormData,
  mockCharges
} from "@/components/admin/charges"

export default function ChargesPage() {
  const { currency } = useCurrency()
  const { showSuccess, showError } = useErrorHandler()
  const [editingCharge, setEditingCharge] = useState<string | null>(null)
  const [charges, setCharges] = useState<ChargesData>(mockCharges)
  const [editingMaxChargeType, setEditingMaxChargeType] = useState<string | null>(null)
  const [maxChargeCapData, setMaxChargeCapData] = useState({
    momoPayout: {
      mtn: "50.00",
      telecel: "45.00",
      airtelTigo: "40.00"
    },
    bankPayout: {
      mtn: "60.00",
      telecel: "55.00",
      airtelTigo: "50.00"
    }
  })

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

  const handleMaxChargeEdit = (chargeType: string) => {
    setEditingMaxChargeType(chargeType)
  }

  const handleMaxChargeCancel = () => {
    setEditingMaxChargeType(null)
  }

  const handleMaxChargeSave = (chargeType: string) => {
    try {
      setEditingMaxChargeType(null)
      showSuccess("UPDATE", "default", `${chargeType} MAX CHARGE CAP updated successfully`)
    } catch (error) {
      showError(error)
    }
  }

  const updateMaxChargeCap = (chargeType: 'momoPayout' | 'bankPayout', telco: 'mtn' | 'telecel' | 'airtelTigo', value: string) => {
    setMaxChargeCapData(prev => ({
      ...prev,
      [chargeType]: {
        ...prev[chargeType],
        [telco]: value
      }
    }))
  }

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
        <ChargeStatsCards charges={charges} currency={currency} />

        {/* Charge Configuration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MOMO Payout Charges */}
          <ChargeCard
            title="MOMO Payout Charges"
            icon={<IconDeviceMobile className="h-5 w-5" />}
            charge={charges.momoPayout}
            chargeType="momoPayout"
            isEditing={editingCharge === "momoPayout"}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
            currency={currency}
          />

          {/* Bank Payout Charges */}
          <ChargeCard
            title="Bank Payout Charges"
            icon={<IconBuildingBank className="h-5 w-5" />}
            charge={charges.bankPayout}
            chargeType="bankPayout"
            isEditing={editingCharge === "bankPayout"}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
            currency={currency}
          />
        </div>

        {/* MAX CHARGE CAP Management Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">MAX CHARGE CAP Management</h2>
            <p className="text-muted-foreground">Configure maximum charge caps for different payment providers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MOMO Payout MAX CHARGE CAP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconDeviceMobile className="h-5 w-5" />
                  MOMO Payout MAX CHARGE CAP
                </CardTitle>
                <CardDescription>
                  Set maximum charge limits for MOMO payout transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingMaxChargeType !== "momoPayout" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">MTN</Label>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500 text-white">MTN</Badge>
                          <span className="font-medium">{currency}{maxChargeCapData.momoPayout.mtn}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">TELECEL</Label>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-500 text-white">TELECEL</Badge>
                          <span className="font-medium">{currency}{maxChargeCapData.momoPayout.telecel}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">AIRTELTIGO</Label>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500 text-white">AIRTELTIGO</Badge>
                          <span className="font-medium">{currency}{maxChargeCapData.momoPayout.airtelTigo}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handleMaxChargeEdit("momoPayout")} className="w-full">
                      <IconSettings className="h-4 w-4 mr-2" />
                      Edit MAX CHARGE CAP
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="momo-mtn-cap">MTN Max Charge ({currency})</Label>
                        <Input
                          id="momo-mtn-cap"
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxChargeCapData.momoPayout.mtn}
                          onChange={(e) => updateMaxChargeCap('momoPayout', 'mtn', e.target.value)}
                          placeholder="MTN maximum charge"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="momo-telecel-cap">TELECEL Max Charge ({currency})</Label>
                        <Input
                          id="momo-telecel-cap"
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxChargeCapData.momoPayout.telecel}
                          onChange={(e) => updateMaxChargeCap('momoPayout', 'telecel', e.target.value)}
                          placeholder="TELECEL maximum charge"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="momo-airteltigo-cap">AIRTELTIGO Max Charge ({currency})</Label>
                        <Input
                          id="momo-airteltigo-cap"
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxChargeCapData.momoPayout.airtelTigo}
                          onChange={(e) => updateMaxChargeCap('momoPayout', 'airtelTigo', e.target.value)}
                          placeholder="AIRTELTIGO maximum charge"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleMaxChargeCancel}>
                        <IconX className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={() => handleMaxChargeSave("momoPayout")}>
                        <IconDeviceFloppy className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bank Payout MAX CHARGE CAP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconBuildingBank className="h-5 w-5" />
                  Bank Payout MAX CHARGE CAP
                </CardTitle>
                <CardDescription>
                  Set maximum charge limits for bank payout transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingMaxChargeType !== "bankPayout" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">MTN</Label>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500 text-white">MTN</Badge>
                          <span className="font-medium">{currency}{maxChargeCapData.bankPayout.mtn}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">TELECEL</Label>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-500 text-white">TELECEL</Badge>
                          <span className="font-medium">{currency}{maxChargeCapData.bankPayout.telecel}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">AIRTELTIGO</Label>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500 text-white">AIRTELTIGO</Badge>
                          <span className="font-medium">{currency}{maxChargeCapData.bankPayout.airtelTigo}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handleMaxChargeEdit("bankPayout")} className="w-full">
                      <IconSettings className="h-4 w-4 mr-2" />
                      Edit MAX CHARGE CAP
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank-mtn-cap">MTN Max Charge ({currency})</Label>
                        <Input
                          id="bank-mtn-cap"
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxChargeCapData.bankPayout.mtn}
                          onChange={(e) => updateMaxChargeCap('bankPayout', 'mtn', e.target.value)}
                          placeholder="MTN maximum charge"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank-telecel-cap">TELECEL Max Charge ({currency})</Label>
                        <Input
                          id="bank-telecel-cap"
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxChargeCapData.bankPayout.telecel}
                          onChange={(e) => updateMaxChargeCap('bankPayout', 'telecel', e.target.value)}
                          placeholder="TELECEL maximum charge"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank-airteltigo-cap">AIRTELTIGO Max Charge ({currency})</Label>
                        <Input
                          id="bank-airteltigo-cap"
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxChargeCapData.bankPayout.airtelTigo}
                          onChange={(e) => updateMaxChargeCap('bankPayout', 'airtelTigo', e.target.value)}
                          placeholder="AIRTELTIGO maximum charge"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleMaxChargeCancel}>
                        <IconX className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={() => handleMaxChargeSave("bankPayout")}>
                        <IconDeviceFloppy className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}