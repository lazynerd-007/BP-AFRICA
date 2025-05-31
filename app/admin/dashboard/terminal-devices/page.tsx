"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  IconSearch, 
  IconPlus, 
  IconLink, 
  IconUnlink, 
  IconRefresh, 
  IconDownload, 
  IconAlertCircle,
  IconSortAscending,
  IconSortDescending,
  IconFileUpload
} from "@tabler/icons-react";

// Mock data for terminals
const mockTerminals = [
  {
    id: "TRM-001",
    serialNumber: "SN-12345678",
    model: "PAX A920",
    status: "Active",
    merchantId: "MERCH-001",
    merchantName: "Banco Limited",
    lastSeen: "2023-10-15T14:30:22",
    apkVersion: "2.3.1",
    location: "Accra, Ghana"
  },
  {
    id: "TRM-002",
    serialNumber: "SN-87654321",
    model: "Verifone V240m",
    status: "Active",
    merchantId: "MERCH-002",
    merchantName: "GreenWay Markets",
    lastSeen: "2023-10-14T09:15:30",
    apkVersion: "2.3.0",
    location: "Kumasi, Ghana"
  },
  {
    id: "TRM-003",
    serialNumber: "SN-11223344",
    model: "PAX A920",
    status: "Inactive",
    merchantId: null,
    merchantName: null,
    lastSeen: "2023-09-28T11:40:15",
    apkVersion: "2.2.5",
    location: "Warehouse"
  },
  {
    id: "TRM-004",
    serialNumber: "SN-55667788",
    model: "Ingenico Move 5000",
    status: "Deactivated",
    merchantId: "MERCH-003",
    merchantName: "TechCity Electronics",
    lastSeen: "2023-09-10T16:22:40",
    apkVersion: "2.2.5",
    location: "Tamale, Ghana"
  },
  {
    id: "TRM-005",
    serialNumber: "SN-99001122",
    model: "PAX A920",
    status: "Active",
    merchantId: "MERCH-001",
    merchantName: "Banco Limited",
    lastSeen: "2023-10-15T10:05:12",
    apkVersion: "2.3.1",
    location: "Accra, Ghana"
  }
];

// Define terminal type
interface Terminal {
  id: string;
  serialNumber: string;
  model: string;
  status: string;
  merchantId: string | null;
  merchantName: string | null;
  lastSeen: string;
  apkVersion: string;
  location: string;
}

// Mock data for merchants
const mockMerchants = [
  { id: "MERCH-001", name: "Banco Limited" },
  { id: "MERCH-002", name: "GreenWay Markets" },
  { id: "MERCH-003", name: "TechCity Electronics" },
  { id: "MERCH-004", name: "Sunrise Supermarket" },
  { id: "MERCH-005", name: "Coastal Pharmacy" }
];

// Mock data for APK versions
const mockApkVersions = [
  { version: "2.3.1", releaseDate: "2023-10-01", description: "Latest release with NFC enhancements" },
  { version: "2.3.0", releaseDate: "2023-09-15", description: "UI improvements and bug fixes" },
  { version: "2.2.5", releaseDate: "2023-08-20", description: "Security patches" },
  { version: "2.2.0", releaseDate: "2023-07-10", description: "Added new payment methods" }
];

