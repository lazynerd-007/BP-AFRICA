"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  IconSearch, 
  IconEye, 
  IconEdit, 
  IconDots, 
  IconCheck, 
  IconBan, 
  IconBuilding,
  IconMail,
  IconPhone,
  IconCalendar,
  IconFilter,
  IconX
} from "@tabler/icons-react";

// Mock sub-merchant data
const mockSubMerchants = [
  {
    id: "sub001",
    code: "SUB001",
    name: "BluWave Store 1",
    email: "store1@bluwave.com",
    phone: "+233 24 123 4567",
    address: "123 Main St, Accra",
    status: "Active",
    parentMerchant: {
      id: "bluwave",
      name: "BluWave Limited",
      code: "BWL001"
    },
    createdAt: "2024-01-15",
    transactionVolume: "₵45,678",
    lastTransaction: "2024-01-20"
  },
  {
    id: "sub002", 
    code: "SUB002",
    name: "BluWave Store 2",
    email: "store2@bluwave.com",
    phone: "+233 24 234 5678",
    address: "456 Oak Ave, Kumasi",
    status: "Active",
    parentMerchant: {
      id: "bluwave",
      name: "BluWave Limited", 
      code: "BWL001"
    },
    createdAt: "2024-01-18",
    transactionVolume: "₵32,450",
    lastTransaction: "2024-01-22"
  },
  {
    id: "sub003",
    code: "SUB003", 
    name: "Penguin Express",
    email: "express@blupenguin.com",
    phone: "+233 24 345 6789",
    address: "789 Pine St, Takoradi",
    status: "Suspended",
    parentMerchant: {
      id: "blupenguin",
      name: "Blu Penguin",
      code: "BP001"
    },
    createdAt: "2024-01-10",
    transactionVolume: "₵18,900",
    lastTransaction: "2024-01-19"
  },
  {
    id: "sub004",
    code: "SUB004",
    name: "Penguin Mart", 
    email: "mart@blupenguin.com",
    phone: "+233 24 456 7890",
    address: "321 Cedar Rd, Tema",
    status: "Active",
    parentMerchant: {
      id: "blupenguin", 
      name: "Blu Penguin",
      code: "BP001"
    },
    createdAt: "2024-01-12",
    transactionVolume: "₵67,234",
    lastTransaction: "2024-01-21"
  },
  {
    id: "sub005",
    code: "SUB005",
    name: "SkyNet Outlet A",
    email: "outleta@skynet.com", 
    phone: "+233 24 567 8901",
    address: "654 Elm St, Cape Coast",
    status: "Inactive",
    parentMerchant: {
      id: "skynet",
      name: "SkyNet Ghana",
      code: "SNG001"
    },
    createdAt: "2024-01-08",
    transactionVolume: "₵12,560",
    lastTransaction: "2024-01-15"
  },
  {
    id: "sub006",
    code: "SUB006",
    name: "SmartPay Branch 1",
    email: "branch1@smartpay.com",
    phone: "+233 24 678 9012", 
    address: "987 Birch Ave, Ho",
    status: "Active",
    parentMerchant: {
      id: "smartpay",
      name: "SmartPay Solutions",
      code: "SPS001"
    },
    createdAt: "2024-01-20",
    transactionVolume: "₵89,123",
    lastTransaction: "2024-01-23"
  }
];

// Get unique parent merchants for filter
const parentMerchants = Array.from(
  new Set(mockSubMerchants.map(sub => sub.parentMerchant.id))
).map(id => mockSubMerchants.find(sub => sub.parentMerchant.id === id)?.parentMerchant)
.filter(Boolean);

interface SubMerchant {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  parentMerchant: {
    id: string;
    name: string;
    code: string;
  };
  createdAt: string;
  transactionVolume: string;
  lastTransaction: string;
}

