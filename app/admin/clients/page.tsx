"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ClientDocument, ClientProject } from "@/lib/models/Client"
import { Search, Plus, Edit, Trash2, Users } from "lucide-react"
import { toast } from "sonner"

export default function AdminClientsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [clients, setClients] = useState<Omit<ClientDocument, "password" | "refreshToken">[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [projectForm, setProjectForm] = useState<ClientProject>({
    projectId: "",
    projectTitle: "",
    status: "Pending",
    progress: 0,
    bookedDate: new Date().toISOString().split("T")[0],
    timeline: [],
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
    } else {
      fetchClients()
    }
  }, [isAuthenticated, user, router])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      const data = await response.json()
      if (data.success) {
        setClients(data.data)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async () => {
    if (!selectedClient) return

    try {
      const response = await fetch("/api/clients/update-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: selectedClient,
          project: projectForm,
        }),
      })

      if (response.ok) {
        toast.success("Project updated successfully")
        setProjectDialogOpen(false)
        fetchClients()
        resetProjectForm()
      } else {
        toast.error("Failed to update project")
      }
    } catch (error) {
      toast.error("Error updating project")
    }
  }

  const handleDeleteProject = async (clientId: string, projectId: string) => {
    if (!confirm("Are you sure you want to remove this project?")) return

    try {
      const response = await fetch(
        `/api/clients/update-project?clientId=${clientId}&projectId=${projectId}`,
        { method: "DELETE" }
      )

      if (response.ok) {
        toast.success("Project removed successfully")
        fetchClients()
      } else {
        toast.error("Failed to remove project")
      }
    } catch (error) {
      toast.error("Error removing project")
    }
  }

  const resetProjectForm = () => {
    setProjectForm({
      projectId: "",
      projectTitle: "",
      status: "Pending",
      progress: 0,
      bookedDate: new Date().toISOString().split("T")[0],
      timeline: [],
    })
  }

  const addTimelinePhase = () => {
    setProjectForm({
      ...projectForm,
      timeline: [
        ...projectForm.timeline,
        { phase: "", status: "Pending" },
      ],
    })
  }

  const updateTimelinePhase = (index: number, field: string, value: string) => {
    const updatedTimeline = [...projectForm.timeline]
    updatedTimeline[index] = { ...updatedTimeline[index], [field]: value }
    setProjectForm({ ...projectForm, timeline: updatedTimeline })
  }

  const removeTimelinePhase = (index: number) => {
    setProjectForm({
      ...projectForm,
      timeline: projectForm.timeline.filter((_, i) => i !== index),
    })
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Pending":
        return "bg-yellow-500"
      case "On Hold":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Management</h1>
          <p className="text-white/60 mt-2">Manage client projects and track progress</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-white border-white/20">
            <Users className="mr-2 h-4 w-4" />
            {clients.length} Clients
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white"
        />
      </div>

      {/* Clients List */}
      {loading ? (
        <div className="text-white text-center py-12">Loading clients...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-lime-400">
                    <AvatarImage src={client.image} alt={client.name} />
                    <AvatarFallback className="bg-lime-400 text-black text-lg font-semibold">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{client.name}</CardTitle>
                    <p className="text-white/60 text-sm">{client.email}</p>
                    {client.company && (
                      <p className="text-lime-400 text-sm font-medium">{client.company}</p>
                    )}
                  </div>
                  <Dialog
                    open={projectDialogOpen && selectedClient === client.id}
                    onOpenChange={(open) => {
                      setProjectDialogOpen(open)
                      if (open) {
                        setSelectedClient(client.id)
                        resetProjectForm()
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-lime-400 text-black hover:bg-lime-300"
                        onClick={() => setSelectedClient(client.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black/95 border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add/Update Project</DialogTitle>
                        <DialogDescription className="text-white/60">
                          Manage client project status and timeline
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Project ID</Label>
                            <Input
                              value={projectForm.projectId}
                              onChange={(e) =>
                                setProjectForm({ ...projectForm, projectId: e.target.value })
                              }
                              placeholder="project-id"
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Project Title</Label>
                            <Input
                              value={projectForm.projectTitle}
                              onChange={(e) =>
                                setProjectForm({ ...projectForm, projectTitle: e.target.value })
                              }
                              placeholder="Project Name"
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                              value={projectForm.status}
                              onValueChange={(value: any) =>
                                setProjectForm({ ...projectForm, status: value })
                              }
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-black/95 border-white/10">
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Progress (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={projectForm.progress}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  progress: parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Booked Date</Label>
                            <Input
                              type="date"
                              value={projectForm.bookedDate}
                              onChange={(e) =>
                                setProjectForm({ ...projectForm, bookedDate: e.target.value })
                              }
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              type="date"
                              value={projectForm.startDate || ""}
                              onChange={(e) =>
                                setProjectForm({ ...projectForm, startDate: e.target.value })
                              }
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Est. Completion</Label>
                            <Input
                              type="date"
                              value={projectForm.estimatedCompletion || ""}
                              onChange={(e) =>
                                setProjectForm({
                                  ...projectForm,
                                  estimatedCompletion: e.target.value,
                                })
                              }
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            value={projectForm.notes || ""}
                            onChange={(e) =>
                              setProjectForm({ ...projectForm, notes: e.target.value })
                            }
                            placeholder="Additional notes..."
                            className="bg-white/5 border-white/10"
                          />
                        </div>

                        {/* Timeline */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Timeline Phases</Label>
                            <Button
                              type="button"
                              size="sm"
                              onClick={addTimelinePhase}
                              className="bg-lime-400 text-black hover:bg-lime-300"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Phase
                            </Button>
                          </div>
                          {projectForm.timeline.map((phase, index) => (
                            <Card key={index} className="bg-white/5 border-white/10 p-4">
                              <div className="grid grid-cols-2 gap-3 mb-2">
                                <Input
                                  placeholder="Phase name"
                                  value={phase.phase}
                                  onChange={(e) =>
                                    updateTimelinePhase(index, "phase", e.target.value)
                                  }
                                  className="bg-white/5 border-white/10"
                                />
                                <Select
                                  value={phase.status}
                                  onValueChange={(value) =>
                                    updateTimelinePhase(index, "status", value)
                                  }
                                >
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-black/95 border-white/10">
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="date"
                                  value={phase.date || ""}
                                  onChange={(e) =>
                                    updateTimelinePhase(index, "date", e.target.value)
                                  }
                                  className="bg-white/5 border-white/10 flex-1"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeTimelinePhase(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>

                        <Button
                          onClick={handleAddProject}
                          className="w-full bg-lime-400 text-black hover:bg-lime-300"
                        >
                          Save Project
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Projects</span>
                    <span className="text-white font-medium">
                      {client.projects?.length || 0}
                    </span>
                  </div>
                  {client.projects && client.projects.length > 0 && (
                    <div className="space-y-2">
                      {client.projects.map((project, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">
                              {project.projectTitle}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getStatusColor(project.status)} text-xs`}>
                                {project.status}
                              </Badge>
                              <span className="text-xs text-white/60">
                                {project.progress}% complete
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-white hover:text-lime-400"
                              onClick={() => {
                                setSelectedClient(client.id)
                                setProjectForm(project)
                                setProjectDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                              onClick={() => handleDeleteProject(client.id, project.projectId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
