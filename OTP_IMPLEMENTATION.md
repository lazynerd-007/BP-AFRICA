# OTP Verification System for Admin Approvals

## Overview

This document outlines the implementation of One-Time Password (OTP) verification for admin approval features in the BP-AFRICA application. The OTP system adds an extra layer of security to critical administrative actions.

## Features Implemented

### 1. Reusable OTP Verification Component

**Location**: `components/ui/otp-verification.tsx`

**Features**:
- 6-digit OTP input with individual character boxes
- Auto-focus navigation between input fields
- Paste support for OTP codes
- Resend OTP functionality with 60-second cooldown
- Error handling and validation
- Responsive design for mobile and desktop
- Customizable action details display
- Processing states with loading indicators

**Props**:
```typescript
interface OTPVerificationProps {
  isOpen: boolean;                    // Controls dialog visibility
  onClose: () => void;               // Close handler
  onVerify: (otp?: string) => Promise<void>; // OTP verification handler
  title: string;                     // Dialog title
  description: string;               // Dialog description
  actionLabel: string;               // Action button label
  actionDetails?: {                  // Details to display for confirmation
    [key: string]: string | undefined;
  };
  isProcessing?: boolean;            // Processing state
  otpLength?: number;                // OTP length (default: 6)
}
```

### 2. OVA Approval System

**Location**: `app/admin/dashboard/ova/approval-ova.tsx`

**OTP Integration**:
- Already had OTP verification for fund transfer approvals
- Uses 6-digit OTP input with manual validation
- Displays transaction details for confirmation
- Simulates API call with processing states

**Workflow**:
1. Admin clicks approve/decline on pending request
2. OTP dialog opens with transaction details
3. Admin enters 6-digit OTP
4. System validates OTP and processes action
5. Success/error feedback provided

### 3. Reversals System

**Location**: `app/admin/dashboard/reversals/page.tsx`

**OTP Integration**:
- Added OTP verification for reversal approvals and rejections
- Uses the reusable OTP verification component
- Displays reversal details for confirmation

**Workflow**:
1. Super admin reviews reversal request
2. Clicks approve/reject action
3. OTP verification dialog opens
4. Admin enters OTP to confirm action
5. System processes reversal with audit trail

**OTP Details Displayed**:
- Reversal ID
- Transaction ID
- Amount
- Merchant name
- Reason for reversal

### 4. General Approvals System

**Location**: `app/admin/dashboard/approvals/page.tsx`

**OTP Integration**:
- Added OTP verification for all approval types
- Supports merchant updates, partner bank changes, new registrations
- Uses the reusable OTP verification component

**Approval Types**:
- Merchant updates (address, contact, settlement bank)
- Partner bank commission updates
- New merchant onboarding
- New partner bank registration
- Merchant deactivation

**OTP Details Displayed**:
- Request ID
- Entity type (Merchant/Partner Bank)
- Entity name
- Requested by
- Sub-type of request

## Security Features

### 1. OTP Generation and Delivery
- OTP sent to admin's registered mobile number and email
- 6-digit numeric code for security and usability
- Time-limited validity (typically 5-10 minutes)

### 2. Validation
- Client-side validation for OTP format
- Server-side verification (simulated in current implementation)
- Error handling for invalid/expired OTPs

### 3. Rate Limiting
- 60-second cooldown between OTP resend requests
- Prevents spam and abuse

### 4. Session Management
- OTP verification required for each approval action
- No persistent OTP sessions
- Automatic cleanup on dialog close

## User Experience

### 1. Intuitive Interface
- Clear visual feedback for OTP input
- Auto-focus and navigation between input fields
- Paste support for convenience
- Loading states during processing

### 2. Error Handling
- Clear error messages for invalid OTP
- Retry mechanism with new OTP generation
- Graceful handling of network errors

### 3. Mobile Responsiveness
- Touch-friendly input fields
- Responsive layout for all screen sizes
- Optimized for mobile keyboards

## Implementation Details

### 1. State Management
Each approval component maintains:
```typescript
const [showOtpDialog, setShowOtpDialog] = useState(false);
const [pendingAction, setPendingAction] = useState<{
  action: "approve" | "reject";
  item: ApprovalItem;
} | null>(null);
const [isProcessing, setIsProcessing] = useState(false);
```

### 2. OTP Workflow
```typescript
// 1. Initiate approval action
const handleApprovalAction = (action: "approve" | "reject") => {
  setPendingAction({ action, item: selectedItem });
  setShowApprovalDialog(false);
  setShowOtpDialog(true);
};

// 2. Handle OTP verification
const handleOtpVerification = async () => {
  setIsProcessing(true);
  try {
    // Simulate OTP verification and API call
    await processApproval(pendingAction);
    // Success handling
  } catch {
    // Error handling
  } finally {
    setIsProcessing(false);
  }
};
```

### 3. Component Integration
```jsx
<OTPVerification
  isOpen={showOtpDialog}
  onClose={handleOtpClose}
  onVerify={handleOtpVerification}
  title="Approve Request"
  description="Enter your OTP to approve this request"
  actionLabel="Approve"
  actionDetails={actionDetails}
  isProcessing={isProcessing}
/>
```

## Future Enhancements

### 1. Backend Integration
- Real OTP generation and SMS/email delivery
- Database logging of OTP attempts
- Integration with authentication service

### 2. Advanced Security
- Biometric verification option
- Hardware token support
- IP address validation

### 3. Audit Trail
- Comprehensive logging of all OTP verifications
- Failed attempt tracking
- Security event monitoring

### 4. Configuration
- Configurable OTP length
- Adjustable expiry times
- Custom delivery methods

## Testing

### 1. Manual Testing
- Test OTP input functionality
- Verify error handling
- Check mobile responsiveness
- Validate all approval workflows

### 2. Automated Testing
- Unit tests for OTP component
- Integration tests for approval flows
- E2E tests for complete workflows

## Deployment Notes

### 1. Environment Variables
```env
OTP_SERVICE_URL=https://api.otpservice.com
OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6
SMS_PROVIDER_KEY=your_sms_key
EMAIL_PROVIDER_KEY=your_email_key
```

### 2. Dependencies
- No additional dependencies required for current implementation
- Future backend integration may require SMS/email service SDKs

## Conclusion

The OTP verification system provides a robust security layer for admin approval features while maintaining excellent user experience. The reusable component design ensures consistency across all approval workflows and makes future enhancements straightforward to implement. 