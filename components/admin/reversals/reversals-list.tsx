"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconSearch, IconEye, IconCheck } from "@tabler/icons-react"
import { ReversalData, ReversalFilters, TransactionLookup } from "./types"

interface ReversalsListProps {
  reversalsData: ReversalData[]
  filters: ReversalFilters
  onFiltersChange: (filters: ReversalFilters) => void
  isSuperAdmin: boolean
  onViewTransaction: (transaction: TransactionLookup) => void
  onReviewReversal: (reversal: ReversalData) => void
}

export function ReversalsList({
  reversalsData,
  filters,
  onFiltersChange,
  isSuperAdmin,
  onViewTransaction,
  onReviewReversal
}: ReversalsListProps) {
  const { searchTerm, statusFilter } = filters

  // Filter reversals
  const filteredReversals = useMemo(() => {
    return reversalsData.filter(reversal => {
      const matchesSearch = searchTerm === "" || 
        reversal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reversal.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reversal.merchantName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || 
        reversal.status.toLowerCase().replace(" ", "") === statusFilter.toLowerCase()
      
      return matchesSearch && matchesStatus
    })
  }, [reversalsData, searchTerm, statusFilter])

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved": return "default"
      case "Pending Approval": return "outline"
      case "Rejected": return "destructive"
      default: return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <CardTitle>Reversal Requests</CardTitle>
            <CardDescription>
              {isSuperAdmin ? "Review and approve/reject reversal requests" : "View reversal requests"}
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reversals..."
                className="pl-8 w-full sm:w-[240px]"
                value={searchTerm}
                onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
              />
            </div>
            
            <Select 
              value={statusFilter} 
              onValueChange={(value) => onFiltersChange({ ...filters, statusFilter: value })}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pendingapproval">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reversal ID</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReversals.map((reversal) => (
                <TableRow key={reversal.id}>
                  <TableCell className="font-medium">{reversal.id}</TableCell>
                  <TableCell>{reversal.transactionId}</TableCell>
                  <TableCell>{reversal.merchantName}</TableCell>
                  <TableCell>{reversal.amount}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{reversal.reason}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(reversal.status)}>
                      {reversal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{reversal.createdBy}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewTransaction({
                          ...reversal.originalTransaction,
                          status: "Completed"
                        })}
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                      {isSuperAdmin && reversal.status === "Pending Approval" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReviewReversal(reversal)}
                        >
                          <IconCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {filteredReversals.map((reversal) => (
            <Card key={reversal.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-sm">{reversal.id}</p>
                  <p className="text-xs text-muted-foreground">{reversal.transactionId}</p>
                </div>
                <Badge variant={getStatusVariant(reversal.status)}>
                  {reversal.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold">{reversal.amount}</p>
                  <p className="text-sm text-muted-foreground">{reversal.merchantName}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate">{reversal.reason}</p>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-muted-foreground">By: {reversal.createdBy}</p>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewTransaction({
                        ...reversal.originalTransaction,
                        status: "Completed"
                      })}
                    >
                      <IconEye className="h-4 w-4" />
                    </Button>
                    {isSuperAdmin && reversal.status === "Pending Approval" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReviewReversal(reversal)}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredReversals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reversal requests found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 