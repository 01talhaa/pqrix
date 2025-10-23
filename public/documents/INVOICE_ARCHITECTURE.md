# Invoice System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          INVOICE & PAYMENT SYSTEM                        │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                             CLIENT FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

   1. Service Page                    2. Booking Form                  
   ┌───────────────┐                 ┌─────────────────┐               
   │               │                 │ Name, Email     │               
   │  View Service │──────────────▶ │ Phone, Package  │               
   │  Details      │                 │ Project Details │               
   │               │                 └─────────────────┘               
   └───────────────┘                          │                         
                                              │ Submit                  
                                              ▼                         
   3. Auto-Generated Invoice          4. Invoice Created               
   ┌─────────────────────────┐       ┌─────────────────────────┐      
   │ INV-2025-10-12345       │◀──────│ • Status: Unpaid        │      
   │                         │       │ • Milestones Created    │      
   │ Payment Methods:        │       │ • Linked to Booking     │      
   │ ├─ bKash: 01XXXXX      │       └─────────────────────────┘      
   │ ├─ Nagad: 01XXXXX      │                                          
   │ └─ Bank: XXXXXXX       │       5. Client Dashboard View           
   │                         │       ┌─────────────────────────┐      
   │ Milestones:             │       │ My Bookings             │      
   │ ├─ Step 1: $100 □       │       │ ┌─────────────────────┐ │      
   │ ├─ Step 2: $100 □       │       │ │ Web Development     │ │      
   │ ├─ Step 3: $100 □       │       │ │ Premium - $500      │ │      
   │ ├─ Step 4: $100 □       │       │ │                     │ │      
   │ └─ Step 5: $100 □       │       │ │ [View Invoice]      │ │      
   └─────────────────────────┘       │ └─────────────────────┘ │      
                                     └─────────────────────────┘      

┌─────────────────────────────────────────────────────────────────────────┐
│                              ADMIN FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

   1. Admin Dashboard                 2. Invoices Page                 
   ┌─────────────────────────┐       ┌─────────────────────────────┐  
   │ Navigation:             │       │ Stats:                      │  
   │ ├─ Dashboard            │       │ ├─ Total: 150 invoices     │  
   │ ├─ Bookings ────┐       │       │ ├─ Paid: 120              │  
   │ ├─ Invoices ◀───┘       │       │ ├─ Revenue: $50,000       │  
   │ ├─ Services             │       │ └─ Pending: $15,000       │  
   │ └─ ...                  │       │                             │  
   └─────────────────────────┘       │ Filters:                    │  
                                     │ ├─ Search: [________]       │  
                                     │ └─ Status: [All ▼]         │  
                                     │                             │  
                                     │ Invoice List:               │  
                                     │ ┌─────────────────────────┐ │  
                                     │ │ INV-2025-10-12345       │ │  
                                     │ │ Client: john@email.com  │ │  
                                     │ │ Status: [Unpaid]        │ │  
                                     │ │ Total: $500             │ │  
                                     │ │ Paid: $0                │ │  
                                     │ │                         │ │  
                                     │ │ [View] [Record Payment] │ │  
                                     │ └─────────────────────────┘ │  
                                     └─────────────────────────────┘  

   3. Record Payment Dialog           4. Payment Recorded          
   ┌─────────────────────────┐       ┌─────────────────────────┐  
   │ Amount: [100.00____]    │       │ Invoice Updated:        │  
   │ Method: [bKash ▼]       │       │                         │  
   │ TxID: [TXN123456___]    │       │ • Paid: $100           │  
   │ Milestone: [Step 1 ▼]   │       │ • Remaining: $400      │  
   │ Notes: [__________]     │       │ • Status: Partial      │  
   │                         │       │                         │  
   │ [Record Payment]        │       │ Milestone 1: ✓ Paid    │  
   └─────────────────────────┘       └─────────────────────────┘  

┌─────────────────────────────────────────────────────────────────────────┐
│                          DATABASE STRUCTURE                              │
└─────────────────────────────────────────────────────────────────────────┘

   serviceBookings Collection         invoices Collection              
   ┌─────────────────────────┐       ┌─────────────────────────────┐  
   │ {                       │       │ {                           │  
   │   id: "booking-xxx"     │◀──────│   bookingId: "booking-xxx"  │  
   │   clientId: "..."       │       │   invoiceNumber: "INV-..."  │  
   │   serviceId: "..."      │       │   clientEmail: "..."        │  
   │   status: "Inquired"    │       │   totalAmount: 500          │  
   │   invoiceId: "inv-xxx" ─┼──────▶│   paidAmount: 100          │  
   │   timeline: [...]       │       │   status: "Partial"         │  
   │   ...                   │       │                             │  
   │ }                       │       │   milestones: [             │  
   └─────────────────────────┘       │     {                       │  
                                     │       name: "Step 1"        │  
   services Collection               │       amount: 100            │  
   ┌─────────────────────────┐       │       paymentStatus: "Paid" │  
   │ {                       │       │     },                      │  
   │   id: "web-dev"         │       │     { ... }                 │  
   │   title: "Web Dev"      │       │   ],                        │  
   │   process: [            │       │                             │  
   │     {                   │       │   payments: [               │  
   │       step: "Step 1"    │       │     {                       │  
   │       description: "..."│       │       amount: 100           │  
   │     },                  │       │       method: "bKash"       │  
   │     { ... }             │       │       transactionId: "..."  │  
   │   ]                     │       │       milestoneId: "..."    │  
   │ }                       │       │     }                       │  
   └─────────────────────────┘       │   ],                        │  
                                     │                             │  
                                     │   paymentMethods: [...]     │  
                                     │ }                           │  
                                     └─────────────────────────────┘  

