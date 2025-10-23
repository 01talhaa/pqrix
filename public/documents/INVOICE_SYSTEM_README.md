# Invoice & Payment System Documentation

## Overview

A comprehensive invoice and payment tracking system has been integrated into the Pqrix platform. This system automatically generates invoices when clients submit service inquiries and supports both full payment and milestone-based payment tracking.

## Features

### 1. **Automatic Invoice Generation**
- When a client submits a service booking inquiry, an invoice is automatically created
- Invoice numbers are auto-generated in format: `INV-YYYY-MM-XXXXX`
- Invoices are linked to bookings for easy tracking

### 2. **Milestone-Based Payments**
- Services with process steps automatically create milestone-based invoices
- Each service step becomes a payment milestone
- Clients can pay the full amount or pay after each milestone is completed
- Admin can track which milestones have been paid

### 3. **Multiple Payment Methods**
- **bKash**: Mobile banking payment
- **Nagad**: Mobile banking payment  
- **Bank Transfer**: Direct bank account transfer
- All payment method details are displayed on invoices

### 4. **Payment Tracking**
- Record payments (full or partial)
- Link payments to specific milestones
- Track transaction IDs and payment dates
- Automatic invoice status updates (Unpaid → Partial → Paid)

### 5. **Client & Admin Views**
- Clients can view their invoices with payment instructions
- Admins can view all invoices and record payments
- Real-time invoice status updates

## File Structure

```
lib/
  models/
    Invoice.ts                    # Invoice data model
    ServiceBooking.ts             # Updated with invoice reference
  payment-config.ts               # Payment methods & utilities

app/
  api/
    invoices/
      route.ts                    # Create & fetch invoices
      [id]/
        payments/
          route.ts                # Record payments
    bookings/
      route.ts                    # Updated to create invoices
  
  admin/
    invoices/
      page.tsx                    # Admin invoice management
    bookings/
      page.tsx                    # Updated with invoice links
    layout.tsx                    # Added Invoices menu item
  
  client/
    invoices/
      [id]/
        page.tsx                  # Client invoice view
    dashboard/
      page.tsx                    # Updated with invoice links

components/
  invoice-display.tsx             # Invoice display component
  booking-form.tsx                # Updated to create bookings
```

## Database Collections

### Invoices Collection
```typescript
{
  id: string                      // Unique invoice ID
  invoiceNumber: string           // INV-YYYY-MM-XXXXX
  bookingId: string               // Link to booking
  
  // Client Info
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  
  // Service Info
  serviceId: string
  serviceName: string
  packageName: string
  packagePrice: string
  
  // Pricing
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  currency: string                // "USD" | "BDT"
  
  // Status
  status: "Unpaid" | "Partial" | "Paid" | "Overdue" | "Cancelled"
  paymentType: "Full" | "Milestone"
  
  // Milestones
  milestones: [
    {
      id: string
      name: string
      description: string
      amount: number
      percentage: number
      status: "Pending" | "In Progress" | "Completed"
      paymentStatus: "Unpaid" | "Paid"
      paidAmount: number
      paidDate?: string
    }
  ]
  
  // Payment History
  payments: [
    {
      id: string
      amount: number
      method: "bKash" | "Nagad" | "Bank" | "Other"
      transactionId?: string
      milestoneId?: string
      paymentDate: string
      notes?: string
      verifiedBy?: string
    }
  ]
  
  // Payment Methods
  paymentMethods: [
    {
      type: "bKash" | "Nagad" | "Bank"
      accountName: string
      accountNumber: string
      bankName?: string
      branchName?: string
      routingNumber?: string
    }
  ]
  
  // Dates
  issueDate: string
  dueDate?: string
  paidDate?: string
  
  createdAt: string
  updatedAt: string
}
```

## Workflow

### 1. Client Submits Inquiry
```
Client fills booking form → POST /api/bookings
  ↓
Booking created in database
  ↓
Automatic POST to /api/invoices
  ↓
Invoice created with:
  - Status: "Unpaid"
  - Milestones from service process steps
  - Payment methods (bKash, Nagad, Bank)
  ↓
Booking updated with invoiceId
  ↓
Client redirected to invoice page
```

### 2. Admin Records Payment
```
Admin views invoice → Clicks "Record Payment"
  ↓
Fills payment form:
  - Amount
  - Payment method (bKash/Nagad/Bank/Other)
  - Transaction ID
  - Milestone (optional)
  - Notes
  ↓
POST /api/invoices/{id}/payments
  ↓
Invoice updated:
  - paidAmount increased
  - remainingAmount decreased
  - Status updated (Unpaid → Partial → Paid)
  - Milestone marked as paid (if specified)
  ↓
Booking status updated if fully paid
  ↓
Timeline entry added to booking
```

