# Invoice & Milestone Management in Booking Editor

## Overview
Enhanced the admin booking edit dialog to include integrated invoice and payment milestone management, eliminating the need to switch between the booking page and invoice page.

## Features Added

### 1. **Automatic Invoice Loading**
When editing a booking, if an invoice exists:
- Automatically fetches the associated invoice data
- Displays loading state while fetching
- Shows "No invoice found" message if invoice doesn't exist

### 2. **Invoice Summary Display**
Visual summary card showing:
- **Total Amount**: Full service package price
- **Paid Amount**: Sum of all paid milestone amounts (in green)
- **Remaining Amount**: Outstanding balance (in red)
- **Status Badge**: Current invoice status (Paid/Partial/Unpaid)

### 3. **Milestone Management**
Each service process step is displayed as a payment milestone with:

#### **Milestone Information**
- Step number and name (e.g., "Step 1: Initial Design")
- Description of the milestone
- Status badge (Pending/In Progress/Completed)
- Amount and percentage of total

#### **Payment Status Toggle**
- **Paid Button** (Green with checkmark): Milestone is paid
- **Unpaid Button** (Outline with X): Milestone is unpaid
- Click to toggle between paid/unpaid
- Auto-updates:
  - Paid amount for the milestone
  - Total invoice paid amount
  - Invoice status (Unpaid → Partial → Paid)
  - Payment date

#### **Milestone Status Dropdown**
- **Pending**: Work not started
- **In Progress**: Currently working on this step
- **Completed**: Step finished
- Sets completion date when marked as Completed

### 4. **Real-Time Calculations**
When toggling payment status:
- Recalculates total paid amount
- Updates remaining balance
- Auto-updates invoice status:
  - **Unpaid**: No payments made (৳0 paid)
  - **Partial**: Some milestones paid (৳0 < paid < total)
  - **Paid**: All milestones paid (paid ≥ total)

### 5. **Synchronized Updates**
On save:
- Updates booking status, progress, dates, notes, timeline
- Updates invoice milestone statuses and payment information
- Syncs both booking and invoice to database
- Shows success/error notifications

## Technical Implementation

### State Management
```typescript
const [editingInvoice, setEditingInvoice] = useState<InvoiceDocument | null>(null)
const [loadingInvoice, setLoadingInvoice] = useState(false)
```

### Auto-Fetch Invoice
```typescript
useEffect(() => {
  const fetchInvoice = async () => {
    if (!editingBooking || !editingBooking.invoiceId) return
    
    setLoadingInvoice(true)
    const response = await fetch(`/api/invoices?bookingId=${editingBooking.id}`)
    const data = await response.json()
    
    if (data.success && data.data) {
      setEditingInvoice(data.data)
    }
    setLoadingInvoice(false)
  }

  fetchInvoice()
}, [editingBooking])
```

### Toggle Payment Status
```typescript
const toggleMilestonePayment = (milestoneId: string) => {
  const updatedMilestones = editingInvoice.milestones.map((milestone) => {
    if (milestone.id === milestoneId) {
      const newPaymentStatus: "Paid" | "Unpaid" = 
        milestone.paymentStatus === "Paid" ? "Unpaid" : "Paid"
      
      return {
        ...milestone,
        paymentStatus: newPaymentStatus,
        paidAmount: newPaymentStatus === "Paid" ? milestone.amount : 0,
        paidDate: newPaymentStatus === "Paid" ? new Date().toISOString() : undefined,
      }
    }
    return milestone
  })

  // Recalculate totals and status
  const newPaidAmount = updatedMilestones.reduce((sum, m) => sum + m.paidAmount, 0)
  const newRemainingAmount = editingInvoice.totalAmount - newPaidAmount
  
  let newStatus: "Unpaid" | "Partial" | "Paid" = "Unpaid"
  if (newPaidAmount >= editingInvoice.totalAmount) {
    newStatus = "Paid"
  } else if (newPaidAmount > 0) {
    newStatus = "Partial"
  }

  setEditingInvoice({
    ...editingInvoice,
    milestones: updatedMilestones,
    paidAmount: newPaidAmount,
    remainingAmount: newRemainingAmount,
    status: newStatus,
  })
}
```

### Update Milestone Status
```typescript
const updateMilestoneStatus = (
  milestoneId: string,
  status: "Pending" | "In Progress" | "Completed"
) => {
  const updatedMilestones = editingInvoice.milestones.map((milestone) => {
    if (milestone.id === milestoneId) {
      return {
        ...milestone,
        status,
        completedDate: status === "Completed" ? new Date().toISOString() : undefined,
      }
    }
    return milestone
  })

  setEditingInvoice({
    ...editingInvoice,
    milestones: updatedMilestones,
  })
}
```

### Save Handler
```typescript
const handleSaveBooking = async () => {
  // Update booking
  await fetch(`/api/bookings/${editingBooking.id}`, {
    method: "PUT",
    body: JSON.stringify({
      status, progress, startDate, estimatedCompletion, notes, timeline
    }),
  })

  // Update invoice milestones
  if (editingInvoice) {
    await fetch(`/api/invoices/${editingInvoice.id}`, {
      method: "PUT",
      body: JSON.stringify({
        milestones: editingInvoice.milestones,
      }),
    })
  }
}
```

## New API Endpoint

### `PUT /api/invoices/[id]/route.ts`
Updates invoice data including milestones.

