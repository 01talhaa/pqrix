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
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Package, Search, Trash2, Edit, Plus, CheckCircle2, Clock, Calendar, FileText, DollarSign, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ServiceBookingDocument } from "@/lib/models/ServiceBooking"
import { InvoiceDocument } from "@/lib/models/Invoice"

type BookingStatus = "Inquired" | "Pending" | "Paid" | "Started" | "In Progress" | "Completed" | "Cancelled"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<ServiceBookingDocument[]>([])
  const [filteredBookings, setFilteredBookings] = useState<ServiceBookingDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editingBooking, setEditingBooking] = useState<ServiceBookingDocument | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<InvoiceDocument | null>(null)
  const [loadingInvoice, setLoadingInvoice] = useState(false)
  const [savingBooking, setSavingBooking] = useState(false)
  const { toast } = useToast()

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bookings")
      const data = await response.json()

      if (data.success) {
        setBookings(data.data)
        setFilteredBookings(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch bookings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching bookings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Fetch invoice when editing booking
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!editingBooking || !editingBooking.invoiceId) {
        setEditingInvoice(null)
        return
      }

      try {
        setLoadingInvoice(true)
        const response = await fetch(`/api/invoices?bookingId=${editingBooking.id}`)
        const data = await response.json()

        if (data.success && data.data) {
          setEditingInvoice(data.data)
        } else {
          setEditingInvoice(null)
        }
      } catch (error) {
        console.error("Error fetching invoice:", error)
        setEditingInvoice(null)
      } finally {
        setLoadingInvoice(false)
      }
    }

    fetchInvoice()
  }, [editingBooking])

  // Filter bookings
  useEffect(() => {
    let filtered = bookings

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.packageName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [searchQuery, statusFilter, bookings])

  // Delete booking
  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Booking deleted successfully",
        })
        fetchBookings()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete booking",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting booking",
        variant: "destructive",
      })
    }
  }

  // Save booking updates
  const handleSaveBooking = async () => {
    if (!editingBooking) return

    try {
      setSavingBooking(true)
      
      // Update booking
      const bookingResponse = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: editingBooking.status,
          progress: editingBooking.progress,
          startDate: editingBooking.startDate,
          estimatedCompletion: editingBooking.estimatedCompletion,
          notes: editingBooking.notes,
          timeline: editingBooking.timeline,
        }),
      })

      const bookingData = await bookingResponse.json()

      if (!bookingData.success) {
        throw new Error(bookingData.error || "Failed to update booking")
      }

      // Update invoice milestones if invoice exists
      if (editingInvoice) {
        const invoiceResponse = await fetch(`/api/invoices/${editingInvoice.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            milestones: editingInvoice.milestones,
          }),
        })

        const invoiceData = await invoiceResponse.json()

        if (!invoiceData.success) {
          console.error("Failed to update invoice:", invoiceData.error)
          toast({
            title: "Warning",
            description: "Booking updated but invoice update failed",
            variant: "destructive",
          })
        }
      }

      toast({
        title: "Success",
        description: "Booking updated successfully",
      })
      setEditingBooking(null)
      setEditingInvoice(null)
      fetchBookings()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating booking",
        variant: "destructive",
      })
    } finally {
      setSavingBooking(false)
    }
  }

  // Add timeline phase
  const addTimelinePhase = () => {
    if (!editingBooking) return

    setEditingBooking({
      ...editingBooking,
      timeline: [
        ...(editingBooking.timeline || []),
        {
          phase: "",
          status: "Pending",
          date: new Date().toISOString(),
          description: "",
        },
      ],
    })
  }

  // Remove timeline phase
  const removeTimelinePhase = (index: number) => {
    if (!editingBooking) return

    const newTimeline = [...(editingBooking.timeline || [])]
    newTimeline.splice(index, 1)
    setEditingBooking({
      ...editingBooking,
      timeline: newTimeline,
    })
  }

  // Update timeline phase
  const updateTimelinePhase = (
    index: number,
    field: "phase" | "status" | "date" | "description",
    value: string
  ) => {
    if (!editingBooking) return

    const newTimeline = [...(editingBooking.timeline || [])]
    newTimeline[index] = {
      ...newTimeline[index],
      [field]: value,
    }
    setEditingBooking({
      ...editingBooking,
      timeline: newTimeline,
    })
  }

  // Toggle milestone payment status
  const toggleMilestonePayment = (milestoneId: string) => {
    if (!editingInvoice) return

    const updatedMilestones = editingInvoice.milestones.map((milestone) => {
      if (milestone.id === milestoneId) {
        const newPaymentStatus: "Paid" | "Unpaid" = milestone.paymentStatus === "Paid" ? "Unpaid" : "Paid"
        return {
          ...milestone,
          paymentStatus: newPaymentStatus,
          paidAmount: newPaymentStatus === "Paid" ? milestone.amount : 0,
          paidDate: newPaymentStatus === "Paid" ? new Date().toISOString() : undefined,
        }
      }
      return milestone
    })

    // Calculate new totals
    const newPaidAmount = updatedMilestones.reduce(
      (sum, m) => sum + m.paidAmount,
      0
    )
    const newRemainingAmount = editingInvoice.totalAmount - newPaidAmount

    // Determine invoice status
    let newStatus: "Unpaid" | "Partial" | "Paid" | "Overdue" | "Cancelled" = "Unpaid"
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

  // Update milestone status (In Progress/Completed)
  const updateMilestoneStatus = (
    milestoneId: string,
    status: "Pending" | "In Progress" | "Completed"
  ) => {
    if (!editingInvoice) return

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

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "Inquired":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "Paid":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50"
      case "Started":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "In Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "Cancelled":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === "Completed") {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    } else if (status === "In Progress") {
      return <Clock className="h-4 w-4 text-blue-500" />
    } else {
      return <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Service Bookings</h1>
          <p className="text-white/60 mt-2">Manage all service inquiries and bookings</p>
        </div>
        <Badge className="bg-lime-400/20 text-lime-400 border-lime-400/50 text-lg px-4 py-2">
          {filteredBookings.length} Booking{filteredBookings.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Filters */}
<Card className="border-white/10 bg-black/40 backdrop-blur-xl">
  <CardContent className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Label htmlFor="search" className="text-white">Search Bookings</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            id="search"
            placeholder="Search by client email, service, or package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-white placeholder:text-white/40 bg-transparent border-white/20 focus:border-lime-400"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status" className="text-white">Filter by Status</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            id="status"
            className="text-white border-white/20 bg-transparent focus:border-lime-400"
          >
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 text-white border border-white/10">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Inquired">Inquired</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Started">Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </CardContent>
</Card>


      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery || statusFilter !== "all" ? "No matching bookings" : "No bookings yet"}
            </h3>
            <p className="text-white/60 text-center">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Bookings will appear here when clients make inquiries"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg text-white">{booking.serviceTitle}</CardTitle>
                  <Badge className={getStatusColor(booking.status as BookingStatus)}>
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-purple-400 font-medium">
                  {booking.packageName} - ${booking.packagePrice}
                </p>
              </CardHeader>
              <CardContent>
                {/* Client Info */}
                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/60">Client</p>
                  <p className="text-white font-medium">{booking.clientEmail}</p>
                  {booking.whatsappMessageSent && (
                    <p className="text-xs text-green-400 mt-1 flex items-center">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      WhatsApp sent
                    </p>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Progress</span>
                    <span className="text-white font-medium">{booking.progress || 0}%</span>
                  </div>
                  <Progress value={booking.progress || 0} className="h-2" />
                </div>

                {/* Timeline Preview */}
                {booking.timeline && booking.timeline.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <h4 className="text-sm font-semibold text-white">Latest Update</h4>
                    <div className="flex items-start gap-2">
                      {getStatusIcon(booking.timeline[booking.timeline.length - 1].status)}
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          {booking.timeline[booking.timeline.length - 1].phase}
                        </p>
                        {booking.timeline[booking.timeline.length - 1].description && (
                          <p className="text-xs text-white/60 mt-1">
                            {booking.timeline[booking.timeline.length - 1].description}
                          </p>
                        )}
                        <p className="text-xs text-white/60 mt-1">
                          {booking.timeline[booking.timeline.length - 1].date 
                            ? new Date(booking.timeline[booking.timeline.length - 1].date!).toLocaleDateString()
                            : "No date set"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="text-xs text-white/60 space-y-1 mb-4">
                  <p>Booked: {new Date(booking.createdAt).toLocaleDateString()}</p>
                  {booking.startDate && <p>Started: {new Date(booking.startDate).toLocaleDateString()}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {/* View Invoice Button */}
                  {booking.invoiceId && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-lime-400/50 text-lime-400 hover:bg-lime-400/10"
                    >
                      <a href={`/client/invoices/${booking.invoiceId}`} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" />
                        Invoice
                      </a>
                    </Button>
                  )}
                  
                  <Dialog open={editingBooking?.id === booking.id} onOpenChange={(open) => {
                    if (!open) {
                      setEditingBooking(null)
                      setEditingInvoice(null)
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setEditingBooking({ ...booking })}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-black border-white/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">Edit Booking</DialogTitle>
                        <DialogDescription className="text-white/60">
                          Update booking status, progress, and timeline for {booking.serviceTitle}
                        </DialogDescription>
                      </DialogHeader>

                      {editingBooking && (
                        <div className="space-y-6">
                          {/* Status and Progress */}
                          <div className="grid grid-cols-2 gap-4">
<div>
  <Label htmlFor="edit-status" className="text-white">Status</Label>
  <Select
    value={editingBooking.status}
    onValueChange={(value) =>
      setEditingBooking({ ...editingBooking, status: value as BookingStatus })
    }
  >
    <SelectTrigger
      id="edit-status"
      className="text-white border-white/20 bg-transparent focus:border-lime-400"
    >
      <SelectValue placeholder="Select status..." />
    </SelectTrigger>
    <SelectContent className="bg-black/90 text-white border border-white/10">
      <SelectItem value="Inquired">Inquired</SelectItem>
      <SelectItem value="Pending">Pending</SelectItem>
      <SelectItem value="Paid">Paid</SelectItem>
      <SelectItem value="Started">Started</SelectItem>
      <SelectItem value="In Progress">In Progress</SelectItem>
      <SelectItem value="Completed">Completed</SelectItem>
      <SelectItem value="Cancelled">Cancelled</SelectItem>
    </SelectContent>
  </Select>
</div>

                            <div>
                              <Label htmlFor="edit-progress">Progress (%)</Label>
                              <Input
                                id="edit-progress"
                                type="number"
                                min="0"
                                max="100"
                                value={editingBooking.progress || 0}
                                onChange={(e) =>
                                  setEditingBooking({
                                    ...editingBooking,
                                    progress: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-start-date">Start Date</Label>
                              <Input
                                id="edit-start-date"
                                type="date"
                                value={
                                  editingBooking.startDate
                                    ? new Date(editingBooking.startDate).toISOString().split("T")[0]
                                    : ""
                                }
                                onChange={(e) =>
                                  setEditingBooking({
                                    ...editingBooking,
                                    startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-completion-date">Est. Completion</Label>
                              <Input
                                id="edit-completion-date"
                                type="date"
                                value={
                                  editingBooking.estimatedCompletion
                                    ? new Date(editingBooking.estimatedCompletion).toISOString().split("T")[0]
                                    : ""
                                }
                                onChange={(e) =>
                                  setEditingBooking({
                                    ...editingBooking,
                                    estimatedCompletion: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <Label htmlFor="edit-notes">Admin Notes</Label>
                            <Textarea
                              id="edit-notes"
                              value={editingBooking.notes || ""}
                              onChange={(e) =>
                                setEditingBooking({
                                  ...editingBooking,
                                  notes: e.target.value,
                                })
                              }
                              rows={3}
                            />
                          </div>

                          {/* Invoice & Payment Milestones */}
                          {editingBooking.invoiceId && (
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <Label className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4" />
                                  Payment Milestones
                                </Label>
                                {editingInvoice && (
                                  <Badge
                                    className={
                                      editingInvoice.status === "Paid"
                                        ? "bg-green-500/20 text-green-400 border-green-500/50"
                                        : editingInvoice.status === "Partial"
                                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                        : "bg-red-500/20 text-red-400 border-red-500/50"
                                    }
                                  >
                                    {editingInvoice.status}
                                  </Badge>
                                )}
                              </div>

                              {loadingInvoice ? (
                                <div className="flex items-center justify-center p-8">
                                  <Loader2 className="h-6 w-6 animate-spin text-lime-400" />
                                </div>
                              ) : editingInvoice ? (
                                <div className="space-y-4">
                                  {/* Invoice Summary */}
                                  <Card className="p-4 bg-black/60 border-white/20">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <p className="text-white/60 text-xs">Total Amount</p>
                                        <p className="text-white font-semibold">
                                          ৳{editingInvoice.totalAmount.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-white/60 text-xs">Paid</p>
                                        <p className="text-green-400 font-semibold">
                                          ৳{editingInvoice.paidAmount.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-white/60 text-xs">Remaining</p>
                                        <p className="text-red-400 font-semibold">
                                          ৳{editingInvoice.remainingAmount.toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </Card>

                                  {/* Milestones List */}
                                  {editingInvoice.milestones.map((milestone, index) => (
                                    <Card key={milestone.id} className="p-4 bg-black/60 border-white/20">
                                      <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Label className="text-xs text-white">
                                                Step {index + 1}: {milestone.name}
                                              </Label>
                                              <Badge
                                                variant="outline"
                                                className={
                                                  milestone.status === "Completed"
                                                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                                                    : milestone.status === "In Progress"
                                                    ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                                                    : "bg-gray-500/20 text-gray-400 border-gray-500/50"
                                                }
                                              >
                                                {milestone.status}
                                              </Badge>
                                            </div>
                                            <p className="text-xs text-white/60">{milestone.description}</p>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <Label className="text-xs text-white/60">Amount</Label>
                                            <p className="text-sm text-white font-semibold">
                                              ৳{milestone.amount.toLocaleString()} ({milestone.percentage}%)
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-xs text-white/60">Payment Status</Label>
                                            <Button
                                              type="button"
                                              variant={milestone.paymentStatus === "Paid" ? "default" : "outline"}
                                              size="sm"
                                              className={
                                                milestone.paymentStatus === "Paid"
                                                  ? "w-full bg-green-500 hover:bg-green-600 text-white"
                                                  : "w-full"
                                              }
                                              onClick={() => toggleMilestonePayment(milestone.id)}
                                            >
                                              {milestone.paymentStatus === "Paid" ? (
                                                <>
                                                  <Check className="mr-2 h-4 w-4" />
                                                  Paid
                                                </>
                                              ) : (
                                                <>
                                                  <X className="mr-2 h-4 w-4" />
                                                  Unpaid
                                                </>
                                              )}
                                            </Button>
                                          </div>
                                        </div>

                                        <div>
                                          <Label className="text-xs text-white/60">Milestone Status</Label>
                                          <Select
                                            value={milestone.status}
                                            onValueChange={(value: "Pending" | "In Progress" | "Completed") =>
                                              updateMilestoneStatus(milestone.id, value)
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Pending">Pending</SelectItem>
                                              <SelectItem value="In Progress">In Progress</SelectItem>
                                              <SelectItem value="Completed">Completed</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {milestone.paidDate && (
                                          <p className="text-xs text-green-400">
                                            Paid on {new Date(milestone.paidDate).toLocaleDateString()}
                                          </p>
                                        )}
                                      </div>
                                    </Card>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-white/60 text-center py-4">
                                  No invoice found for this booking
                                </p>
                              )}
                            </div>
                          )}

                          {/* Timeline */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <Label>Timeline</Label>
                              <Button type="button" variant="outline" size="sm" onClick={addTimelinePhase}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Phase
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {editingBooking.timeline?.map((phase, index) => (
                                <Card key={index} className="p-4 bg-black/60 border-white/20">
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                      <Label className="text-xs text-white">Phase {index + 1}</Label>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeTimelinePhase(index)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-400" />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <Label className="text-xs text-white">Phase Name</Label>
                                        <Input
                                          value={phase.phase}
                                          onChange={(e) => updateTimelinePhase(index, "phase", e.target.value)}
                                          placeholder="e.g., Design Review"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs text-white">Status</Label>
                                        <Select
                                          value={phase.status}
                                          onValueChange={(value) => updateTimelinePhase(index, "status", value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div>
                                      <Label className="text-xs text-white">Date</Label>
                                      <Input
                                        type="date"
                                        value={
                                          phase.date
                                            ? new Date(phase.date).toISOString().split("T")[0]
                                            : ""
                                        }
                                        onChange={(e) =>
                                          updateTimelinePhase(
                                            index,
                                            "date",
                                            e.target.value ? new Date(e.target.value).toISOString() : ""
                                          )
                                        }
                                      />
                                    </div>

                                    <div>
                                      <Label className="text-xs text-white">Description</Label>
                                      <Textarea
                                        value={phase.description || ""}
                                        onChange={(e) => updateTimelinePhase(index, "description", e.target.value)}
                                        placeholder="Optional description"
                                        rows={2}
                                      />
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Save Button */}
                          <div className="flex justify-end gap-3 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingBooking(null)
                                setEditingInvoice(null)
                              }}
                              disabled={savingBooking}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleSaveBooking} disabled={savingBooking}>
                              {savingBooking ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
