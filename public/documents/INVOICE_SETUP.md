# Invoice System - Quick Setup Guide

## ⚡ Quick Start

### 1. Update Payment Methods
**IMPORTANT**: Edit `lib/payment-config.ts` and replace the placeholder payment details with your actual account information:

```typescript
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    type: "bKash",
    accountName: "Pqrix Solutions",
    accountNumber: "01XXXXXXXXX", // ⚠️ Replace with your actual bKash number
  },
  {
    type: "Nagad",
    accountName: "Pqrix Solutions",
    accountNumber: "01XXXXXXXXX", // ⚠️ Replace with your actual Nagad number
  },
  {
    type: "Bank",
    accountName: "Pqrix Solutions Limited",
    accountNumber: "XXXXXXXXXXXX", // ⚠️ Replace with actual account number
    accountType: "Current",
    bankName: "Dutch-Bangla Bank Limited (DBBL)", // Update bank name
    branchName: "Gulshan Branch", // Update branch
    routingNumber: "XXXXXXXXX", // Update routing number
  },
]
```

### 2. MongoDB Index (Optional but Recommended)
Create indexes for better performance:

```javascript
// In MongoDB shell or Compass
db.invoices.createIndex({ "invoiceNumber": 1 }, { unique: true })
db.invoices.createIndex({ "bookingId": 1 })
db.invoices.createIndex({ "clientId": 1 })
db.invoices.createIndex({ "status": 1 })
db.invoices.createIndex({ "createdAt": -1 })
```

### 3. Test the System

#### Step 1: Submit a Test Booking
1. Go to any service page (e.g., `/services/web-development`)
2. Scroll to booking form
3. Fill in details and submit
4. An invoice will be automatically created
5. You'll be redirected to the invoice page

#### Step 2: Check Admin Dashboard
1. Login to admin panel `/admin/login`
2. Go to "Invoices" in the navigation
3. You should see the new invoice with status "Unpaid"
4. Also check "Bookings" - the booking should have an "Invoice" button

#### Step 3: Record a Payment
1. In Admin > Invoices, click "Record Payment" on the invoice
2. Enter payment details:
   - Amount (can be partial or full)
   - Payment method (bKash/Nagad/Bank)
   - Transaction ID
   - Milestone (if applicable)
3. Submit
4. Invoice status should update to "Partial" or "Paid"

#### Step 4: Client View
1. Go to client dashboard `/client/dashboard`
2. The booking should show "View Invoice & Payment Details" button
3. Click to view the invoice with:
   - Payment status
   - Milestones
   - Payment methods
   - Payment history

## 🎯 Key Features

### ✅ Automatic Invoice Generation
- Invoices are created automatically when a booking is submitted
- No manual intervention needed

### 💰 Milestone-Based Payments
- Services with process steps get milestone-based invoices
- Example: 5-step web development service = 5 payment milestones
- Clients can pay after each milestone or pay in full

### 📊 Admin Dashboard
- View all invoices
- Filter by status (Unpaid, Partial, Paid)
- Search by invoice number, client, or service
- Record payments with transaction tracking
- Real-time revenue stats

### 👤 Client Portal
- View invoices from dashboard
- See payment methods (bKash, Nagad, Bank details)
- Track milestone progress
- View payment history
- Download/print invoice

## 📋 Workflow Summary

```
1. Client submits booking form
   ↓
2. System creates booking in database
   ↓
3. System automatically creates invoice with:
   - Status: "Unpaid"
   - Milestones from service process steps
   - Payment methods (bKash, Nagad, Bank)
   ↓
4. Client receives invoice link
   ↓
5. Client makes payment via bKash/Nagad/Bank
   ↓
6. Admin records payment in system
   ↓
7. Invoice status updates (Unpaid → Partial → Paid)
   ↓
8. Booking status updates to "Paid"
   ↓
9. Service work begins
```

## 🔧 Customization

### Change Due Date Period
Default is 30 days. Edit `lib/payment-config.ts`:
```typescript
export function calculateDueDate(issueDate: Date = new Date(), daysFromIssue: number = 30)
// Change 30 to your preferred number of days
```

### Modify Invoice Terms
Edit `DEFAULT_INVOICE_TERMS` in `lib/payment-config.ts`

### Currency Support
Invoices support both USD and BDT. The system automatically detects currency from package price format:
- `$500` = USD
- `৳50,000` = BDT

## 🚨 Important Notes

1. **Payment Methods**: Update the placeholder account numbers in `lib/payment-config.ts` before going live
2. **Service Steps**: Ensure your services have `process` steps defined for milestone-based invoicing
3. **Admin Access**: Only admins can record payments
4. **Client Privacy**: Clients can only view their own invoices

## 📞 Support

If you encounter any issues:
1. Check `INVOICE_SYSTEM_README.md` for detailed documentation
2. Verify MongoDB connection
3. Check browser console for errors
4. Verify all environment variables are set

## 🎉 You're Ready!

The invoice system is now fully integrated and ready to use. Every new booking will automatically generate an invoice with payment tracking.
