import { PaymentMethod } from "./models/Invoice"

// Payment methods configuration for Pqrix
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    type: "bKash",
    accountName: "Pqrix Solutions",
    accountNumber: "01XXXXXXXXX", // Replace with actual bKash number
  },
  {
    type: "Nagad",
    accountName: "Pqrix Solutions",
    accountNumber: "01XXXXXXXXX", // Replace with actual Nagad number
  },
  {
    type: "Bank",
    accountName: "Pqrix Solutions Limited",
    accountNumber: "XXXXXXXXXXXX", // Replace with actual account number
    accountType: "Current",
    bankName: "Dutch-Bangla Bank Limited (DBBL)", // Replace with actual bank
    branchName: "Gulshan Branch", // Replace with actual branch
    routingNumber: "XXXXXXXXX", // Replace with actual routing number
  },
]

// Default invoice terms and conditions
export const DEFAULT_INVOICE_TERMS = `
1. Payment Terms:
   - Full payment due within 30 days of invoice date
   - For milestone-based payments, each milestone payment is due upon milestone completion
   - Late payments may incur additional charges

2. Payment Methods:
   - bKash: Mobile banking payment
   - Nagad: Mobile banking payment
   - Bank Transfer: Direct bank transfer

3. Refund Policy:
   - Refunds are subject to the terms outlined in the service agreement
   - Milestone-based payments are non-refundable once work has commenced

4. Service Delivery:
   - Services will commence upon receipt of initial payment or first milestone payment
   - Timeline estimates are approximate and may vary based on project complexity

5. Contact:
   - For payment queries, contact: billing@pqrix.com
   - For technical queries, contact: support@pqrix.com
   - WhatsApp: https://wa.me/8801401658685
`.trim()

// Generate invoice number
export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const random = Math.floor(10000 + Math.random() * 90000) // 5 digit random number
  return `INV-${year}-${month}-${random}`
}

// Calculate due date (default 30 days from issue date)
export function calculateDueDate(issueDate: Date = new Date(), daysFromIssue: number = 30): string {
  const dueDate = new Date(issueDate)
  dueDate.setDate(dueDate.getDate() + daysFromIssue)
  return dueDate.toISOString()
}

// Parse price string to number (handles formats like "$500", "৳50,000", "500 USD")
export function parsePriceToNumber(priceString: string): number {
  // Remove currency symbols, commas, and spaces
  const cleaned = priceString.replace(/[৳$,\s]/g, "")
  
  // Extract number
  const match = cleaned.match(/[\d.]+/)
  if (match) {
    return parseFloat(match[0])
  }
  
  return 0
}

// Format currency
export function formatCurrency(amount: number, currency: string = "USD"): string {
  if (currency === "BDT") {
    return `৳${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
