"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { InvoiceDocument, PaymentMethod } from "@/lib/models/Invoice"
import { formatCurrency } from "@/lib/payment-config"
import {
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  CreditCard,
  Building2,
  Smartphone,
  AlertCircle,
} from "lucide-react"

interface InvoiceDisplayProps {
  invoice: InvoiceDocument
  showPaymentMethods?: boolean
}

export function InvoiceDisplay({ invoice, showPaymentMethods = true }: InvoiceDisplayProps) {
  const getStatusColor = (status: InvoiceDocument["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "Partial":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "Unpaid":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "Overdue":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "Cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getPaymentIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "bKash":
      case "Nagad":
        return <Smartphone className="h-5 w-5" />
      case "Bank":
        return <Building2 className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <Card className="liquid-glass border-white/20 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-lime-400" />
              <div>
                <CardTitle className="text-2xl text-white">Invoice #{invoice.invoiceNumber}</CardTitle>
                <p className="text-sm text-gray-400 mt-1">Service Invoice</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(invoice.status)} border px-4 py-2 text-sm font-semibold`}>
              {invoice.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invoice Details */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Issue Date
              </p>
              <p className="text-sm text-white font-medium">
                {new Date(invoice.issueDate).toLocaleDateString()}
              </p>
            </div>
            {invoice.dueDate && (
              <div className="space-y-1">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due Date
                </p>
                <p className="text-sm text-white font-medium">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Payment Type
              </p>
              <p className="text-sm text-white font-medium">{invoice.paymentType}</p>
            </div>
            {invoice.paidDate && (
              <div className="space-y-1">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Paid Date
                </p>
                <p className="text-sm text-white font-medium">
                  {new Date(invoice.paidDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <Separator className="bg-white/10" />

          {/* Client & Service Info */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-lime-400 mb-3">Bill To</h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p className="font-medium text-white">{invoice.clientName}</p>
                <p>{invoice.clientEmail}</p>
                {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
                {invoice.clientCompany && <p className="text-gray-400">{invoice.clientCompany}</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-lime-400 mb-3">Service Details</h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p className="font-medium text-white">{invoice.serviceName}</p>
                <p className="text-gray-400">Package: {invoice.packageName}</p>
                <p className="text-gray-400">Price: {invoice.packagePrice}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Payment Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-lime-400">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-white font-medium">
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Paid Amount</span>
                <span className="text-green-400 font-medium">
                  {formatCurrency(invoice.paidAmount, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Remaining Amount</span>
                <span className="text-red-400 font-medium">
                  {formatCurrency(invoice.remainingAmount, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      {invoice.milestones && invoice.milestones.length > 0 && (
        <Card className="liquid-glass border-white/20 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-lime-400" />
              Payment Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoice.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-lime-400">#{index + 1}</span>
                        <h4 className="text-sm font-semibold text-white">{milestone.name}</h4>
                        <Badge
                          className={`${
                            milestone.paymentStatus === "Paid"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          } text-xs`}
                        >
                          {milestone.paymentStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{milestone.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {formatCurrency(milestone.amount, invoice.currency)}
                      </p>
                      <p className="text-xs text-gray-400">{milestone.percentage.toFixed(0)}%</p>
                    </div>
                  </div>
                  {milestone.paidAmount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Paid:</span>
                      <span className="text-green-400 font-medium">
                        {formatCurrency(milestone.paidAmount, invoice.currency)}
                      </span>
                    </div>
                  )}
                  {milestone.paidDate && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Paid Date:</span>
                      <span className="text-white">
                        {new Date(milestone.paidDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {invoice.payments && invoice.payments.length > 0 && (
        <Card className="liquid-glass border-white/20 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-lime-400" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoice.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 rounded-lg border border-white/10 bg-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-lime-400/10">
                      {getPaymentIcon(payment.method as PaymentMethod["type"])}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {formatCurrency(payment.amount, invoice.currency)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {payment.method} • {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                      {payment.transactionId && (
                        <p className="text-xs text-gray-500 mt-1">TxID: {payment.transactionId}</p>
                      )}
                    </div>
                  </div>
                  {payment.notes && (
                    <p className="text-xs text-gray-400 max-w-xs truncate">{payment.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      {showPaymentMethods && invoice.status !== "Paid" && invoice.status !== "Cancelled" && (
        <Card className="liquid-glass border-lime-400/30 bg-lime-400/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-lime-400" />
              Payment Methods
            </CardTitle>
            <p className="text-sm text-gray-400">
              You can pay using any of the following methods. Please send payment proof to confirm.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoice.paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(method.type)}
                    <h4 className="text-sm font-semibold text-white">{method.type}</h4>
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>
                      <span className="text-gray-400">Account Name:</span>{" "}
                      <span className="text-white font-medium">{method.accountName}</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Account Number:</span>{" "}
                      <span className="text-white font-mono">{method.accountNumber}</span>
                    </p>
                    {method.bankName && (
                      <p>
                        <span className="text-gray-400">Bank:</span>{" "}
                        <span className="text-white">{method.bankName}</span>
                      </p>
                    )}
                    {method.branchName && (
                      <p>
                        <span className="text-gray-400">Branch:</span>{" "}
                        <span className="text-white">{method.branchName}</span>
                      </p>
                    )}
                    {method.accountType && (
                      <p>
                        <span className="text-gray-400">Account Type:</span>{" "}
                        <span className="text-white">{method.accountType}</span>
                      </p>
                    )}
                    {method.routingNumber && (
                      <p>
                        <span className="text-gray-400">Routing Number:</span>{" "}
                        <span className="text-white font-mono">{method.routingNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms and Conditions */}
      {invoice.termsAndConditions && (
        <Card className="liquid-glass border-white/20 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-sm">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-gray-400 whitespace-pre-wrap font-sans">
              {invoice.termsAndConditions}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