export default function TerminalDevicesPage() {
  const [terminals, setTerminals] = useState<Terminal[]>(mockTerminals);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("serialNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Dialog states
  const [newTerminalDialogOpen, setNewTerminalDialogOpen] = useState(false);
  const [updateApkDialogOpen, setUpdateApkDialogOpen] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [allocateDialogOpen, setAllocateDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  
  // Form states
  const [newTerminalData, setNewTerminalData] = useState({
    serialNumber: "",
    model: "",
    merchantId: ""
  });
  const [selectedApkVersion, setSelectedApkVersion] = useState("");
  const [selectedPartnerBank, setSelectedPartnerBank] = useState("all");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [selectedMerchantId, setSelectedMerchantId] = useState("");
  const [reallocationReason, setReallocationReason] = useState("");
  
  // Filter terminals based on search term and status
  const filteredTerminals = terminals.filter(terminal => {
    const matchesSearch = 
      terminal.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      terminal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (terminal.merchantName && terminal.merchantName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || terminal.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort terminals
  const sortedTerminals = [...filteredTerminals].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a] || "";
    const bValue = b[sortField as keyof typeof b] || "";
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  // Handle new terminal creation
  const handleCreateTerminal = () => {
    const newTerminal: Terminal = {
      id: `TRM-${(terminals.length + 1).toString().padStart(3, '0')}`,
      serialNumber: newTerminalData.serialNumber,
      model: newTerminalData.model,
      status: "Active",
      merchantId: newTerminalData.merchantId === "none" ? null : newTerminalData.merchantId || null,
      merchantName: newTerminalData.merchantId && newTerminalData.merchantId !== "none"
        ? mockMerchants.find(m => m.id === newTerminalData.merchantId)?.name || null
        : null,
      lastSeen: new Date().toISOString(),
      apkVersion: mockApkVersions[0].version,
      location: newTerminalData.merchantId && newTerminalData.merchantId !== "none" ? "Merchant Location" : "Warehouse"
    };
    
    setTerminals([newTerminal, ...terminals]);
    setNewTerminalDialogOpen(false);
    setNewTerminalData({ serialNumber: "", model: "", merchantId: "" });
  };
  
  // Handle terminal allocation/reallocation
  const handleAllocateTerminal = () => {
    if (!selectedTerminal) return;
    
    const updatedTerminals = terminals.map(terminal => {
      if (terminal.id === selectedTerminal.id) {
        return {
          ...terminal,
          merchantId: selectedMerchantId === "none" ? null : selectedMerchantId,
          merchantName: selectedMerchantId !== "none" 
            ? mockMerchants.find(m => m.id === selectedMerchantId)?.name || null
            : null,
          status: selectedMerchantId === "none" ? "Inactive" : "Active",
          lastSeen: new Date().toISOString()
        } as Terminal;
      }
      return terminal;
    });
    
    setTerminals(updatedTerminals);
    setAllocateDialogOpen(false);
    setSelectedMerchantId("");
    setReallocationReason("");
  };
  
  // Handle terminal deactivation
  const handleDeactivateTerminal = () => {
    if (!selectedTerminal) return;
    
    const updatedTerminals = terminals.map(terminal => {
      if (terminal.id === selectedTerminal.id) {
        return {
          ...terminal,
          status: "Deactivated",
          lastSeen: new Date().toISOString()
        } as Terminal;
      }
      return terminal;
    });
    
    setTerminals(updatedTerminals);
    setDeactivateDialogOpen(false);
    setDeactivateReason("");
  };
  
  // Handle APK update
  const handleUpdateApk = () => {
    if (!selectedApkVersion) return;
    
    const updatedTerminals = terminals.map(terminal => {
      if (selectedTerminal) {
        // Update single terminal
        if (terminal.id === selectedTerminal.id) {
          return {
            ...terminal,
            apkVersion: selectedApkVersion,
            lastSeen: new Date().toISOString()
          } as Terminal;
        }
        return terminal;
      } else {
        // Update all active terminals based on selected partner bank
        if (terminal.status === "Active" && 
            (selectedPartnerBank === "all" || 
             (terminal.merchantId && mockMerchants.find(m => 
                m.id === terminal.merchantId && m.id === selectedPartnerBank)))) {
          return {
            ...terminal,
            apkVersion: selectedApkVersion,
            lastSeen: new Date().toISOString()
          } as Terminal;
        }
        return terminal;
      }
    });
    
    setTerminals(updatedTerminals);
    setUpdateApkDialogOpen(false);
    setSelectedApkVersion("");
    setSelectedPartnerBank("all");
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "Active":
        return "secondary";
      case "Inactive":
        return "default";
      case "Deactivated":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Device Manager</h2>
        <p className="text-muted-foreground">
          Monitor and manage POS terminals and payment devices
        </p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative w-full md:w-64">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search terminals..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Deactivated">Deactivated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={updateApkDialogOpen} onOpenChange={setUpdateApkDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedTerminal(null);
                  setUpdateApkDialogOpen(true);
                }}
              >
                <IconRefresh className="h-4 w-4" />
                Update APK
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedTerminal ? `Update APK for ${selectedTerminal.serialNumber}` : "Update APK for All Active Terminals"}
                </DialogTitle>
                <DialogDescription>
                  {selectedTerminal 
                    ? "Select a new APK version to deploy to this terminal." 
                    : "Select a new APK version to deploy to all active terminals."}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apk-version">APK Version</Label>
                  <Select value={selectedApkVersion} onValueChange={setSelectedApkVersion}>
                    <SelectTrigger id="apk-version">
                      <SelectValue placeholder="Select APK version" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockApkVersions.map((apk) => (
                        <SelectItem key={apk.version} value={apk.version}>
                          {apk.version} - {apk.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {!selectedTerminal && (
                  <div className="space-y-2">
                    <Label htmlFor="partner-bank">Filter by Partner Bank</Label>
                    <Select value={selectedPartnerBank} onValueChange={setSelectedPartnerBank}>
                      <SelectTrigger id="partner-bank">
                        <SelectValue placeholder="Select partner bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Partner Banks</SelectItem>
                        {mockMerchants.map((merchant) => (
                          <SelectItem key={merchant.id} value={merchant.id}>
                            {merchant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedPartnerBank === "all" 
                        ? `${terminals.filter(t => t.status === "Active").length} terminals will be updated.`
                        : `${terminals.filter(t => t.status === "Active" && t.merchantId === selectedPartnerBank).length} terminals will be updated.`}
                    </p>
                  </div>
                )}
                
                <div className="pt-2">
                  <Label className="text-sm font-medium">Upload Custom APK</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-muted-foreground/25 rounded-md">
                    <div className="space-y-1 text-center">
                      <IconFileUpload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex text-sm">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1 text-muted-foreground">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        APK up to 100MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This will schedule an update for {selectedTerminal ? "this terminal" : selectedPartnerBank === "all" ? "all active terminals" : `terminals assigned to ${mockMerchants.find(m => m.id === selectedPartnerBank)?.name}`} when they next connect to the server.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUpdateApkDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateApk} disabled={!selectedApkVersion}>
                  Update APK
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={newTerminalDialogOpen} onOpenChange={setNewTerminalDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <IconPlus className="h-4 w-4" />
                New Terminal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Terminal</DialogTitle>
                <DialogDescription>
                  Enter the details of the new terminal device
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serial-number">Serial Number</Label>
                  <Input 
                    id="serial-number" 
                    value={newTerminalData.serialNumber}
                    onChange={(e) => setNewTerminalData({...newTerminalData, serialNumber: e.target.value})}
                    placeholder="e.g. SN-12345678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Terminal Model</Label>
                  <Select 
                    value={newTerminalData.model}
                    onValueChange={(value) => setNewTerminalData({...newTerminalData, model: value})}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select terminal model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAX A920">PAX A920</SelectItem>
                      <SelectItem value="Verifone V240m">Verifone V240m</SelectItem>
                      <SelectItem value="Ingenico Move 5000">Ingenico Move 5000</SelectItem>
                      <SelectItem value="PAX S920">PAX S920</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="merchant">Assign to Merchant (Optional)</Label>
                  <Select 
                    value={newTerminalData.merchantId}
                    onValueChange={(value) => setNewTerminalData({...newTerminalData, merchantId: value})}
                  >
                    <SelectTrigger id="merchant">
                      <SelectValue placeholder="Select merchant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not Assigned</SelectItem>
                      {mockMerchants.map((merchant) => (
                        <SelectItem key={merchant.id} value={merchant.id}>
                          {merchant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewTerminalDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTerminal}
                  disabled={!newTerminalData.serialNumber || !newTerminalData.model}
                >
                  Create Terminal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle>Terminal Devices</CardTitle>
          <CardDescription>
            {sortedTerminals.length} terminals found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => {
                      if (sortField === "serialNumber") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                      } else {
                        setSortField("serialNumber");
                        setSortDirection("asc");
                      }
                    }}
                  >
                    <div className="flex items-center">
                      Terminal ID
                      {sortField === "serialNumber" && (
                        sortDirection === "asc" ? 
                          <IconSortAscending className="ml-1 h-4 w-4" /> : 
                          <IconSortDescending className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => {
                      if (sortField === "merchantName") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                      } else {
                        setSortField("merchantName");
                        setSortDirection("asc");
                      }
                    }}
                  >
                    <div className="flex items-center">
                      Merchant
                      {sortField === "merchantName" && (
                        sortDirection === "asc" ? 
                          <IconSortAscending className="ml-1 h-4 w-4" /> : 
                          <IconSortDescending className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>APK Version</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => {
                      if (sortField === "status") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                      } else {
                        setSortField("status");
                        setSortDirection("asc");
                      }
                    }}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === "status" && (
                        sortDirection === "asc" ? 
                          <IconSortAscending className="ml-1 h-4 w-4" /> : 
                          <IconSortDescending className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTerminals.length > 0 ? (
                  sortedTerminals.map((terminal) => (
                    <TableRow key={terminal.id}>
                      <TableCell>
                        <div className="font-medium">{terminal.serialNumber}</div>
                        <div className="text-xs text-muted-foreground">{terminal.id}</div>
                      </TableCell>
                      <TableCell>{terminal.model}</TableCell>
                      <TableCell>
                        {terminal.merchantName || (
                          <span className="text-muted-foreground">Not Assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge variant={getStatusBadgeVariant(terminal.status) as "secondary" | "default" | "destructive" | "outline"}>
                            {terminal.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(terminal.lastSeen).toLocaleString(undefined, { 
                          dateStyle: 'short', 
                          timeStyle: 'short' 
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(terminal.status) as "secondary" | "default" | "destructive" | "outline"}>
                          {terminal.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Update APK for single terminal */}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedTerminal(terminal);
                              setUpdateApkDialogOpen(true);
                            }}
                            disabled={terminal.status === "Deactivated"}
                          >
                            <IconDownload className="h-4 w-4" />
                            <span className="sr-only">Update APK</span>
                          </Button>
                          
                          {/* Allocate/Reallocate terminal */}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedTerminal(terminal);
                              setSelectedMerchantId(terminal.merchantId || "none");
                              setAllocateDialogOpen(true);
                            }}
                            disabled={terminal.status === "Deactivated"}
                          >
                            {terminal.merchantId ? (
                              <IconUnlink className="h-4 w-4" />
                            ) : (
                              <IconLink className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {terminal.merchantId ? "Reallocate" : "Allocate"}
                            </span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No terminals found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Allocation Dialog */}
      <Dialog open={allocateDialogOpen} onOpenChange={setAllocateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTerminal?.merchantId ? "Reallocate Terminal" : "Allocate Terminal"}
            </DialogTitle>
            <DialogDescription>
              {selectedTerminal?.merchantId 
                ? `Change the merchant assigned to terminal ${selectedTerminal?.serialNumber}`
                : `Assign terminal ${selectedTerminal?.serialNumber} to a merchant`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="merchant-allocation">Select Merchant</Label>
              <Select 
                value={selectedMerchantId} 
                onValueChange={setSelectedMerchantId}
              >
                <SelectTrigger id="merchant-allocation">
                  <SelectValue placeholder="Select merchant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not Assigned</SelectItem>
                  {mockMerchants.map((merchant) => (
                    <SelectItem key={merchant.id} value={merchant.id}>
                      {merchant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reallocation-reason">Reason for {selectedMerchantId === "none" ? "Removing Assignment" : "Reallocation"}</Label>
              <textarea
                id="reallocation-reason"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder={`Provide reason for ${selectedMerchantId === "none" ? "removing assignment" : "reallocation"}`}
                value={reallocationReason}
                onChange={(e) => setReallocationReason(e.target.value)}
              />
            </div>
            
            {selectedTerminal?.merchantId && (
              <Alert>
                <IconAlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This terminal is currently assigned to {selectedTerminal?.merchantName}.
                  {selectedMerchantId === "none" 
                    ? " Removing this assignment will mark the terminal as Inactive."
                    : ""}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAllocateTerminal}
              disabled={!reallocationReason.trim()}
            >
              Reallocate Terminal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Deactivate Dialog */}
      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Terminal</DialogTitle>
            <DialogDescription>
              This will deactivate terminal {selectedTerminal?.serialNumber}. 
              The terminal will no longer be able to process transactions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deactivate-reason">Reason for Deactivation</Label>
              <textarea
                id="deactivate-reason"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder="Provide reason for deactivation"
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
              />
            </div>
            
            <Alert>
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                This action will block the terminal from the system. You can reactivate it later if needed.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeactivateTerminal}
              disabled={!deactivateReason.trim()}
            >
              Deactivate Terminal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 