"use client"

import * as React from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingOverlay } from "@/components/ui/loading-states"
import { DataTable } from "./core/DataTable"
import { TableSearch } from "./components/TableSearch"
import { TablePagination } from "./components/TablePagination"
import { TableActions } from "./components/TableActions"
import { useTableState } from "./hooks/useTableState"
import {
  TableConfig,
  ExtendedColumnDef,
  TableAction,
  SearchConfig,
  TableLoadingState,
  PaginationInfo,
} from "./types"
import { cn } from "@/lib/utils"

interface EnhancedDataTableProps<TData> {
  // Core props
  data: TData[]
  columns: ExtendedColumnDef<TData>[]
  config?: TableConfig<TData>
  
  // Loading and error states
  loadingState?: TableLoadingState
  
  // Search configuration
  searchConfig?: SearchConfig
  enableSearch?: boolean
  
  // Actions
  actions?: TableAction<TData>[]
  
  // Pagination
  paginationInfo?: PaginationInfo
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  
  // Event handlers
  onRowClick?: (row: TData) => void
  onStateChange?: (state: any) => void
  
  // Styling
  className?: string
  tableClassName?: string
  
  // Accessibility
  caption?: string
  
  // Advanced features
  getRowId?: (row: TData) => string
  emptyStateMessage?: string
  emptyStateDescription?: string
}

export function EnhancedDataTable<TData>({
  data,
  columns,
  config = {},
  loadingState = {
    isLoading: false,
    isError: false,
    error: null,
    isEmpty: false,
  },
  searchConfig,
  enableSearch = false,
  actions = [],
  paginationInfo,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onStateChange,
  className,
  tableClassName,
  caption,
  getRowId,
  emptyStateMessage,
  emptyStateDescription,
}: EnhancedDataTableProps<TData>) {
  const {
    globalFilter,
    setGlobalFilter,
    rowSelection,
    hasSelection,
    selectedRowCount,
    resetAll,
  } = useTableState({ 
    config, 
    onStateChange 
  })

  // Get selected row data
  const selectedRows = React.useMemo(() => {
    if (!hasSelection) return []
    return data.filter((_, index) => rowSelection[index])
  }, [data, rowSelection, hasSelection])

  // Handle search
  const handleSearchChange = (value: string) => {
    setGlobalFilter(value)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    onPageChange?.(page)
  }

  const handlePageSizeChange = (pageSize: number) => {
    onPageSizeChange?.(pageSize)
  }

  // Show loading state
  if (loadingState.isLoading) {
    return (
      <div className={cn("w-full space-y-4", className)}>
        <div className="flex items-center justify-between">
          {enableSearch && (
            <div className="w-full max-w-sm">
              <TableSearch
                value=""
                onChange={() => {}}
                config={searchConfig}
                disabled={true}
              />
            </div>
          )}
          {actions.length > 0 && (
            <TableActions
              selectedRows={[]}
              actions={actions}
              disabled={true}
            />
          )}
        </div>
        <LoadingOverlay>
          <div className="h-96 rounded-lg border" />
        </LoadingOverlay>
      </div>
    )
  }

  // Show error state
  if (loadingState.isError) {
    throw loadingState.error || new Error("Failed to load data")
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header with search and actions */}
      {(enableSearch || actions.length > 0) && (
        <div className="flex items-center justify-between gap-4">
          {enableSearch && (
            <div className="flex-1 max-w-sm">
              <TableSearch
                value={globalFilter}
                onChange={handleSearchChange}
                config={searchConfig}
              />
            </div>
          )}
          
          {actions.length > 0 && (
            <TableActions
              selectedRows={selectedRows}
              actions={actions}
            />
          )}
        </div>
      )}

      {/* Selection info */}
      {hasSelection && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {selectedRowCount} of {data.length} row{data.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={resetAll}
            className="text-primary hover:underline"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={data}
        columns={columns}
        config={config}
        className={tableClassName}
        onRowClick={onRowClick}
        getRowId={getRowId}
        emptyStateMessage={emptyStateMessage}
        emptyStateDescription={emptyStateDescription}
      />

      {/* Pagination */}
      {config.enablePagination && paginationInfo && (
        <TablePagination
          paginationInfo={paginationInfo}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={config.pageSizeOptions}
        />
      )}
      
      {/* Table caption for accessibility */}
      {caption && (
        <div className="sr-only" role="caption">
          {caption}
        </div>
      )}
    </div>
  )
}

// Wrap with error boundary
export function SafeEnhancedDataTable<TData>(props: EnhancedDataTableProps<TData>) {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <h3 className="font-semibold text-destructive mb-2">
            Failed to load table
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message || "An unexpected error occurred while loading the data table."}
          </p>
          <button
            onClick={retry}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    >
      <EnhancedDataTable {...props} />
    </ErrorBoundary>
  )
} 