export function ViewSubMerchants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParent, setSelectedParent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grouped">("grouped");
  const [selectedSubMerchant, setSelectedSubMerchant] = useState<SubMerchant | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Filter and search logic
  const filteredSubMerchants = useMemo(() => {
    return mockSubMerchants.filter(subMerchant => {
      const matchesSearch = 
        subMerchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subMerchant.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subMerchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subMerchant.parentMerchant.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesParent = selectedParent === "all" || subMerchant.parentMerchant.id === selectedParent;
      const matchesStatus = selectedStatus === "all" || subMerchant.status === selectedStatus;
      
      return matchesSearch && matchesParent && matchesStatus;
    });
  }, [searchTerm, selectedParent, selectedStatus]);

  // Group by parent merchant
  const groupedSubMerchants = useMemo(() => {
    const grouped = filteredSubMerchants.reduce((acc, subMerchant) => {
      const parentId = subMerchant.parentMerchant.id;
      if (!acc[parentId]) {
        acc[parentId] = {
          parent: subMerchant.parentMerchant,
          subMerchants: []
        };
      }
      acc[parentId].subMerchants.push(subMerchant);
      return acc;
    }, {} as Record<string, { parent: any; subMerchants: SubMerchant[] }>);

    return Object.values(grouped);
  }, [filteredSubMerchants]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Suspended':
        return 'destructive';
      case 'Inactive':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    if (status === 'Active') {
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400";
    }
    return "";
  };

  const handleViewDetails = (subMerchant: SubMerchant) => {
    setSelectedSubMerchant(subMerchant);
    setShowDetailsDialog(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedParent("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters = searchTerm || selectedParent !== "all" || selectedStatus !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sub-Merchants</h2>
          <p className="text-muted-foreground">
            View and manage sub-merchant accounts ({filteredSubMerchants.length} total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => setViewMode("table")}
            size="sm"
          >
            Table View
          </Button>
          <Button
            variant={viewMode === "grouped" ? "default" : "outline"}
            onClick={() => setViewMode("grouped")}
            size="sm"
          >
            Grouped View
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <Button
                variant="ghost" 
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
              >
                <IconX className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search sub-merchants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Parent Merchant</label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger>
                  <SelectValue placeholder="All parent merchants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parent Merchants</SelectItem>
                  {parentMerchants.map((parent) => (
                    <SelectItem key={parent?.id} value={parent?.id || ""}>
                      {parent?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="text-sm">
                <span className="font-medium">{filteredSubMerchants.length}</span> sub-merchant(s) found
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === "table" ? (
        // Table View
        <Card>
          <CardHeader>
            <CardTitle>Sub-Merchants List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sub-Merchant</TableHead>
                  <TableHead>Parent Merchant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction Volume</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubMerchants.map((subMerchant) => (
                  <TableRow key={subMerchant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subMerchant.name}</div>
                        <div className="text-sm text-muted-foreground">{subMerchant.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subMerchant.parentMerchant.name}</div>
                        <div className="text-sm text-muted-foreground">{subMerchant.parentMerchant.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{subMerchant.email}</div>
                        <div className="text-sm text-muted-foreground">{subMerchant.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(subMerchant.status)}
                        className={getStatusBadgeClasses(subMerchant.status)}
                      >
                        {subMerchant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subMerchant.transactionVolume}</div>
                        <div className="text-sm text-muted-foreground">Last: {subMerchant.lastTransaction}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(subMerchant)}>
                            <IconEye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconEdit className="h-4 w-4 mr-2" />
                            Edit Sub-Merchant
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            {subMerchant.status === 'Active' ? (
                              <>
                                <IconBan className="h-4 w-4 mr-2" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <IconCheck className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSubMerchants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        No sub-merchants found matching your criteria
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        // Grouped View
        <div className="space-y-6">
          {groupedSubMerchants.map((group) => (
            <Card key={group.parent.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <IconBuilding className="h-5 w-5" />
                  {group.parent.name}
                  <Badge variant="outline" className="ml-2">
                    {group.subMerchants.length} sub-merchant{group.subMerchants.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Parent Merchant Code: {group.parent.code}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.subMerchants.map((subMerchant) => (
                    <Card key={subMerchant.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{subMerchant.name}</h4>
                              <p className="text-sm text-muted-foreground">{subMerchant.code}</p>
                            </div>
                            <Badge 
                              variant={getStatusBadgeVariant(subMerchant.status)}
                              className={getStatusBadgeClasses(subMerchant.status)}
                            >
                              {subMerchant.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <IconMail className="h-4 w-4 text-muted-foreground" />
                              <span>{subMerchant.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IconPhone className="h-4 w-4 text-muted-foreground" />
                              <span>{subMerchant.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IconCalendar className="h-4 w-4 text-muted-foreground" />
                              <span>Created: {subMerchant.createdAt}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Volume:</span>
                              <span className="font-medium">{subMerchant.transactionVolume}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(subMerchant)}
                              className="flex-1"
                            >
                              <IconEye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <IconDots className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <IconEdit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  {subMerchant.status === 'Active' ? (
                                    <>
                                      <IconBan className="h-4 w-4 mr-2" />
                                      Suspend
                                    </>
                                  ) : (
                                    <>
                                      <IconCheck className="h-4 w-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {groupedSubMerchants.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">
                  No sub-merchants found matching your criteria
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Sub-Merchant Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sub-Merchant Details</DialogTitle>
            <DialogDescription>
              View detailed information about {selectedSubMerchant?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubMerchant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sub-Merchant Name</label>
                  <p className="font-medium">{selectedSubMerchant.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Code</label>
                  <p className="font-medium">{selectedSubMerchant.code}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Parent Merchant</label>
                <p className="font-medium">{selectedSubMerchant.parentMerchant.name}</p>
                <p className="text-sm text-muted-foreground">{selectedSubMerchant.parentMerchant.code}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge 
                      variant={getStatusBadgeVariant(selectedSubMerchant.status)}
                      className={getStatusBadgeClasses(selectedSubMerchant.status)}
                    >
                      {selectedSubMerchant.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="font-medium">{selectedSubMerchant.createdAt}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                <div className="mt-1 space-y-1">
                  <p className="text-sm">{selectedSubMerchant.email}</p>
                  <p className="text-sm">{selectedSubMerchant.phone}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="font-medium">{selectedSubMerchant.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction Volume</label>
                  <p className="font-medium">{selectedSubMerchant.transactionVolume}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Transaction</label>
                  <p className="font-medium">{selectedSubMerchant.lastTransaction}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <IconEdit className="h-4 w-4 mr-2" />
                  Edit Sub-Merchant
                </Button>
                <Link href={`/admin/dashboard/merchant/${selectedSubMerchant.id}`}>
                  <Button className="flex-1">
                    <IconEye className="h-4 w-4 mr-2" />
                    View Full Details
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
