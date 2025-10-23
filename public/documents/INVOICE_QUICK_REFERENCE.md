# Invoice & Milestone Management - Quick Reference

## UI Layout in Booking Edit Dialog

```
┌─────────────────────────────────────────────────────────┐
│  Edit Booking                                      [X]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Status: [Dropdown] ▼                                   │
│  Progress: [0-100] ▁▁▁▁▁▁▁▁▁▁░░░░░░░░░░ 50%           │
│                                                          │
│  Start Date: [Date Picker]                              │
│  Est. Completion: [Date Picker]                         │
│                                                          │
│  Admin Notes: [Text Area]                               │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  💰 Payment Milestones              [Partial] ⚠️       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Total: ৳40,000 | Paid: ৳20,000 | Due: ৳20,000 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Step 1: Initial Design           [Completed] ✓  │  │
│  │ Create initial 3D designs and mockups            │  │
│  │                                                   │  │
│  │ Amount: ৳10,000 (25%)                           │  │
│  │ Payment: [✓ Paid] ←─ Click to Toggle            │  │
│  │                                                   │  │
│  │ Status: [Completed ▼]                            │  │
│  │                                                   │  │
│  │ ✓ Paid on Jan 15, 2024                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Step 2: Development             [In Progress] ⚙️ │  │
│  │ Build 3D models and animations                   │  │
│  │                                                   │  │
│  │ Amount: ৳10,000 (25%)                           │  │
│  │ Payment: [✓ Paid] ←─ Click to Toggle            │  │
│  │                                                   │  │
│  │ Status: [In Progress ▼]                          │  │
│  │                                                   │  │
│  │ ✓ Paid on Jan 20, 2024                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Step 3: Review                    [Pending] ⏳   │  │
│  │ Client review and feedback                       │  │
│  │                                                   │  │
│  │ Amount: ৳10,000 (25%)                           │  │
│  │ Payment: [✗ Unpaid] ←─ Click to Toggle          │  │
│  │                                                   │  │
│  │ Status: [Pending ▼]                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Step 4: Delivery                  [Pending] ⏳   │  │
│  │ Final delivery and handover                      │  │
│  │                                                   │  │
│  │ Amount: ৳10,000 (25%)                           │  │
│  │ Payment: [✗ Unpaid] ←─ Click to Toggle          │  │
│  │                                                   │  │
│  │ Status: [Pending ▼]                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Timeline                              [+ Add Phase]    │
├─────────────────────────────────────────────────────────┤
│  ... (existing timeline phases) ...                     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                              [Cancel]  [Save Changes]   │
└─────────────────────────────────────────────────────────┘
```

## Payment Status Toggle Behavior

### Before Click (Unpaid)
```
┌─────────────────┐
│  ✗ Unpaid       │  ← Gray outline
└─────────────────┘
```

### After Click (Paid)
```
┌─────────────────┐
│  ✓ Paid         │  ← Green background
└─────────────────┘
   ↓
Updates automatically:
• milestone.paidAmount = milestone.amount
• milestone.paidDate = now
• invoice.paidAmount += milestone.amount
• invoice.remainingAmount -= milestone.amount
• invoice.status recalculated
```

## Status Badge Colors

### Invoice Status (Top Right)
```
[Paid] ✓      → Green
[Partial] ⚠️  → Yellow
[Unpaid] ✗    → Red
```

### Milestone Status
```
[Completed] ✓    → Green
[In Progress] ⚙️ → Blue
[Pending] ⏳     → Gray
```

## Workflow Example

### Admin Receives Payment
```
1. Client sends payment notification
   ↓
2. Admin opens booking edit dialog
   ↓
3. Scrolls to Payment Milestones
   ↓
4. Finds the relevant milestone
   ↓
5. Clicks [✗ Unpaid] button
   ↓
6. Button changes to [✓ Paid] (green)
   ↓
7. Invoice summary updates:
   • Paid: ৳10,000 → ৳20,000
   • Remaining: ৳30,000 → ৳20,000
   • Status: Unpaid → Partial
   ↓
8. Admin clicks [Save Changes]
   ↓
9. Both booking and invoice update
   ↓
10. Client sees updated invoice
```

## API Flow

```
User clicks Save
    ↓
┌────────────────────────────┐
│  PUT /api/bookings/{id}    │
│  (Update booking data)     │
└────────────────────────────┘
    ↓
┌────────────────────────────┐
│  PUT /api/invoices/{id}    │
│  (Update milestones)       │
│                            │
│  Auto-calculates:          │
│  • paidAmount              │
│  • remainingAmount         │
│  • status                  │
│  • paidDate                │
└────────────────────────────┘
    ↓
Success notification
    ↓
Dialog closes
    ↓
Booking list refreshes
```

## Key Features

### ✅ Single Page Management
- No need to switch between booking and invoice pages
- All controls in one unified interface

### ✅ Real-Time Calculations
- Amounts update instantly when toggling payments
- Status badges change automatically
- No manual calculations needed

### ✅ Visual Feedback
- Color-coded status indicators
- Checkmarks for paid milestones
- Progress indicators

### ✅ Automatic Data Sync
- Saves booking and invoice together
- Maintains data consistency
- Updates both databases in one operation

### ✅ Service Step Integration
- Milestones automatically created from service.process
- Step names and descriptions pulled from service data
- No manual milestone creation needed

## Quick Actions

| Action | Result |
|--------|--------|
| Click **Unpaid** button | → Marks milestone as **Paid**, adds amount to total |
| Click **Paid** button | → Marks milestone as **Unpaid**, subtracts amount |
| Change Status dropdown | → Updates milestone work status (Pending/In Progress/Completed) |
| Click **Save Changes** | → Updates both booking and invoice in database |
| Close dialog | → Clears state, discards unsaved changes |

## Data Flow

```
Service Process Steps
        ↓
  Create Booking
        ↓
  Generate Invoice
        ↓
Create Milestones (from process)
        ↓
Edit Booking Dialog
        ↓
  Load Invoice Data
        ↓
Display Milestones UI
        ↓
Admin Toggles Payment
        ↓
Update State (client-side)
        ↓
Click Save
        ↓
Update Database (server-side)
        ↓
Refresh Booking List
```

## Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Paid Status | Green (#22c55e) | Completed payments |
| Partial Status | Yellow (#eab308) | Some payments made |
| Unpaid Status | Red (#ef4444) | No payments made |
| In Progress | Blue (#3b82f6) | Currently working |
| Pending | Gray (#6b7280) | Not started yet |
| Completed | Green (#22c55e) | Work finished |

## Technical Notes

- Invoice loads automatically when `editingBooking.invoiceId` exists
- Loading spinner shown while fetching invoice data
- State management: `editingInvoice` and `loadingInvoice`
- TypeScript types: `InvoiceDocument`, `InvoiceMilestone`
- API endpoint: `/api/invoices/[id]` (PUT and GET)
- All calculations done client-side, then saved to server
- No data loss on cancel (state reset)