**Request Body:**
```json
{
  "milestones": [
    {
      "id": "milestone-1",
      "paymentStatus": "Paid",
      "paidAmount": 10000,
      "paidDate": "2024-01-15T10:30:00.000Z",
      "status": "Completed",
      "completedDate": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Auto-Calculations:**
- Recalculates `paidAmount` from milestone totals
- Updates `remainingAmount` (total - paid)
- Sets invoice `status` (Unpaid/Partial/Paid)
- Sets `paidDate` when fully paid

**Response:**
```json
{
  "success": true,
  "data": { /* Updated invoice document */ }
}
```

## UI Components Used

### Icons
- `DollarSign`: Payment Milestones section header
- `Check`: Paid status button
- `X`: Unpaid status button
- `Loader2`: Loading spinner for invoice fetch

### Components
- `Card`: Invoice summary and milestone cards
- `Badge`: Status indicators (Paid/Partial/Unpaid, Pending/In Progress/Completed)
- `Button`: Payment toggle buttons
- `Select`: Milestone status dropdown
- `Label`: Form labels

## Color Scheme

### Invoice Status
- **Paid**: Green (`bg-green-500/20 text-green-400 border-green-500/50`)
- **Partial**: Yellow (`bg-yellow-500/20 text-yellow-400 border-yellow-500/50`)
- **Unpaid**: Red (`bg-red-500/20 text-red-400 border-red-500/50`)

### Milestone Status
- **Completed**: Green (`bg-green-500/20 text-green-400 border-green-500/50`)
- **In Progress**: Blue (`bg-blue-500/20 text-blue-400 border-blue-500/50`)
- **Pending**: Gray (`bg-gray-500/20 text-gray-400 border-gray-500/50`)

### Payment Status Buttons
- **Paid**: Green background with white text
- **Unpaid**: Outline style (border only)

## User Workflow

### Admin Updates Payment Status
1. Admin opens booking edit dialog
2. Scroll to "Payment Milestones" section
3. View invoice summary (total, paid, remaining)
4. For each milestone:
   - See current payment status (Paid/Unpaid)
   - Toggle payment status by clicking button
   - Update milestone status (Pending → In Progress → Completed)
5. Save changes
6. Both booking and invoice update simultaneously

### Benefits
- **No context switching**: Manage everything in one place
- **Visual feedback**: Clear status badges and color coding
- **Real-time updates**: See totals change as you toggle payments
- **Automatic calculations**: No manual math required
- **Service step visibility**: See exactly what work is being paid for

## Example Use Cases

### Scenario 1: Client Pays First Milestone
1. Admin edits booking
2. Sees "Step 1: Initial Design - ৳10,000 (25%)"
3. Clicks "Unpaid" button → changes to "Paid"
4. Invoice summary updates:
   - Paid: ৳10,000
   - Remaining: ৳30,000
   - Status: Partial
5. Saves booking
6. Client sees updated invoice with first payment recorded

### Scenario 2: Complete Work Phase
1. Admin completes design phase
2. In booking editor:
   - Changes milestone status to "Completed"
   - Toggles payment status to "Paid"
3. Both work status and payment status update together
4. Timeline and invoice stay synchronized

### Scenario 3: Full Payment Received
1. Client pays full amount upfront
2. Admin edits booking
3. Clicks "Unpaid" on all 4 milestones
4. Invoice status auto-updates to "Paid"
5. All paid dates recorded automatically
6. Invoice marked as fully paid

## Files Modified

### `app/admin/bookings/page.tsx`
- Added `editingInvoice` and `loadingInvoice` state
- Added `useEffect` to fetch invoice when editing booking
- Enhanced `handleSaveBooking` to update both booking and invoice
- Added `toggleMilestonePayment` helper function
- Added `updateMilestoneStatus` helper function
- Added invoice milestones UI section in edit dialog
- Added DollarSign, Check, X icons

### `app/api/invoices/[id]/route.ts` (NEW)
- Created PUT endpoint for updating invoices
- Auto-calculates totals from milestone data
- Updates invoice status based on payment amounts
- Includes GET endpoint for single invoice fetch

## Testing Checklist

- [x] Invoice loads when editing booking with invoiceId
- [x] Shows "No invoice found" for bookings without invoice
- [x] Invoice summary displays correct amounts
- [x] Toggle payment status updates paid amount
- [x] Toggle payment status updates invoice status
- [x] Milestone status dropdown works correctly
- [x] Saving updates both booking and invoice
- [x] Error handling for failed invoice update
- [x] Dialog closes properly and clears invoice state
- [x] No TypeScript errors
- [x] Loading spinner shows while fetching invoice

## Future Enhancements

1. **Payment Method Tracking**: Add dropdown to select payment method (bKash/Nagad/Bank)
2. **Transaction ID**: Add input field for transaction reference
3. **Partial Payments**: Allow partial milestone payments (not just full/unpaid)
4. **Payment History**: Show list of all payments made to this invoice
5. **Email Notifications**: Auto-send email when payment status changes
6. **Payment Reminders**: Auto-remind clients of unpaid milestones
7. **Payment Receipts**: Generate and download PDF receipts
8. **Refund Support**: Handle refund scenarios
9. **Multi-Currency**: Support USD and BDT
10. **Payment Gateway Integration**: Direct payment links

## Notes

- Invoice must exist (created when booking submitted) to show milestone section
- Milestones are auto-generated from service.process array
- Payment status changes are reflected immediately in UI
- Total amounts are calculated automatically
- Both booking and invoice are updated in single save operation
- Admin can update both work status and payment status together
- All dates (paid date, completed date) are auto-set
