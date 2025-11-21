"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import { JobApplicationDocument } from "@/lib/models/JobApplication"

type EnrichedApplication = JobApplicationDocument & {
  job: {
    title: string
    department: string
    location: string
    type: string
  } | null
}

export default function ApplicationsManagementPage() {
  const [applications, setApplications] = useState<EnrichedApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<EnrichedApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<EnrichedApplication | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [showAcceptConfirmDialog, setShowAcceptConfirmDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    location: "",
    type: "in-person" as "in-person" | "video" | "phone",
    meetingLink: "",
    notes: "",
  })

  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, statusFilter, searchQuery])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications?admin=true")
      const data = await response.json()
      if (data.success) {
        setApplications(data.data)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (app) =>
          app.applicantName.toLowerCase().includes(query) ||
          app.applicantEmail.toLowerCase().includes(query) ||
          app.job?.title.toLowerCase().includes(query) ||
          app.job?.department.toLowerCase().includes(query)
      )
    }

    setFilteredApplications(filtered)
  }

  const updateApplicationStatus = async (
    applicationId: string,
    status: JobApplicationDocument["status"],
    notes?: string
  ) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      })

      const data = await response.json()

      if (data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status, notes: notes || app.notes } : app
          )
        )
        
        // Show special message if applicant was accepted and added to team
        if (status === "accepted" && data.teamMemberCreated) {
          alert("✅ Application accepted successfully!\n\n🎉 Applicant has been automatically added to the team section and is now visible on the team page.")
        } else {
          alert("Status updated successfully!")
        }
      } else {
        alert(data.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    }
  }

  const scheduleInterview = async () => {
    if (!selectedApplication) return

    const notes = `Interview scheduled for ${interviewDetails.date} at ${interviewDetails.time}\nType: ${interviewDetails.type}\nLocation: ${interviewDetails.location || interviewDetails.meetingLink}\nNotes: ${interviewDetails.notes}`

    await updateApplicationStatus(selectedApplication.id, "interview-scheduled", notes)
    setShowInterviewModal(false)
    setInterviewDetails({
      date: "",
      time: "",
      location: "",
      type: "in-person",
      meetingLink: "",
      notes: "",
    })
  }

  const getStatusBadge = (status: JobApplicationDocument["status"]) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", label: "Pending" },
      reviewing: { color: "bg-blue-500", label: "Reviewing" },
      shortlisted: { color: "bg-purple-500", label: "Shortlisted" },
      "interview-scheduled": { color: "bg-cyan-500", label: "Interview Scheduled" },
      accepted: { color: "bg-green-500", label: "Accepted" },
      rejected: { color: "bg-red-500", label: "Rejected" },
    }

    const config = statusConfig[status]
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    )
  }

  const getStatusIcon = (status: JobApplicationDocument["status"]) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "interview-scheduled":
        return <Calendar className="h-4 w-4 text-cyan-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Job Applications</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and review all job applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {applications.filter((a) => a.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Shortlisted</p>
                <p className="text-2xl font-bold text-purple-500">
                  {applications.filter((a) => a.status === "shortlisted" || a.status === "interview-scheduled").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
                <p className="text-2xl font-bold text-green-500">
                  {applications.filter((a) => a.status === "accepted").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4" />
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search by name, email, job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status-filter" className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4" />
                Status Filter
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Applications ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No applications found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Job Position</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{application.applicantName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {application.applicantEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {application.job ? (
                          <div>
                            <p className="font-medium">{application.job.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {application.job.department}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{application.yearsOfExperience} years</TableCell>
                      <TableCell>
                        {new Date(application.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedApplication(application)
                              setAdminNotes(application.notes || "")
                              setShowDetailsModal(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review and manage this application
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Applicant Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600 dark:text-gray-400">Name</Label>
                      <p className="font-semibold">{selectedApplication.applicantName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600 dark:text-gray-400">Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a
                          href={`mailto:${selectedApplication.applicantEmail}`}
                          className="text-blue-500 hover:underline"
                        >
                          {selectedApplication.applicantEmail}
                        </a>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600 dark:text-gray-400">Phone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a
                          href={`tel:${selectedApplication.applicantPhone}`}
                          className="text-blue-500 hover:underline"
                        >
                          {selectedApplication.applicantPhone}
                        </a>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600 dark:text-gray-400">Experience</Label>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <p>{selectedApplication.yearsOfExperience} years</p>
                      </div>
                    </div>
                    {selectedApplication.currentCompany && (
                      <div>
                        <Label className="text-sm text-gray-600 dark:text-gray-400">Current Company</Label>
                        <p>{selectedApplication.currentCompany}</p>
                      </div>
                    )}
                    {selectedApplication.noticePeriod && (
                      <div>
                        <Label className="text-sm text-gray-600 dark:text-gray-400">Notice Period</Label>
                        <p>{selectedApplication.noticePeriod}</p>
                      </div>
                    )}
                    {selectedApplication.expectedSalary && (
                      <div>
                        <Label className="text-sm text-gray-600 dark:text-gray-400">Expected Salary</Label>
                        <p>${selectedApplication.expectedSalary.toLocaleString()}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedApplication.job && (
                      <>
                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-400">Position</Label>
                          <p className="font-semibold">{selectedApplication.job.title}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-400">Department</Label>
                          <p>{selectedApplication.job.department}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-400">Location</Label>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <p>{selectedApplication.job.location}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-400">Type</Label>
                          <Badge>{selectedApplication.job.type}</Badge>
                        </div>
                      </>
                    )}
                    <div>
                      <Label className="text-sm text-gray-600 dark:text-gray-400">Applied Date</Label>
                      <p>{new Date(selectedApplication.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600 dark:text-gray-400">Current Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resume & Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents & Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Resume/CV</Label>
                    <a
                      href={selectedApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-500 hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      View Resume
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {selectedApplication.portfolioUrl && (
                      <a
                        href={selectedApplication.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-500 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Portfolio
                      </a>
                    )}
                    {selectedApplication.linkedinUrl && (
                      <a
                        href={selectedApplication.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-500 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                    {selectedApplication.githubUrl && (
                      <a
                        href={selectedApplication.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-500 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {selectedApplication.coverLetter}
                  </p>
                </CardContent>
              </Card>

              {/* Admin Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Admin Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    placeholder="Add notes about this application..."
                    className="mb-3"
                  />
                  <Button
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, selectedApplication.status, adminNotes)
                    }}
                  >
                    Save Notes
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    updateApplicationStatus(selectedApplication.id, "reviewing")
                  }
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Mark as Reviewing
                </Button>
                <Button
                  onClick={() =>
                    updateApplicationStatus(selectedApplication.id, "shortlisted")
                  }
                  className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Shortlist
                </Button>
                <Button
                  onClick={() => {
                    setShowInterviewModal(true)
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Interview
                </Button>
                <Button
                  onClick={() => setShowAcceptConfirmDialog(true)}
                  className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Accept & Add to Team
                </Button>
                <Button
                  onClick={() =>
                    updateApplicationStatus(selectedApplication.id, "rejected")
                  }
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Set up an interview for {selectedApplication?.applicantName}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              scheduleInterview()
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interview-date">Date *</Label>
                <Input
                  id="interview-date"
                  type="date"
                  value={interviewDetails.date}
                  onChange={(e) =>
                    setInterviewDetails({ ...interviewDetails, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="interview-time">Time *</Label>
                <Input
                  id="interview-time"
                  type="time"
                  value={interviewDetails.time}
                  onChange={(e) =>
                    setInterviewDetails({ ...interviewDetails, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="interview-type">Interview Type *</Label>
              <Select
                value={interviewDetails.type}
                onValueChange={(value: any) =>
                  setInterviewDetails({ ...interviewDetails, type: value })
                }
              >
                <SelectTrigger id="interview-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {interviewDetails.type === "in-person" ? (
              <div>
                <Label htmlFor="interview-location">Location *</Label>
                <Input
                  id="interview-location"
                  value={interviewDetails.location}
                  onChange={(e) =>
                    setInterviewDetails({ ...interviewDetails, location: e.target.value })
                  }
                  placeholder="Office address or meeting room"
                  required
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="meeting-link">Meeting Link *</Label>
                <Input
                  id="meeting-link"
                  type="url"
                  value={interviewDetails.meetingLink}
                  onChange={(e) =>
                    setInterviewDetails({ ...interviewDetails, meetingLink: e.target.value })
                  }
                  placeholder="https://zoom.us/... or phone number"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="interview-notes">Additional Notes</Label>
              <Textarea
                id="interview-notes"
                value={interviewDetails.notes}
                onChange={(e) =>
                  setInterviewDetails({ ...interviewDetails, notes: e.target.value })
                }
                rows={3}
                placeholder="Any special instructions or requirements..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInterviewModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                Schedule Interview
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Accept Confirmation Dialog */}
      <AlertDialog open={showAcceptConfirmDialog} onOpenChange={setShowAcceptConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              Accept Application & Add to Team
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <p>
                You are about to accept <strong>{selectedApplication?.applicantName}</strong>'s application.
              </p>
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
                  ✓ Automatic Actions:
                </p>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                  <li>Application status will be marked as "Accepted"</li>
                  <li>Applicant will be automatically added to the Team section</li>
                  <li>Their profile will be visible on the public Team page</li>
                  <li>You can edit their team profile details later if needed</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to proceed?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedApplication) {
                  updateApplicationStatus(selectedApplication.id, "accepted")
                  setShowAcceptConfirmDialog(false)
                }
              }}
              className="bg-green-500 hover:bg-green-600 dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-black"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Accept & Add to Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
