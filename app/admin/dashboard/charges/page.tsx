"use client"

import { useState } from "react"
import { IconWallet, IconDeviceMobile, IconBuildingBank, IconSettings, IconDeviceFloppy, IconX } from "@tabler/icons-react"
import { useCurrency } from "@/lib/currency-context"
import { useErrorHandler } from "@/hooks/use-error-handler"
import ErrorBoundary, { PageErrorFallback } from "@/components/error-boundary"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [editingMaxCollectionType, setEditingMaxCollectionType] = useState<string | null>(null)
  const [maxCollectionCapData, setMaxCollectionCapData] = useState({
    momoCollection: {
      mtn: "100.00",
      telecel: "95.00",
      airtelTigo: "90.00"
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

  const handleMaxCollectionEdit = (chargeType: string) => {
    setEditingMaxCollectionType(chargeType)
  }

  const handleMaxCollectionCancel = () => {
    setEditingMaxCollectionType(null)
  }

  const handleMaxCollectionSave = (chargeType: string) => {
    try {
      setEditingMaxCollectionType(null)
      showSuccess("UPDATE", "default", `${chargeType} MAX COLLECTION CAP updated successfully`)
    } catch (error) {
      showError(error)
    }
  }

  const updateMaxCollectionCap = (telco: 'mtn' | 'telecel' | 'airtelTigo', value: string) => {
    setMaxCollectionCapData(prev => ({
      ...prev,
      momoCollection: {
        ...prev.momoCollection,
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
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

        {/* MAX COLLECTION Charge CAP Management Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">MAX COLLECTION Charge CAP Management</h2>
            <p className="text-muted-foreground">Configure maximum collection charge caps for different payment providers</p>
          </div>

          <div className="flex justify-center">
            {/* MOMO Collection MAX CHARGE CAP */}
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconDeviceMobile className="h-5 w-5" />
                  MOMO Collection MAX CHARGE CAP
                </CardTitle>
                <CardDescription>
                  Set maximum charge limits for MOMO collection transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingMaxCollectionType !== "momoCollection" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center p-3 bg-yellow-500 text-white rounded-lg">
                          <span className="font-semibold">MTN</span>
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-lg">{currency}{maxCollectionCapData.momoCollection.mtn}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center p-3 bg-red-500 text-white rounded-lg">
                          <span className="font-semibold">TELECEL</span>
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-lg">{currency}{maxCollectionCapData.momoCollection.telecel}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg">
                          <span className="font-semibold">AIRTELTIGO</span>
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-lg">{currency}{maxCollectionCapData.momoCollection.airtelTigo}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handleMaxCollectionEdit("momoCollection")} className="w-full">
                      <IconSettings className="h-4 w-4 mr-2" />
                      Edit MAX COLLECTION CAP
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="momo-collection-mtn-cap">MTN Max Collection Charge ({currency})</Label>
                        <Input
                          id="momo-collection-mtn-cap"
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxCollectionCapData.momoCollection.mtn}
                          onChange={(e) => updateMaxCollectionCap('mtn', e.target.value)}
                          placeholder="MTN maximum collection charge"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="momo-collection-telecel-cap">TELECEL Max Collection Charge ({currency})</Label>
                        <Input
                          id="momo-collection-telecel-cap"
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxCollectionCapData.momoCollection.telecel}
                          onChange={(e) => updateMaxCollectionCap('telecel', e.target.value)}
                          placeholder="TELECEL maximum collection charge"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="momo-collection-airteltigo-cap">AIRTELTIGO Max Collection Charge ({currency})</Label>
                        <Input
                          id="momo-collection-airteltigo-cap"
                          type="number"
                          step="0.01"
                          min="0"
                          value={maxCollectionCapData.momoCollection.airtelTigo}
                          onChange={(e) => updateMaxCollectionCap('airtelTigo', e.target.value)}
                          placeholder="AIRTELTIGO maximum collection charge"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleMaxCollectionCancel}>
                        <IconX className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={() => handleMaxCollectionSave("momoCollection")}>
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