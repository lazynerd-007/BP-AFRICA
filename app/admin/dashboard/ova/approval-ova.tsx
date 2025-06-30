"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  IconCheck,
  IconX,
  IconEye,
  IconLockAccess,
  IconFileDescription,
  IconAlertCircle,
  IconClockHour4,
  IconChecks,
  IconCircleCheck,
  IconCircleX
} from "@tabler/icons-react";
import { useCurrency } from "@/lib/currency-context";

// Define types for request data
interface RequestBase {
  id: number;
  requestDate: string;
  amount: string;
  requestedBy: string;
  userId: string;
  status: string;
  department?: string;
  note?: string;
}

interface PendingRequest extends RequestBase {
  status: "Pending";
}

interface ProcessedRequest extends RequestBase {
  status: "Approved" | "Declined";
  approvedBy: string;
  approverId: string;
  processedDate: string;
  reason?: string;
}

type Request = PendingRequest | ProcessedRequest;

// Mock data for pending requests
const pendingRequestsData: PendingRequest[] = [
  {
    id: 1,
    requestDate: "2025-05-20T09:15:00",
    amount: "250,000.00",
    requestedBy: "John Doe",
    userId: "JD-001",
    status: "Pending",
    department: "Finance",
    note: "Monthly transfer to payout account"
  },
  {
    id: 2,
    requestDate: "2025-05-19T14:20:00",
    amount: "180,000.00",
    requestedBy: "Jane Smith",
    userId: "JS-002",
    status: "Pending",
    department: "Operations",
    note: "Urgent transfer for merchant payouts"
  },
  {
    id: 3,
    requestDate: "2025-05-18T11:30:00",
    amount: "120,000.00",
    requestedBy: "Michael Brown",
    userId: "MB-003",
    status: "Pending",
    department: "Finance",
    note: "Scheduled transfer for regular operations"
  }
];

// Mock data for processed requests
const processedRequestsData: ProcessedRequest[] = [
  {
    id: 101,
    requestDate: "2025-05-17T15:45:00",
    amount: "300,000.00",
    requestedBy: "John Doe",
    userId: "JD-001",
    status: "Approved",
    approvedBy: "Sarah Johnson",
    approverId: "SJ-005",
    processedDate: "2025-05-17T16:30:00"
  },
  {
    id: 102,
    requestDate: "2025-05-16T10:20:00",
    amount: "150,000.00",
    requestedBy: "Jane Smith",
    userId: "JS-002",
    status: "Declined",
    approvedBy: "Sarah Johnson",
    approverId: "SJ-005",
    processedDate: "2025-05-16T11:15:00",
    reason: "Insufficient documentation provided"
  },
  {
    id: 103,
    requestDate: "2025-05-15T09:10:00",
    amount: "200,000.00",
    requestedBy: "Michael Brown",
    userId: "MB-003",
    status: "Approved",
    approvedBy: "Robert Wilson",
    approverId: "RW-006",
    processedDate: "2025-05-15T10:05:00"
  }
];

interface ApprovalOVAProps {
  selectedProvider?: string;
}

