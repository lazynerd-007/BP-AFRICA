"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OTPVerification } from "@/components/ui/otp-verification";
import { 
  IconSearch, 
  IconCheck, 
  IconX, 
  IconFileDescription, 
  IconEye, 
  IconBuildingBank,
  IconBuildingStore,
  IconSend,
} from "@tabler/icons-react";
import { format } from "date-fns";

// Mock data for approval requests
const approvalRequests = [
  {
    id: "APR-001",
    type: "Merchant",
    subType: "Update",
    entity: "BluWave Limited",
    requestedBy: "John Doe",
    requestedOn: "2023-10-15T14:30:00",
    status: "Pending",
    details: {
      changes: [
        { field: "Business Address", from: "123 Main St, Accra", to: "456 Park Ave, Accra" },
        { field: "Contact Email", from: "info@bluwave.com", to: "contact@bluwave.com" },
        { field: "Settlement Bank", from: "Ghana Commercial Bank", to: "Ecobank Ghana" }
      ],
      notes: "Updated address and contact details following their relocation."
    }
  },
  {
    id: "APR-002",
    type: "Partner Bank",
    subType: "Commission Update",
    entity: "Ecobank Ghana",
    requestedBy: "Sarah Johnson",
    requestedOn: "2023-10-14T11:15:00",
    status: "Pending",
    details: {
      changes: [
        { field: "Commission Rate", from: "1.5%", to: "1.8%" },
        { field: "Settlement Period", from: "T+2", to: "T+1" }
      ],
      notes: "Updated commission structure based on new agreement signed on Oct 12, 2023."
    }
  },
  {
    id: "APR-003",
    type: "Merchant",
    subType: "New Merchant",
    entity: "GhanaTech Solutions",
    requestedBy: "Michael Addo",
    requestedOn: "2023-10-14T09:45:00",
    status: "Pending",
    details: {
      changes: [
        { field: "Business Name", from: "", to: "GhanaTech Solutions" },
        { field: "Business Type", from: "", to: "Technology Services" },
        { field: "Registration Number", from: "", to: "GH-BUS-23985" },
        { field: "Contact Email", from: "", to: "info@ghanatech.com" },
        { field: "Contact Phone", from: "", to: "+233 54 123 4567" },
        { field: "Settlement Bank", from: "", to: "Stanbic Bank Ghana" }
      ],
      notes: "New merchant onboarding. All required documentation has been verified."
    }
  },
  {
    id: "APR-004",
    type: "Partner Bank",
    subType: "New Partner",
    entity: "Fidelity Bank Ghana",
    requestedBy: "Emma Osei",
    requestedOn: "2023-10-13T16:20:00",
    status: "Pending",
    details: {
      changes: [
        { field: "Bank Name", from: "", to: "Fidelity Bank Ghana" },
        { field: "Bank Code", from: "", to: "FDGH" },
        { field: "Commission Rate", from: "", to: "1.5%" },
        { field: "Settlement Period", from: "", to: "T+1" },
        { field: "Contact Person", from: "", to: "Daniel Mensah" },
        { field: "Contact Email", from: "", to: "partnerships@fidelitybank.com.gh" }
      ],
      notes: "New banking partnership agreement signed on Oct 10, 2023."
    }
  },
  {
    id: "APR-005",
    type: "Merchant",
    subType: "Commission Update",
    entity: "Blu Penguin",
    requestedBy: "David Asante",
    requestedOn: "2023-10-13T10:05:00",
    status: "Approved",
    approvedBy: "Janet Kwakye",
    approvedOn: "2023-10-13T14:30:00",
    details: {
      changes: [
        { field: "Commission Rate", from: "2.0%", to: "1.8%" },
        { field: "Monthly Fee", from: "GHS 150", to: "GHS 100" }
      ],
      notes: "Approved commission structure adjustment based on transaction volume increase."
    }
  },
  {
    id: "APR-006",
    type: "Partner Bank",
    subType: "Update",
    entity: "Ghana Commercial Bank",
    requestedBy: "Samuel Boateng",
    requestedOn: "2023-10-12T13:45:00",
    status: "Rejected",
    rejectedBy: "Janet Kwakye",
    rejectedOn: "2023-10-12T16:20:00",
    details: {
      changes: [
        { field: "API Endpoint", from: "https://api.gcb.com.gh/v1", to: "https://api.gcb.com.gh/v2" },
        { field: "Webhook URL", from: "https://gcb.com.gh/webhooks/payments", to: "https://gcb.com.gh/webhooks/transactions" }
      ],
      notes: "API update documentation insufficient. Please provide more details on the changes.",
      rejectionReason: "Incomplete documentation for API changes. Need test reports and compliance verification."
    }
  },
  {
    id: "APR-007",
    type: "Merchant",
    subType: "Deactivation",
    entity: "QuickServe Ltd",
    requestedBy: "Francis Appiah",
    requestedOn: "2023-10-11T15:10:00",
    status: "Approved",
    approvedBy: "Janet Kwakye",
    approvedOn: "2023-10-12T09:15:00",
    details: {
      changes: [
        { field: "Status", from: "Active", to: "Deactivated" }
      ],
      notes: "Merchant requested account deactivation due to business closure.",
      approvalNotes: "Confirmed with merchant via phone. All pending transactions have been settled."
    }
  },
  {
    id: "REM-001",
    type: "Remittance",
    subType: "Cash Deposit",
    entity: "John Doe",
    requestedBy: "John Doe",
    requestedOn: "2023-10-15T16:45:00",
    status: "Pending",
    details: {
      changes: [
        { field: "Sender Name", from: "", to: "John Doe" },
        { field: "Sender Phone", from: "", to: "+233 24 123 4567" },
        { field: "Sender Email", from: "", to: "john.doe@email.com" },
        { field: "Amount", from: "", to: "GHS 500.00" },
        { field: "Purpose", from: "", to: "Family Support" },
        { field: "Reference Number", from: "", to: "REM20231015001" }
      ],
      notes: "Cash remittance request for wallet funding. Customer provided all required documentation."
    }
  },
  {
    id: "REM-002",
    type: "Remittance",
    subType: "Cash Deposit",
    entity: "Sarah Johnson",
    requestedBy: "Sarah Johnson",
    requestedOn: "2023-10-14T14:20:00",
    status: "Pending",
    details: {
      changes: [
        { field: "Sender Name", from: "", to: "Sarah Johnson" },
        { field: "Sender Phone", from: "", to: "+233 55 987 6543" },
        { field: "Sender Email", from: "", to: "sarah.johnson@email.com" },
        { field: "Amount", from: "", to: "GHS 1,200.00" },
        { field: "Purpose", from: "", to: "Business Investment" },
        { field: "Reference Number", from: "", to: "REM20231014002" }
      ],
      notes: "Remittance request for business wallet funding. All verification documents submitted."
    }
  },
  {
    id: "REM-003",
    type: "Remittance",
    subType: "Cash Deposit",
    entity: "Michael Addo",
    requestedBy: "Michael Addo",
    requestedOn: "2023-10-13T11:30:00",
    status: "Approved",
    approvedBy: "Janet Kwakye",
    approvedOn: "2023-10-13T15:45:00",
    details: {
      changes: [
        { field: "Sender Name", from: "", to: "Michael Addo" },
        { field: "Sender Phone", from: "", to: "+233 20 456 7890" },
        { field: "Sender Email", from: "", to: "michael.addo@email.com" },
        { field: "Amount", from: "", to: "GHS 800.00" },
        { field: "Purpose", from: "", to: "Personal Transfer" },
        { field: "Reference Number", from: "", to: "REM20231013003" }
      ],
      notes: "Cash remittance processed successfully. Amount credited to merchant wallet.",
      approvalNotes: "Verified sender identity and processed remittance. Funds transferred to wallet."
    }
  },
  {
    id: "REM-004",
    type: "Remittance",
    subType: "Cash Deposit",
    entity: "Emma Osei",
    requestedBy: "Emma Osei",
    requestedOn: "2023-10-12T09:15:00",
    status: "Rejected",
    rejectedBy: "Janet Kwakye",
    rejectedOn: "2023-10-12T12:30:00",
    details: {
      changes: [
        { field: "Sender Name", from: "", to: "Emma Osei" },
        { field: "Sender Phone", from: "", to: "+233 26 111 2222" },
        { field: "Sender Email", from: "", to: "emma.osei@email.com" },
        { field: "Amount", from: "", to: "GHS 2,500.00" },
        { field: "Purpose", from: "", to: "Investment" },
        { field: "Reference Number", from: "", to: "REM20231012004" }
      ],
      notes: "Large amount remittance request requires additional verification.",
      rejectionReason: "Insufficient documentation for large amount transfer. Please provide additional verification documents and source of funds documentation."
    }
  }
];

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentApproval, setCurrentApproval] = useState<typeof approvalRequests[0] | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: "approve" | "reject"; approval: typeof approvalRequests[0] } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter approvals based on search and filters
  const filteredApprovals = useMemo(() => {
    return approvalRequests.filter(request => {
      const matchesSearch = 
        searchTerm === "" || 
        request.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || request.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === "all" || request.type.toLowerCase() === typeFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  // Handle approval with OTP
  const handleApprove = () => {
    if (!currentApproval) return;
    
    // Set pending action and show OTP dialog
    setPendingAction({ action: "approve", approval: currentApproval });
    setShowApproveDialog(false);
    setShowOtpDialog(true);
  };

  // Handle rejection with OTP
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    
    if (!currentApproval) return;
    
    // Set pending action and show OTP dialog
    setPendingAction({ action: "reject", approval: currentApproval });
    setShowRejectDialog(false);
    setShowOtpDialog(true);
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    if (!pendingAction) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate OTP verification and API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { action } = pendingAction;
      
      // Close OTP dialog and show appropriate success modal
      setShowOtpDialog(false);
      setPendingAction(null);
      setApprovalNotes("");
      setRejectionReason("");
      
      if (action === "approve") {
        setShowApprovedModal(true);
      } else {
        setShowRejectedModal(true);
      }
      
    } catch {
      throw new Error("OTP verification failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Status badge variant mapper
  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const statusMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      "Pending": "outline",
      "Approved": "default",
      "Rejected": "destructive"
    };
    
    return statusMap[status] || "secondary";
  };

  // Get badge classes based on status
  const getStatusClasses = (status: string): string => {
    if (status === "Approved") {
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400";
    }
    return "";
  };

  // Get entity icon based on type
  const getEntityIcon = (type: string) => {
    switch (type) {
      case "Merchant":
        return <IconBuildingStore className="h-4 w-4" />;
      case "Partner Bank":
        return <IconBuildingBank className="h-4 w-4" />;
      case "Remittance":
        return <IconSend className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy • h:mm a");
  };

  return (
    <div className="px-4 lg:px-6 space-y-6">
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="merchant">Merchant Changes</TabsTrigger>
          <TabsTrigger value="bank">Partner Bank Changes</TabsTrigger>
          <TabsTrigger value="remittance">Remittance Approvals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <CardTitle>Approval Requests</CardTitle>
                  <CardDescription>
                    Review and manage approval requests
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search requests..."
                      className="pl-8 w-full sm:w-[240px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[130px]">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full sm:w-[130px]">
                        <SelectValue placeholder="Filter Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="merchant">Merchant</SelectItem>
                        <SelectItem value="partner bank">Partner Bank</SelectItem>
                        <SelectItem value="remittance">Remittance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals.length > 0 ? (
                    filteredApprovals.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getEntityIcon(request.type)}
                            <span>{request.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{request.entity}</TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>{formatDate(request.requestedOn)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusVariant(request.status)}
                            className={getStatusClasses(request.status)}
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentApproval(request);
                                setShowDetailsDialog(true);
                              }}
                              title="View Details"
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                            {request.status === "Pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                  onClick={() => {
                                    setCurrentApproval(request);
                                    setShowApproveDialog(true);
                                  }}
                                  title="Approve"
                                >
                                  <IconCheck className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    setCurrentApproval(request);
                                    setShowRejectDialog(true);
                                  }}
                                  title="Reject"
                                >
                                  <IconX className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No approval requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="merchant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Change Requests</CardTitle>
              <CardDescription>
                Review changes to merchant information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Change Type</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals
                    .filter(request => request.type === "Merchant")
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.entity}</TableCell>
                        <TableCell>{request.subType}</TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>{formatDate(request.requestedOn)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusVariant(request.status)}
                            className={getStatusClasses(request.status)}
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentApproval(request);
                                setShowDetailsDialog(true);
                              }}
                              title="View Details"
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                            {request.status === "Pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                  onClick={() => {
                                    setCurrentApproval(request);
                                    setShowApproveDialog(true);
                                  }}
                                  title="Approve"
                                >
                                  <IconCheck className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    setCurrentApproval(request);
                                    setShowRejectDialog(true);
                                  }}
                                  title="Reject"
                                >
                                  <IconX className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partner Bank Change Requests</CardTitle>
              <CardDescription>
                Review changes to partner bank information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Change Type</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals
                    .filter(request => request.type === "Partner Bank")
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.entity}</TableCell>
                        <TableCell>{request.subType}</TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>{formatDate(request.requestedOn)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusVariant(request.status)}
                            className={getStatusClasses(request.status)}
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentApproval(request);
                                setShowDetailsDialog(true);
                              }}
                              title="View Details"
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                            {request.status === "Pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                  onClick={() => {
                                    setCurrentApproval(request);
                                    setShowApproveDialog(true);
                                  }}
                                  title="Approve"
                                >
                                  <IconCheck className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    setCurrentApproval(request);
                                    setShowRejectDialog(true);
                                  }}
                                  title="Reject"
                                >
                                  <IconX className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="remittance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Remittance Approvals</CardTitle>
              <CardDescription>
                Review and approve remittance requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals
                    .filter(request => request.type === "Remittance")
                    .map((request) => {
                      const amountField = request.details.changes.find(change => change.field === "Amount");
                      const purposeField = request.details.changes.find(change => change.field === "Purpose");
                      
                      return (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.entity}</TableCell>
                          <TableCell className="font-medium">{amountField?.to || "-"}</TableCell>
                          <TableCell>{purposeField?.to || "-"}</TableCell>
                          <TableCell>{formatDate(request.requestedOn)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusVariant(request.status)}
                              className={getStatusClasses(request.status)}
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentApproval(request);
                                  setShowDetailsDialog(true);
                                }}
                                title="View Details"
                              >
                                <IconEye className="h-4 w-4" />
                              </Button>
                              {request.status === "Pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                    onClick={() => {
                                      setCurrentApproval(request);
                                      setShowApproveDialog(true);
                                    }}
                                    title="Approve"
                                  >
                                    <IconCheck className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      setCurrentApproval(request);
                                      setShowRejectDialog(true);
                                    }}
                                    title="Reject"
                                  >
                                    <IconX className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Request Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <IconFileDescription className="h-5 w-5" />
              <DialogTitle>Approval Request Details</DialogTitle>
            </div>
            <DialogDescription>
              {currentApproval?.id} - {currentApproval?.entity}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p className="font-medium">{currentApproval?.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Change Type</p>
                <p>{currentApproval?.subType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Requested On</p>
                <p>{currentApproval && formatDate(currentApproval.requestedOn)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge 
                  variant={currentApproval ? getStatusVariant(currentApproval.status) : "default"}
                  className={currentApproval ? getStatusClasses(currentApproval.status) : ""}
                >
                  {currentApproval?.status}
                </Badge>
              </div>
              {currentApproval?.status === "Approved" && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved By</p>
                  <p>{currentApproval.approvedBy}</p>
                </div>
              )}
              {currentApproval?.status === "Rejected" && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected By</p>
                  <p>{currentApproval.rejectedBy}</p>
                </div>
              )}
            </div>
            
            <div className="mt-2">
              {currentApproval?.type === "Remittance" ? (
                <>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Remittance Form Details</p>
                  <div className="border rounded-md p-4 space-y-3">
                    {currentApproval?.details.changes.map((change, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span className="text-sm font-medium text-muted-foreground">{change.field}:</span>
                        <span className="text-sm font-medium">{change.to}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Changes</p>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentApproval?.details.changes.map((change, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{change.field}</TableCell>
                            <TableCell>{change.from || "-"}</TableCell>
                            <TableCell>{change.to}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
            
            {currentApproval?.status === "Approved" && currentApproval.details.approvalNotes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approval Notes</p>
                <p className="text-sm">{currentApproval.details.approvalNotes}</p>
              </div>
            )}
            
            {currentApproval?.status === "Rejected" && currentApproval.details.rejectionReason && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejection Reason</p>
                <p className="text-sm">{currentApproval.details.rejectionReason}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {currentApproval?.status === "Pending" && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setShowDetailsDialog(false);
                    setShowRejectDialog(true);
                  }}
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => {
                    setShowDetailsDialog(false);
                    setShowApproveDialog(true);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-green-600">
              <IconCheck className="h-5 w-5" />
              <DialogTitle>Approve Request</DialogTitle>
            </div>
            <DialogDescription>
              {currentApproval?.id} - {currentApproval?.entity}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p>
              Are you sure you want to approve this change request?
            </p>
            
            <div>
              <label 
                htmlFor="approval-notes" 
                className="text-sm font-medium mb-2 block"
              >
                Approval Notes (Optional)
              </label>
              <textarea
                id="approval-notes"
                className="w-full h-24 p-2 border rounded-md resize-none"
                placeholder="Add any notes about this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600">
              <IconX className="h-5 w-5" />
              <DialogTitle>Reject Request</DialogTitle>
            </div>
            <DialogDescription>
              {currentApproval?.id} - {currentApproval?.entity}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p>
              Are you sure you want to reject this change request?
            </p>
            
            <div>
              <label 
                htmlFor="rejection-reason" 
                className="text-sm font-medium mb-2 block"
              >
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejection-reason"
                className="w-full h-24 p-2 border rounded-md resize-none"
                placeholder="Provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <OTPVerification
        isOpen={showOtpDialog}
        onClose={() => {
          setShowOtpDialog(false);
          setPendingAction(null);
          setIsProcessing(false);
        }}
        onVerify={handleOtpVerification}
        title={`${pendingAction?.action === "approve" ? "Approve" : "Reject"} Request`}
        description={`Enter your OTP to ${pendingAction?.action === "approve" ? "approve" : "reject"} this request`}
        actionLabel={pendingAction?.action === "approve" ? "Approve" : "Reject"}
        actionDetails={pendingAction ? {
          requestId: pendingAction.approval.id,
          type: pendingAction.approval.type,
          entity: pendingAction.approval.entity,
          requestedBy: pendingAction.approval.requestedBy,
          subType: pendingAction.approval.subType
        } : undefined}
        isProcessing={isProcessing}
      />

      {/* Approved Success Modal */}
      <Dialog open={showApprovedModal} onOpenChange={setShowApprovedModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Request Approved</DialogTitle>
            <DialogDescription>
              The approval request has been processed successfully
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <IconCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Request Approved Successfully</p>
              <p className="text-sm text-muted-foreground">
                The request has been approved and the changes will be implemented shortly.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowApprovedModal(false)} className="w-full">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejected Success Modal */}
      <Dialog open={showRejectedModal} onOpenChange={setShowRejectedModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Request Rejected</DialogTitle>
            <DialogDescription>
              The approval request has been rejected
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <IconX className="h-6 w-6 text-red-600" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Request Rejected</p>
              <p className="text-sm text-muted-foreground">
                The request has been rejected. The requester will be notified with the reason provided.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowRejectedModal(false)} className="w-full">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 