"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InvoiceDisplay } from "@/components/invoice-display"
import { InvoiceDocument } from "@/lib/models/Invoice"
import { Loader2, ArrowLeft, Download, MessageCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ClientInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<InvoiceDocument | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoice()
    
    // Auto-refresh invoice every 30 seconds to show payment updates
    const interval = setInterval(() => {
      fetchInvoice()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [params.id])

  const fetchInvoice = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/invoices?id=${params.id}`)
      const data = await response.json()

      if (data.success && data.data) {
        setInvoice(data.data)
      } else {
        toast({
          title: "Error",
          description: "Invoice not found",
          variant: "destructive",
        })
        router.push("/client/dashboard")
      }
    } catch (error) {
      console.error("Error fetching invoice:", error)
      toast({
        title: "Error",
        description: "Failed to load invoice",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Manual refresh function for the refresh button
  const handleRefresh = async () => {
    toast({
      title: "Refreshing",
      description: "Checking for updates...",
    })
    await fetchInvoice()
    toast({
      title: "Updated",
      description: "Invoice data refreshed",
    })
  }

  const handleContactSupport = () => {
    const message = `Hi, I have a question about my invoice ${invoice?.invoiceNumber}`
    window.open(`https://wa.me/8801401658685?text=${encodeURIComponent(message)}`, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-lime-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-white mb-4">Invoice not found</p>
          <Button asChild>
            <Link href="/client/dashboard">Go to Dashboard</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button
            asChild
            variant="ghost"
            className="text-gray-300 hover:text-white self-start"
          >
            <Link href="/client/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="icon"
              className="border-white/20 text-white hover:bg-white/10"
              title="Refresh invoice"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-lime-400 text-black hover:bg-lime-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Invoice Display */}
        <div className="max-w-5xl mx-auto">
          {/* Last Updated Info */}
          <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-gray-400">
                Last updated: {new Date(invoice.updatedAt).toLocaleString()}
              </span>
            </div>
            {invoice.milestones && invoice.milestones.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Progress:</span>
                <span className="text-sm font-semibold text-lime-400">
                  {invoice.milestones.filter(m => m.paymentStatus === "Paid").length} / {invoice.milestones.length} Milestones Paid
                </span>
              </div>
            )}
          </div>
          
          <InvoiceDisplay invoice={invoice} showPaymentMethods={true} />
        </div>

        {/* Help Section */}
        <Card className="liquid-glass border-white/20 bg-white/5 backdrop-blur-xl p-6 mt-8 max-w-5xl mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-sm text-gray-400 mb-4">
              If you have any questions about this invoice or need assistance with payment, please
              contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleContactSupport}
                className="bg-lime-400 text-black hover:bg-lime-300"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Support
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <a href="mailto:billing@pqrix.com">
                  Email: billing@pqrix.com
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
