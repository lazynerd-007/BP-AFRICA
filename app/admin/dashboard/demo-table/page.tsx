"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconDownload, IconRefresh, IconTrash, IconEye } from "@tabler/icons-react"
import {
  SafeEnhancedDataTable,
  ExtendedColumnDef,
  TableConfig,
  TableAction,
  PaginationInfo,
  commonTableActions,
} from "@/components/patterns/data-table"
import { useErrorHandler } from "@/hooks/use-error-handler"

// Demo data type
interface Transaction {
  id: string
  merchant: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
  type: 'payment' | 'refund' | 'settlement'
  currency: string
}

// Mock data
const generateMockData = (count: number): Transaction[] => {
  const merchants = ['BluPay Store', 'Tech Solutions', 'Fashion Hub', 'Food Corner', 'Book World']
  const statuses: Transaction['status'][] = ['completed', 'pending', 'failed']
  const types: Transaction['type'][] = ['payment', 'refund', 'settlement']
  const currencies = ['GHS', 'USD', 'EUR']

  return Array.from({ length: count }, (_, i) => ({
    id: `TXN${String(i + 1).padStart(6, '0')}`,
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    amount: Math.floor(Math.random() * 10000) / 100,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: types[Math.floor(Math.random() * types.length)],
    currency: currencies[Math.floor(Math.random() * currencies.length)],
  }))
}

export default function DemoTablePage() {
  const { showSuccess, showError } = useErrorHandler()
  const [data, setData] = React.useState<Transaction[]>(() => generateMockData(50))
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [isLoading, setIsLoading] = React.useState(false)

  // Column definitions
  const columns: ExtendedColumnDef<Transaction>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className="rounded border-gray-300"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      width: 50,
    },
    {
      accessorKey: 'id',
      header: 'Transaction ID',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.id}</div>
      ),
      width: 120,
    },
    {
      accessorKey: 'merchant',
      header: 'Merchant',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.merchant}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.original.currency} {row.original.amount.toFixed(2)}
        </div>
      ),
      width: 120,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type
        const variant = type === 'payment' ? 'default' : type === 'refund' ? 'destructive' : 'secondary'
        return (
          <Badge variant={variant} className="capitalize">
            {type}
          </Badge>
        )
      },
      width: 100,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        const variant = status === 'completed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'
        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        )
      },
      width: 100,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.date).toLocaleDateString()}
        </div>
      ),
      width: 100,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => showSuccess('VIEW', 'default', `Viewing transaction ${row.original.id}`)}
          >
            <IconEye className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
      width: 80,
    },
  ]

  // Table configuration
  const config: TableConfig<Transaction> = {
    enableSorting: true,
    enableFiltering: true,
    enableRowSelection: true,
    enablePagination: true,
    enableColumnVisibility: true,
    stickyHeader: true,
    pageSize,
    pageSizeOptions: [5, 10, 20, 50],
  }

  // Table actions
  const actions: TableAction<Transaction>[] = [
    commonTableActions.export((rows) => {
      showSuccess('PROCESS', 'default', `Exporting ${rows.length} transactions`)
    }),
    commonTableActions.delete((rows) => {
      setData(prev => prev.filter(item => !rows.some(row => row.id === item.id)))
      showSuccess('DELETE', 'default', `Deleted ${rows.length} transactions`)
    }),
    {
      label: 'Process Refunds',
      icon: IconRefresh,
      onClick: (rows) => {
        const refundableRows = rows.filter(row => row.status === 'completed' && row.type === 'payment')
        showSuccess('PROCESS', 'default', `Processing ${refundableRows.length} refunds`)
      },
      variant: 'outline',
      requiresSelection: true,
      disabled: (rows) => !rows.some(row => row.status === 'completed' && row.type === 'payment'),
    },
  ]

  // Pagination info
  const paginationInfo: PaginationInfo = {
    total: data.length,
    pageCount: Math.ceil(data.length / pageSize),
    currentPage: currentPage - 1, // Zero-based for the component
    pageSize,
    hasNextPage: currentPage < Math.ceil(data.length / pageSize),
    hasPreviousPage: currentPage > 1,
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setData(generateMockData(50))
      setIsLoading(false)
      showSuccess('PROCESS', 'default', 'Data refreshed successfully')
    }, 1000)
  }

  // Paginated data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [data, currentPage, pageSize])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Enhanced DataTable Demo</h1>
          <p className="text-muted-foreground">
            Showcase of the new modular DataTable system with all features
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <IconRefresh className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-sm">Search & Filter</h3>
          <p className="text-xs text-muted-foreground">Global search with debouncing</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-sm">Row Selection</h3>
          <p className="text-xs text-muted-foreground">Multi-select with bulk actions</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-sm">Sorting</h3>
          <p className="text-xs text-muted-foreground">Click column headers to sort</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-sm">Pagination</h3>
          <p className="text-xs text-muted-foreground">Configurable page sizes</p>
        </div>
      </div>

      {/* Enhanced DataTable */}
      <SafeEnhancedDataTable
        data={paginatedData}
        columns={columns}
        config={config}
        enableSearch={true}
        searchConfig={{
          placeholder: 'Search transactions...',
          debounceMs: 300,
        }}
        actions={actions}
        paginationInfo={paginationInfo}
        onPageChange={(page) => setCurrentPage(page + 1)} // Convert back to 1-based
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
        onRowClick={(row) => {
          showSuccess('VIEW', 'default', `Clicked on transaction ${row.id}`)
        }}
        loadingState={{
          isLoading,
          isError: false,
          error: null,
          isEmpty: data.length === 0,
        }}
        emptyStateMessage="No transactions found"
        emptyStateDescription="Try adjusting your search criteria or add some transactions."
        caption="Transaction data table with enhanced features"
      />
    </div>
  )
} 