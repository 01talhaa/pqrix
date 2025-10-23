"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, FileText, Search, Eye, DollarSign, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { InvoiceDocument } from "@/lib/models/Invoice"
import { InvoiceDisplay } from "@/components/invoice-display"
import { formatCurrency } from "@/lib/payment-config"

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDocument | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [recordingPayment, setRecordingPayment] = useState(false)
  const { toast } = useToast()

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "",
    transactionId: "",
    milestoneId: "",
    notes: "",
  })

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (data.success) {
        setInvoices(data.data || [])
        setFilteredInvoices(data.data || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch invoices",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching invoices",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  // Filter invoices
  useEffect(() => {
    let filtered = invoices

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [searchQuery, statusFilter, invoices])

  // Record payment
  const handleRecordPayment = async () => {
    if (!selectedInvoice || !paymentForm.amount || !paymentForm.method) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setRecordingPayment(true)
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/invoices/${selectedInvoice.id}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...paymentForm,
          amount: parseFloat(paymentForm.amount),
          verifiedBy: "Admin",
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Show success with milestone info if applicable
        const milestone = selectedInvoice.milestones.find(m => m.id === paymentForm.milestoneId)
        const successMessage = milestone 
          ? `Payment recorded for ${milestone.name}`
          : "Payment recorded successfully"
        
        toast({
          title: "Success",
          description: successMessage,
        })
        
        // Reset form
        setPaymentForm({
          amount: "",
          method: "",
          transactionId: "",
          milestoneId: "",
          notes: "",
        })
        
        // Refresh invoices list
        await fetchInvoices()
        
        // Update the selected invoice with fresh data
        if (data.data) {
          setSelectedInvoice(data.data)
        }
        
        // Close dialog after a brief delay to show updated invoice
        setTimeout(() => {
          setPaymentDialogOpen(false)
        }, 500)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to record payment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error recording payment:", error)
      toast({
        title: "Error",
        description: "An error occurred while recording payment",
        variant: "destructive",
      })
    } finally {
      setRecordingPayment(false)
    }
  }

  const getStatusColor = (status: InvoiceDocument["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-400"
      case "Partial":
        return "bg-yellow-500/20 text-yellow-400"
      case "Unpaid":
        return "bg-red-500/20 text-red-400"
      case "Overdue":
        return "bg-orange-500/20 text-orange-400"
      case "Cancelled":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const stats = {
    total: invoices.length,
    paid: invoices.filter((inv) => inv.status === "Paid").length,
    partial: invoices.filter((inv) => inv.status === "Partial").length,
    unpaid: invoices.filter((inv) => inv.status === "Unpaid").length,
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
    pendingRevenue: invoices.reduce((sum, inv) => sum + inv.remainingAmount, 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="text-gray-400 mt-1">Manage client invoices and payments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="liquid-glass border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="liquid-glass border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Paid Invoices</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.paid}</div>
          </CardContent>
        </Card>

        <Card className="liquid-glass border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-lime-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lime-400">
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-glass border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              ${stats.pendingRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="liquid-glass border-white/10 bg-white/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by invoice number, client, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <Card className="liquid-glass border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">All Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No invoices found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {invoice.paymentType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {invoice.clientName} • {invoice.clientEmail}
                      </p>
                      <p className="text-sm text-gray-500">{invoice.serviceName}</p>
                      
                      {/* Milestone Status Display */}
                      {invoice.milestones && invoice.milestones.length > 1 && (
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-xs text-gray-500">Milestones:</p>
                          <div className="flex gap-1">
                            {invoice.milestones.map((milestone, idx) => (
                              <Badge
                                key={milestone.id}
                                variant="outline"
                                className={`text-xs ${
                                  milestone.paymentStatus === "Paid"
                                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                                    : "bg-gray-500/20 text-gray-400 border-gray-500/50"
                                }`}
                              >
                                {idx + 1}: {milestone.paymentStatus === "Paid" ? "✓" : "○"}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="space-y-1 text-right">
                        <p className="text-sm text-gray-400">Total</p>
                        <p className="font-semibold text-white">
                          {formatCurrency(invoice.totalAmount, invoice.currency)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Paid: {formatCurrency(invoice.paidAmount, invoice.currency)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Dialog
                          open={viewDialogOpen && selectedInvoice?.id === invoice.id}
                          onOpenChange={(open) => {
                            setViewDialogOpen(open)
                            if (open) {
                              setSelectedInvoice(invoice)
                            } else {
                              setSelectedInvoice(null)
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-white/20">
                            <DialogHeader>
                              <DialogTitle className="text-white">Invoice Details</DialogTitle>
                            </DialogHeader>
                            {selectedInvoice && selectedInvoice.id === invoice.id && (
                              <InvoiceDisplay 
                                invoice={selectedInvoice} 
                                key={`${selectedInvoice.id}-${selectedInvoice.updatedAt}`}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        {invoice.status !== "Paid" && invoice.status !== "Cancelled" && (
                          <Dialog
                            open={paymentDialogOpen && selectedInvoice?.id === invoice.id}
                            onOpenChange={(open) => {
                              setPaymentDialogOpen(open)
                              if (open) {
                                setSelectedInvoice(invoice)
                              } else {
                                setSelectedInvoice(null)
                                // Reset form when closing
                                setPaymentForm({
                                  amount: "",
                                  method: "",
                                  transactionId: "",
                                  milestoneId: "",
                                  notes: "",
                                })
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-lime-400 text-black hover:bg-lime-300"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Record Payment
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black border-white/20">
                              <DialogHeader>
                                <DialogTitle className="text-white">Record Payment</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Record a payment for invoice {invoice.invoiceNumber}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                {/* Current Invoice Status */}
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <p className="text-xs text-gray-400 mb-2">Current Status</p>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white">Total Amount:</span>
                                    <span className="text-sm font-semibold text-white">
                                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white">Paid Amount:</span>
                                    <span className="text-sm font-semibold text-green-400">
                                      {formatCurrency(invoice.paidAmount, invoice.currency)}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-white">Remaining:</span>
                                    <span className="text-sm font-semibold text-red-400">
                                      {formatCurrency(invoice.remainingAmount, invoice.currency)}
                                    </span>
                                  </div>
                                  
                                  {/* Milestone Status */}
                                  {invoice.milestones.length > 1 && (
                                    <div className="mt-3 pt-3 border-t border-white/10">
                                      <p className="text-xs text-gray-400 mb-2">Milestone Status:</p>
                                      <div className="grid grid-cols-2 gap-2">
                                        {invoice.milestones.map((milestone, idx) => (
                                          <div
                                            key={milestone.id}
                                            className={`text-xs p-2 rounded ${
                                              milestone.paymentStatus === "Paid"
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-gray-500/20 text-gray-400"
                                            }`}
                                          >
                                            <div className="flex items-center gap-1">
                                              <span className="font-semibold">
                                                {milestone.paymentStatus === "Paid" ? "✓" : "○"}
                                              </span>
                                              <span>{milestone.name}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="amount" className="text-white">
                                    Amount *
                                  </Label>
                                  <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={paymentForm.amount}
                                    onChange={(e) =>
                                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                                    }
                                    className="bg-white/5 border-white/10 text-white"
                                  />
                                  <p className="text-xs text-gray-400">
                                    Remaining: {formatCurrency(invoice.remainingAmount, invoice.currency)}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="method" className="text-white">
                                    Payment Method *
                                  </Label>
                                  <Select
                                    value={paymentForm.method}
                                    onValueChange={(value) =>
                                      setPaymentForm({ ...paymentForm, method: value })
                                    }
                                  >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                      <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-white/10">
                                      <SelectItem value="bKash">bKash</SelectItem>
                                      <SelectItem value="Nagad">Nagad</SelectItem>
                                      <SelectItem value="Bank">Bank Transfer</SelectItem>
                                      <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {invoice.milestones.length > 1 && (
                                  <div className="space-y-2">
                                    <Label htmlFor="milestone" className="text-white">
                                      Milestone (Optional)
                                    </Label>
                                    <Select
                                      value={paymentForm.milestoneId}
                                      onValueChange={(value) =>
                                        setPaymentForm({ ...paymentForm, milestoneId: value })
                                      }
                                    >
                                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Select milestone" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-900 border-white/10">
                                        {invoice.milestones.map((milestone, idx) => (
                                          <SelectItem 
                                            key={milestone.id} 
                                            value={milestone.id}
                                            disabled={milestone.paymentStatus === "Paid"}
                                          >
                                            {milestone.paymentStatus === "Paid" ? "✓ " : `${idx + 1}. `}
                                            {milestone.name} - {formatCurrency(milestone.amount, invoice.currency)}
                                            {milestone.paymentStatus === "Paid" && " (Paid)"}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-400">
                                      Select which milestone this payment is for
                                    </p>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label htmlFor="transactionId" className="text-white">
                                    Transaction ID
                                  </Label>
                                  <Input
                                    id="transactionId"
                                    placeholder="TXN123456789"
                                    value={paymentForm.transactionId}
                                    onChange={(e) =>
                                      setPaymentForm({
                                        ...paymentForm,
                                        transactionId: e.target.value,
                                      })
                                    }
                                    className="bg-white/5 border-white/10 text-white"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="notes" className="text-white">
                                    Notes
                                  </Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="Additional notes about this payment"
                                    value={paymentForm.notes}
                                    onChange={(e) =>
                                      setPaymentForm({ ...paymentForm, notes: e.target.value })
                                    }
                                    className="bg-white/5 border-white/10 text-white"
                                  />
                                </div>

                                <Button
                                  onClick={handleRecordPayment}
                                  disabled={recordingPayment}
                                  className="w-full bg-lime-400 text-black hover:bg-lime-300"
                                >
                                  {recordingPayment ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Recording...
                                    </>
                                  ) : (
                                    "Record Payment"
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