┌─────────────────────────────────────────────────────────────────────────┐
│                            API ENDPOINTS                                 │
└─────────────────────────────────────────────────────────────────────────┘

   POST /api/bookings                                                     
   ├─ Creates booking                                                     
   └─ Auto-triggers POST /api/invoices                                    
      ├─ Generates invoice number                                         
      ├─ Creates milestones from service.process                         
      ├─ Sets status: "Unpaid"                                            
      └─ Links invoice to booking                                         

   GET /api/invoices?clientId=xxx                                         
   └─ Returns client's invoices                                           

   GET /api/invoices?id=xxx                                               
   └─ Returns specific invoice                                            

   POST /api/invoices/{id}/payments                                       
   ├─ Records payment                                                     
   ├─ Updates paidAmount                                                  
   ├─ Updates invoice status                                              
   ├─ Marks milestone as paid (if specified)                             
   └─ Updates booking status & timeline                                   

   GET /api/invoices/{id}/payments                                        
   └─ Returns payment history                                             

┌─────────────────────────────────────────────────────────────────────────┐
│                          STATUS TRANSITIONS                              │
└─────────────────────────────────────────────────────────────────────────┘

   Invoice Status Flow:                                                   
                                                                          
   ┌─────────┐                                                           
   │ Unpaid  │  ← Initial status when invoice created                    
   └────┬────┘                                                           
        │                                                                 
        │ Partial payment received                                       
        ▼                                                                 
   ┌─────────┐                                                           
   │ Partial │  ← Some amount paid, but not full                         
   └────┬────┘                                                           
        │                                                                 
        │ Full payment received                                          
        ▼                                                                 
   ┌─────────┐                                                           
   │  Paid   │  ← All milestones paid / full amount received             
   └─────────┘                                                           
                                                                          
   Optional Statuses:                                                     
   ┌─────────┐  ← Payment past due date                                 
   │ Overdue │                                                           
   └─────────┘                                                           
                                                                          
   ┌──────────┐  ← Invoice cancelled                                    
   │Cancelled │                                                           
   └──────────┘                                                           

┌─────────────────────────────────────────────────────────────────────────┐
│                         PAYMENT FLOW DIAGRAM                             │
└─────────────────────────────────────────────────────────────────────────┘

   Full Payment Option:                                                   
   ┌────────────────────────────────────────────────────────────────┐   
   │ Client pays full $500 via bKash                                │   
   └─────────────────────┬──────────────────────────────────────────┘   
                         │                                               
                         ▼                                               
   ┌────────────────────────────────────────────────────────────────┐   
   │ Admin records: Amount=$500, Method=bKash, TxID=XXX            │   
   └─────────────────────┬──────────────────────────────────────────┘   
                         │                                               
                         ▼                                               
   ┌────────────────────────────────────────────────────────────────┐   
   │ System updates:                                                │   
   │ • Invoice status: Unpaid → Paid                               │   
   │ • Booking status: Inquired → Paid                             │   
   │ • All milestones marked as paid                               │   
   └────────────────────────────────────────────────────────────────┘   

   Milestone Payment Option:                                             
   ┌────────────────────────────────────────────────────────────────┐   
   │ Service has 5 steps ($100 each)                                │   
   └─────────────────────┬──────────────────────────────────────────┘   
                         │                                               
                         ▼                                               
   ┌────────────────────────────────────────────────────────────────┐   
   │ Milestone 1 completed → Client pays $100                      │   
   └─────────────────────┬──────────────────────────────────────────┘   
                         │                                               
                         ▼                                               
   ┌────────────────────────────────────────────────────────────────┐   
   │ Admin records: Amount=$100, Milestone=Step1                   │   
   └─────────────────────┬──────────────────────────────────────────┘   
                         │                                               
                         ▼                                               
   ┌────────────────────────────────────────────────────────────────┐   
   │ System updates:                                                │   
   │ • Invoice status: Unpaid → Partial                            │   
   │ • Milestone 1: Paid ✓                                         │   
   │ • Remaining milestones: Unpaid                                │   
   │ • Booking timeline: "Step 1 Payment Received"                 │   
   └────────────────────────────────────────────────────────────────┘   
                         │                                               
                         │ Repeat for each milestone...                  
                         │                                               
                         ▼                                               
   ┌────────────────────────────────────────────────────────────────┐   
   │ All 5 milestones paid → Invoice status: Paid                  │   
   └────────────────────────────────────────────────────────────────┘   
```
