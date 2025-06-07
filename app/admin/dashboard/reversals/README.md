# Fund Reversal System

## Overview
The Fund Reversal system allows administrators to reverse transaction funds with proper approval workflows.

## Features

### 1. Create Reversal Tab
- **Transaction Lookup**: Search for transactions by ID
- **Reversal Form**: Create reversal requests with reasons and amounts
- **Validation**: Ensures transaction exists before creating reversal

### 2. Approval Tab (Super Admin Only)
- **Pending Approvals**: View all pending reversal requests
- **Review Details**: Inspect transaction and reversal details
- **Approve/Reject**: Super admin can approve or reject reversals
- **Status Tracking**: Track reversal status through workflow

## User Roles

### Admin
- Create reversal requests
- View all reversals
- Cannot approve own requests

### Super Admin
- All admin capabilities
- Approve/reject reversal requests
- Final authority on fund reversals

## Reversal Statuses
- **Pending Approval**: Awaiting super admin review
- **Approved**: Approved for processing
- **Rejected**: Rejected by super admin

## Security Features
- Role-based access control
- Approval workflow prevents self-approval
- Audit trail for all reversal actions
- Transaction validation before reversal creation

## Usage Flow
1. Admin looks up transaction by ID
2. Admin creates reversal request with reason
3. Super admin reviews and approves/rejects
4. System processes approved reversals
5. Audit trail maintained for compliance 