export function ApprovalOVA({ selectedProvider: _selectedProvider }: ApprovalOVAProps) {
  const { currency } = useCurrency();
  
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [viewRequestDialog, setViewRequestDialog] = useState(false);
  const [approveDialog, setApproveDialog] = useState(false);
  const [declineDialog, setDeclineDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [actionCompleted, setActionCompleted] = useState<{ type: 'approve' | 'decline', requestId: number } | null>(null);
  
  // Function to get status badge variant
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
      case "Approved":
        return "secondary";
      case "Pending":
        return "default";
      case "Declined":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  // Function to view request details
  const viewRequest = (request: Request) => {
    setSelectedRequest(request);
    setViewRequestDialog(true);
  };
  
  // Function to initiate approval process
  const initiateApproval = (request: Request) => {
    setSelectedRequest(request);
    setApproveDialog(true);
  };
  
  // Function to initiate decline process
  const initiateDecline = (request: Request) => {
    setSelectedRequest(request);
    setDeclineDialog(true);
  };
  
  // Function to handle OTP approval
  const handleApprove = () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    
    setProcessing(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setProcessing(false);
      setApproveDialog(false);
      setOtp("");
      
      // Set action completed status
      setActionCompleted({
        type: 'approve',
        requestId: selectedRequest?.id || 0
      });
      
      // Clear action completed status after 5 seconds
      setTimeout(() => {
        setActionCompleted(null);
      }, 5000);
    }, 1500);
  };
  
  // Function to handle decline
  const handleDecline = () => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining");
      return;
    }
    
    setProcessing(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setProcessing(false);
      setDeclineDialog(false);
      setDeclineReason("");
      
      // Set action completed status
      setActionCompleted({
        type: 'decline',
        requestId: selectedRequest?.id || 0
      });
      
      // Clear action completed status after 5 seconds
      setTimeout(() => {
        setActionCompleted(null);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      {actionCompleted && (
        <Alert className={actionCompleted.type === 'approve' ? 
          "bg-green-50 border-green-200" : 
          "bg-red-50 border-red-200"}
        >
          {actionCompleted.type === 'approve' ? (
            <IconCircleCheck className="h-4 w-4 text-green-600" />
          ) : (
            <IconCircleX className="h-4 w-4 text-red-600" />
          )}
          <AlertTitle>
            {actionCompleted.type === 'approve' 
              ? "Request Approved Successfully" 
              : "Request Declined"
            }
          </AlertTitle>
          <AlertDescription>
            {actionCompleted.type === 'approve'
              ? "The fund transfer request has been approved and will be processed."
              : "The fund transfer request has been declined."
            }
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center">
            <IconClockHour4 className="mr-2 h-4 w-4" />
            Pending Requests
          </TabsTrigger>
          <TabsTrigger value="processed" className="flex items-center">
            <IconChecks className="mr-2 h-4 w-4" />
            Processed Requests
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Pending Approval Requests</CardTitle>
              <CardDescription>
                Review and process fund transfer requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequestsData.length > 0 ? (
                    pendingRequestsData.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {new Date(request.requestDate).toLocaleString()}
                        </TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>
                          <span className="font-mono text-xs">{request.userId}</span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {currency} {request.amount}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(request.status) as "secondary" | "destructive" | "default" | "outline"}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => viewRequest(request)}
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => initiateApproval(request)}
                            >
                              <IconCheck className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => initiateDecline(request)}
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No pending requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processed" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Processed Requests</CardTitle>
              <CardDescription>
                History of approved and declined requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processed By</TableHead>
                    <TableHead>Processed Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedRequestsData.length > 0 ? (
                    processedRequestsData.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {new Date(request.requestDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell className="text-right font-medium">
                          {currency} {request.amount}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(request.status) as "secondary" | "destructive" | "default" | "outline"}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.approvedBy}</TableCell>
                        <TableCell>
                          {new Date(request.processedDate).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewRequest(request)}
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No processed requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* View Request Dialog */}
      <Dialog open={viewRequestDialog} onOpenChange={setViewRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <IconFileDescription className="mr-2 h-5 w-5" />
              Request Details
            </DialogTitle>
            <DialogDescription>
              Fund transfer request information
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Request ID</Label>
                  <div className="text-sm font-medium mt-1">
                    #{selectedRequest.id}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(selectedRequest.status) as "secondary" | "destructive" | "default" | "outline"}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Requested By</Label>
                  <div className="text-sm font-medium mt-1">
                    {selectedRequest.requestedBy} ({selectedRequest.userId})
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Department</Label>
                  <div className="text-sm font-medium mt-1">
                    {selectedRequest.department || "N/A"}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Request Date</Label>
                  <div className="text-sm font-medium mt-1">
                    {new Date(selectedRequest.requestDate).toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Amount</Label>
                  <div className="text-sm font-medium mt-1">
                    {currency} {selectedRequest.amount}
                  </div>
                </div>
                {selectedRequest.status !== "Pending" && (
                  <>
                    <div>
                      <Label className="text-sm text-muted-foreground">Processed By</Label>
                      <div className="text-sm font-medium mt-1">
                        {selectedRequest.approvedBy} ({selectedRequest.approverId})
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Processed Date</Label>
                      <div className="text-sm font-medium mt-1">
                        {new Date(selectedRequest.processedDate).toLocaleString()}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Note</Label>
                <div className="text-sm mt-1 p-2 bg-muted rounded-md">
                  {selectedRequest.note || "No notes provided"}
                </div>
              </div>
              
              {selectedRequest.status !== "Pending" && (selectedRequest as ProcessedRequest).reason && (
                <div>
                  <Label className="text-sm text-muted-foreground">Decline Reason</Label>
                  <div className="text-sm mt-1 p-2 bg-red-50 rounded-md text-red-700">
                    {(selectedRequest as ProcessedRequest).reason}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewRequestDialog(false)}>
              Close
            </Button>
            {selectedRequest && selectedRequest.status === "Pending" && (
              <>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setViewRequestDialog(false);
                    initiateDecline(selectedRequest);
                  }}
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Decline
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setViewRequestDialog(false);
                    initiateApproval(selectedRequest);
                  }}
                >
                  <IconCheck className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approve Dialog with OTP */}
      <Dialog open={approveDialog} onOpenChange={setApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <IconLockAccess className="mr-2 h-5 w-5" />
              Approve Request
            </DialogTitle>
            <DialogDescription>
              Enter OTP to approve the fund transfer request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <Alert className="bg-blue-50 border-blue-200">
                <IconAlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle>Confirm Transaction Details</AlertTitle>
                <AlertDescription>
                  <div className="space-y-1 mt-2">
                    <p>Amount: <span className="font-medium">{currency} {selectedRequest.amount}</span></p>
                    <p>Requested By: <span className="font-medium">{selectedRequest.requestedBy} ({selectedRequest.userId})</span></p>
                    <p>Request Date: <span className="font-medium">{new Date(selectedRequest.requestDate).toLocaleString()}</span></p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center letter-spacing-wide font-mono text-lg"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  An OTP has been sent to your registered mobile number and email for verification
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove} 
              disabled={otp.length !== 6 || processing}
            >
              {processing ? "Processing..." : "Approve Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Decline Dialog */}
      <Dialog open={declineDialog} onOpenChange={setDeclineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <IconX className="mr-2 h-5 w-5" />
              Decline Request
            </DialogTitle>
            <DialogDescription>
              Provide a reason for declining this fund transfer request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="decline-reason">Reason for Declining</Label>
                <Input
                  id="decline-reason"
                  placeholder="Enter reason for declining"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This reason will be visible to the requester
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Request Details:</p>
                <p>Amount: {currency} {selectedRequest.amount}</p>
                <p>Requested By: {selectedRequest.requestedBy} ({selectedRequest.userId})</p>
                <p>Request Date: {new Date(selectedRequest.requestDate).toLocaleString()}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeclineDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDecline} 
              disabled={!declineReason.trim() || processing}
            >
              {processing ? "Processing..." : "Decline Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 