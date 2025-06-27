"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconWallet, IconDeviceMobile, IconBuildingBank } from "@tabler/icons-react"
import { ChargesData } from "./types"

interface ChargeStatsCardsProps {
  charges: ChargesData
  currency: string
}

export function ChargeStatsCards({ charges, currency }: ChargeStatsCardsProps) {
  const formatAmount = (amount: number) => `${currency}${amount.toFixed(2)}`

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wallet to Wallet</CardTitle>
          <IconWallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {charges.walletToWallet.chargeType === "fixed" 
              ? formatAmount(charges.walletToWallet.amount) 
              : `${charges.walletToWallet.percentage}% (Cap: ${formatAmount(charges.walletToWallet.cap)})`
            }
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
            {charges.momoSettlement.chargeType === "fixed" 
              ? formatAmount(charges.momoSettlement.amount) 
              : `${charges.momoSettlement.percentage}% (Cap: ${formatAmount(charges.momoSettlement.cap)})`
            }
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
            {charges.bankSettlement.chargeType === "fixed" 
              ? formatAmount(charges.bankSettlement.amount) 
              : `${charges.bankSettlement.percentage}% (Cap: ${formatAmount(charges.bankSettlement.cap)})`
            }
          </div>
          <p className="text-xs text-muted-foreground">Current charge</p>
        </CardContent>
      </Card>
    </div>
  )
} 