### 3. Client Views Invoice
```
Client dashboard → View Invoice button
  ↓
/client/invoices/{id}
  ↓
Shows:
  - Invoice details
  - Milestones & payment status
  - Payment methods (bKash, Nagad, Bank details)
  - Payment history
  - Terms & conditions
```

## API Endpoints

### GET /api/invoices
Fetch invoices
- Query params: `id`, `bookingId`, `clientId`
- Authorization: Client (own invoices) or Admin (all invoices)

### POST /api/invoices
Create invoice
```json
{
  "bookingId": "booking-xxx",
  "serviceId": "service-xxx"
}
```

### POST /api/invoices/{id}/payments
Record payment
```json
{
  "amount": 500,
  "method": "bKash",
  "transactionId": "TXN123456",
  "milestoneId": "milestone-1",
  "notes": "Payment received via bKash",
  "verifiedBy": "Admin"
}
```

### GET /api/invoices/{id}/payments
Get payment history for invoice

## Configuration

### Payment Methods Setup
Update `lib/payment-config.ts` with your actual payment details:

```typescript
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    type: "bKash",
    accountName: "Pqrix Solutions",
    accountNumber: "01XXXXXXXXX", // Your bKash number
  },
  {
    type: "Nagad",
    accountName: "Pqrix Solutions",
    accountNumber: "01XXXXXXXXX", // Your Nagad number
  },
  {
    type: "Bank",
    accountName: "Pqrix Solutions Limited",
    accountNumber: "XXXXXXXXXXXX", // Your account number
    accountType: "Current",
    bankName: "Dutch-Bangla Bank Limited (DBBL)",
    branchName: "Gulshan Branch",
    routingNumber: "XXXXXXXXX",
  },
]
```

## Admin Features

### Invoice Management (`/admin/invoices`)
- View all invoices with filtering
- Search by invoice number, client, or service
- Filter by status (Unpaid, Partial, Paid, etc.)
- Stats dashboard showing:
  - Total invoices
  - Paid invoices count
  - Total revenue collected
  - Pending revenue
- View detailed invoice
- Record payments (full or milestone-based)

### Booking Management (`/admin/bookings`)
- View invoice link for each booking
- Invoice button appears when invoice exists
- Opens invoice in new tab

## Client Features

### Client Dashboard (`/client/dashboard`)
- "View Invoice & Payment Details" button on each booking
- Direct link to invoice page

### Invoice Page (`/client/invoices/{id}`)
- Complete invoice details
- Milestone tracking
- Payment methods displayed
- Payment history
- Download/Print PDF option
- Contact support links

## Testing Checklist

- [ ] Submit a service inquiry from booking form
- [ ] Verify invoice is created automatically
- [ ] Check invoice appears in admin dashboard
- [ ] Verify invoice link shows in admin bookings
- [ ] Check invoice link shows in client dashboard
- [ ] Record a partial payment in admin
- [ ] Verify invoice status updates to "Partial"
- [ ] Record remaining payment
- [ ] Verify invoice status updates to "Paid"
- [ ] Check booking status updates to "Paid"
- [ ] Test milestone-based payment
- [ ] Verify payment methods display correctly
- [ ] Test invoice PDF download/print
- [ ] Verify payment history displays

## Customization

### Invoice Terms & Conditions
Edit `lib/payment-config.ts` → `DEFAULT_INVOICE_TERMS`

### Due Date Calculation
Default is 30 days. Modify in `lib/payment-config.ts`:
```typescript
export function calculateDueDate(issueDate: Date = new Date(), daysFromIssue: number = 30)
```

### Currency Format
Default is USD. Update in invoice creation or modify `formatCurrency()` in `lib/payment-config.ts`

## Security Notes

1. **Authentication**: Payment recording requires admin authentication
2. **Authorization**: Clients can only view their own invoices
3. **Validation**: All payment amounts are validated before recording
4. **Audit Trail**: All payments include verifiedBy and verification date

## Troubleshooting

### Invoice not created after booking
- Check `/api/invoices` endpoint is working
- Verify service has process steps defined
- Check MongoDB connection

### Payment not recording
- Verify admin token is valid
- Check invoice exists
- Ensure amount is valid number

### Milestones not showing
- Verify service has `process` array in database
- Check service data structure matches `ServiceDocument`

## Future Enhancements

- [ ] Email notifications when invoice is created
- [ ] Email notifications when payment is received
- [ ] PDF generation and download
- [ ] Automatic payment reminders for overdue invoices
- [ ] Integration with payment gateways (bKash API, Nagad API)
- [ ] Multi-currency support
- [ ] Invoice templates customization
- [ ] Bulk payment import
- [ ] Advanced reporting and analytics

## Support

For questions or issues:
- Technical: support@pqrix.com
- Billing: billing@pqrix.com
- WhatsApp: https://wa.link/65mf3i
