"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { IconCalendar, IconClock, IconDownload, IconSearch, IconX } from "@tabler/icons-react"
import { useState } from "react"

// Mock data for system logs
const mockLogs = [
  {
    id: 1,
    timestamp: new Date("2023-11-10T08:12:45"),
    level: "error",
    source: "payment-gateway",
    message: "Connection timeout with payment processor",
    user: "system",
    ipAddress: "10.0.2.15",
  },
  {
    id: 2,
    timestamp: new Date("2023-11-10T08:15:22"),
    level: "warning",
    source: "auth-service",
    message: "Multiple failed login attempts detected",
    user: "user@example.com",
    ipAddress: "192.168.1.105",
  },
  {
    id: 3,
    timestamp: new Date("2023-11-10T08:18:30"),
    level: "info",
    source: "merchant-api",
    message: "New merchant onboarding completed",
    user: "admin@blupay.com",
    ipAddress: "10.0.2.33",
  },
  {
    id: 4,
    timestamp: new Date("2023-11-10T08:22:15"),
    level: "error",
    source: "database",
    message: "Failed to execute query: Connection refused",
    user: "system",
    ipAddress: "10.0.2.15",
  },
  {
    id: 5,
    timestamp: new Date("2023-11-10T08:25:40"),
    level: "info",
    source: "transaction-service",
    message: "Batch settlement process started",
    user: "system",
    ipAddress: "10.0.2.15",
  },
  {
    id: 6,
    timestamp: new Date("2023-11-10T08:30:12"),
    level: "warning",
    source: "security",
    message: "Unusual access pattern detected",
    user: "merchant@example.com",
    ipAddress: "192.168.1.150",
  },
  {
    id: 7,
    timestamp: new Date("2023-11-10T08:35:05"),
    level: "info",
    source: "audit",
    message: "User role updated from operator to admin",
    user: "admin@blupay.com",
    ipAddress: "10.0.2.33",
  },
  {
    id: 8,
    timestamp: new Date("2023-11-10T08:40:22"),
    level: "error",
    source: "api-gateway",
    message: "Rate limit exceeded for API endpoint /transactions",
    user: "merchant@example.com",
    ipAddress: "192.168.1.150",
  },
  {
    id: 9,
    timestamp: new Date("2023-11-10T08:45:18"),
    level: "info",
    source: "notification-service",
    message: "Sent 245 push notifications successfully",
    user: "system",
    ipAddress: "10.0.2.15",
  },
  {
    id: 10,
    timestamp: new Date("2023-11-10T08:50:33"),
    level: "warning",
    source: "payment-gateway",
    message: "Payment declined due to insufficient funds",
    user: "customer@example.com",
    ipAddress: "192.168.1.200",
  },
];

export default function SystemLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [levelFilter, setLevelFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  
  // Get unique sources for the filter dropdown
  const sources = ["all", ...new Set(mockLogs.map(log => log.source))];
  
  // Apply filters
  const filteredLogs = mockLogs.filter(log => {
    // Search term filter
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    const matchesDate = date ? 
      log.timestamp.toDateString() === date.toDateString() : true;
    
    // Level filter
    const matchesLevel = levelFilter === "all" ? true : log.level === levelFilter;
    
    // Source filter
    const matchesSource = sourceFilter === "all" ? true : log.source === sourceFilter;
    
    return matchesSearch && matchesDate && matchesLevel && matchesSource;
  });
  
  // Sort by most recent first
  filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Function to clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDate(undefined);
    setLevelFilter("all");
    setSourceFilter("all");
  };
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      
      <Card>
        <CardHeader className="bg-muted/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
          <CardTitle className="text-xl font-semibold">System Activity Logs</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <IconDownload className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <IconCalendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source === "all" ? "All Sources" : source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Show active filters */}
          {(searchTerm || date || levelFilter !== "all" || sourceFilter !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1" 
                    onClick={() => setSearchTerm("")}
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {date && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date: {format(date, "PP")}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1" 
                    onClick={() => setDate(undefined)}
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {levelFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Level: {levelFilter}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1" 
                    onClick={() => setLevelFilter("all")}
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {sourceFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Source: {sourceFilter}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 ml-1" 
                    onClick={() => setSourceFilter("all")}
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7" 
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-full">Message</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <IconClock className="h-3 w-3 text-muted-foreground" />
                          <span>{format(log.timestamp, "HH:mm:ss")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(log.timestamp, "dd MMM yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.level === "error" 
                              ? "destructive" 
                              : log.level === "warning" 
                                ? "default" 
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{log.source}</TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell className="whitespace-nowrap">{log.user}</TableCell>
                      <TableCell className="whitespace-nowrap">{log.ipAddress}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No logs match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 