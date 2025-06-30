"use client"

import { useState } from "react"
import { IconWallet, IconDeviceMobile, IconBuildingBank } from "@tabler/icons-react"
import { useCurrency } from "@/lib/currency-context"
import { useErrorHandler } from "@/hooks/use-error-handler"
import ErrorBoundary, { PageErrorFallback } from "@/components/error-boundary"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
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
      </div>
    </ErrorBoundary>
  )
}