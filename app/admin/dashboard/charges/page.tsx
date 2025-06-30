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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
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
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">MAX COLLECTION Charge CAP Management</h2>
            <p className="text-muted-foreground">Configure maximum collection charge caps for different payment providers</p>
          </div>

          {/* MOMO Collection MAX CHARGE CAP - Redesigned */}
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center justify-center gap-3 text-lg">
                  <IconDeviceMobile className="h-6 w-6" />
                  MOMO Collection MAX CHARGE CAP
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Set maximum charge limits for MOMO collection transactions across all networks
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {editingMaxCollectionType !== "momoCollection" ? (
                  <div className="space-y-6">
                    {/* Provider Cards with improved design */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="group">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-xl p-4 text-center shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                          <div className="flex items-center justify-center mb-2">
                            <div className="bg-white/20 rounded-full p-2">
                              <IconDeviceMobile className="h-6 w-6" />
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-1">MTN</h3>
                          <p className="text-sm opacity-90">Mobile Money</p>
                        </div>
                        <div className="bg-white rounded-lg mt-3 p-4 shadow-md border">
                          <div className="text-center">
                            <span className="text-sm text-muted-foreground">Max Cap</span>
                            <div className="text-2xl font-bold text-yellow-600">{currency}{maxCollectionCapData.momoCollection.mtn}</div>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <div className="bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl p-4 text-center shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                          <div className="flex items-center justify-center mb-2">
                            <div className="bg-white/20 rounded-full p-2">
                              <IconDeviceMobile className="h-6 w-6" />
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-1">TELECEL</h3>
                          <p className="text-sm opacity-90">Mobile Money</p>
                        </div>
                        <div className="bg-white rounded-lg mt-3 p-4 shadow-md border">
                          <div className="text-center">
                            <span className="text-sm text-muted-foreground">Max Cap</span>
                            <div className="text-2xl font-bold text-red-600">{currency}{maxCollectionCapData.momoCollection.telecel}</div>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl p-4 text-center shadow-lg transform transition-all hover:scale-105 hover:shadow-xl">
                          <div className="flex items-center justify-center mb-2">
                            <div className="bg-white/20 rounded-full p-2">
                              <IconDeviceMobile className="h-6 w-6" />
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-1">AIRTELTIGO</h3>
                          <p className="text-sm opacity-90">Mobile Money</p>
                        </div>
                        <div className="bg-white rounded-lg mt-3 p-4 shadow-md border">
                          <div className="text-center">
                            <span className="text-sm text-muted-foreground">Max Cap</span>
                            <div className="text-2xl font-bold text-blue-600">{currency}{maxCollectionCapData.momoCollection.airtelTigo}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center pt-4">
                      <Button 
                        onClick={() => handleMaxCollectionEdit("momoCollection")} 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg transform transition-all hover:scale-105"
                        size="lg"
                      >
                        <IconSettings className="h-5 w-5 mr-2" />
                        Configure MAX COLLECTION CAP
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Edit Maximum Collection Charge Caps</h3>
                      <p className="text-sm text-muted-foreground">Update the maximum charge limits for each mobile money provider</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <Label htmlFor="momo-collection-mtn-cap" className="font-medium">MTN Max Collection Charge</Label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span>
                          <Input
                            id="momo-collection-mtn-cap"
                            type="number"
                            step="0.01"
                            min="0"
                            value={maxCollectionCapData.momoCollection.mtn}
                            onChange={(e) => updateMaxCollectionCap('mtn', e.target.value)}
                            placeholder="0.00"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <Label htmlFor="momo-collection-telecel-cap" className="font-medium">TELECEL Max Collection Charge</Label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span>
                          <Input
                            id="momo-collection-telecel-cap"
                            type="number"
                            step="0.01"
                            min="0"
                            value={maxCollectionCapData.momoCollection.telecel}
                            onChange={(e) => updateMaxCollectionCap('telecel', e.target.value)}
                            placeholder="0.00"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <Label htmlFor="momo-collection-airteltigo-cap" className="font-medium">AIRTELTIGO Max Collection Charge</Label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span>
                          <Input
                            id="momo-collection-airteltigo-cap"
                            type="number"
                            step="0.01"
                            min="0"
                            value={maxCollectionCapData.momoCollection.airtelTigo}
                            onChange={(e) => updateMaxCollectionCap('airtelTigo', e.target.value)}
                            placeholder="0.00"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4 pt-6 border-t">
                      <Button variant="outline" onClick={handleMaxCollectionCancel} className="px-6">
                        <IconX className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => handleMaxCollectionSave("momoCollection")}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6"
                      >
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