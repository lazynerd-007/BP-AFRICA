"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDots,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface PaginationProps {
  paginationInfo: PaginationInfo
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  itemsPerPageOptions?: number[]
  showItemsPerPage?: boolean
  showPageInfo?: boolean
  showFirstLast?: boolean
  showPageInput?: boolean
  maxVisiblePages?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
  disabled?: boolean
}

export function Pagination({
  paginationInfo,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  showItemsPerPage = true,
  showPageInfo = true,
  showFirstLast = true,
  showPageInput = false,
  maxVisiblePages = 7,
  size = 'md',
  variant = 'outline',
  className,
  disabled = false,
}: PaginationProps) {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
  } = paginationInfo

  const [pageInput, setPageInput] = React.useState('')

  // Calculate visible page numbers
  const visiblePages = React.useMemo(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }, [currentPage, totalPages, maxVisiblePages])

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const page = parseInt(pageInput)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setPageInput('')
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-10 w-10 text-base',
  }

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'

  if (totalPages <= 1 && !showItemsPerPage) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Left side - Items per page and info */}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showPageInfo && (
          <div className="text-sm text-muted-foreground">
            {totalItems > 0 ? (
              <>
                Showing {((currentPage - 1) * itemsPerPage + 1).toLocaleString()} to{' '}
                {Math.min(currentPage * itemsPerPage, totalItems).toLocaleString()} of{' '}
                {totalItems.toLocaleString()} entries
              </>
            ) : (
              'No entries found'
            )}
          </div>
        )}
      </div>

      {/* Right side - Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          {showPageInput && (
            <form onSubmit={handlePageInputSubmit} className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Go to page:</span>
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                placeholder={currentPage.toString()}
                className="w-16 h-8"
                disabled={disabled}
              />
            </form>
          )}

          {/* First page */}
          {showFirstLast && (
            <Button
              variant={variant}
              size={buttonSize}
              className={cn(sizeClasses[size], "hidden sm:flex")}
              onClick={() => onPageChange(1)}
              disabled={!hasPreviousPage || disabled}
            >
              <IconChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Go to first page</span>
            </Button>
          )}

          {/* Previous page */}
          <Button
            variant={variant}
            size={buttonSize}
            className={sizeClasses[size]}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage || disabled}
          >
            <IconChevronLeft className="h-4 w-4" />
            <span className="sr-only">Go to previous page</span>
          </Button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {/* Show ellipsis at start if needed */}
            {visiblePages[0] > 1 && (
              <>
                <Button
                  variant={variant}
                  size={buttonSize}
                  className={sizeClasses[size]}
                  onClick={() => onPageChange(1)}
                  disabled={disabled}
                >
                  1
                </Button>
                {visiblePages[0] > 2 && (
                  <span className="flex items-center justify-center w-9 h-9">
                    <IconDots className="h-4 w-4" />
                  </span>
                )}
              </>
            )}

            {/* Visible page numbers */}
            {visiblePages.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : variant}
                size={buttonSize}
                className={cn(
                  sizeClasses[size],
                  page === currentPage && "pointer-events-none"
                )}
                onClick={() => onPageChange(page)}
                disabled={disabled}
              >
                {page}
              </Button>
            ))}

            {/* Show ellipsis at end if needed */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="flex items-center justify-center w-9 h-9">
                    <IconDots className="h-4 w-4" />
                  </span>
                )}
                <Button
                  variant={variant}
                  size={buttonSize}
                  className={sizeClasses[size]}
                  onClick={() => onPageChange(totalPages)}
                  disabled={disabled}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          {/* Next page */}
          <Button
            variant={variant}
            size={buttonSize}
            className={sizeClasses[size]}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage || disabled}
          >
            <IconChevronRight className="h-4 w-4" />
            <span className="sr-only">Go to next page</span>
          </Button>

          {/* Last page */}
          {showFirstLast && (
            <Button
              variant={variant}
              size={buttonSize}
              className={cn(sizeClasses[size], "hidden sm:flex")}
              onClick={() => onPageChange(totalPages)}
              disabled={!hasNextPage || disabled}
            >
              <IconChevronsRight className="h-4 w-4" />
              <span className="sr-only">Go to last page</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Simple pagination for basic use cases
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || disabled}
      >
        <IconChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || disabled}
      >
        Next
        <IconChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
} 