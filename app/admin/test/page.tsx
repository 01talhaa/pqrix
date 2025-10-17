"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, Loader2, Database, Cloud, Upload } from "lucide-react"
import { toast } from "sonner"

interface TestResult {
  name: string
  status: "idle" | "running" | "success" | "error"
  message: string
  duration?: number
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "MongoDB Connection", status: "idle", message: "Not tested" },
    { name: "Cloudinary Connection", status: "idle", message: "Not tested" },
    { name: "Image Upload", status: "idle", message: "Not tested" },
    { name: "Project Creation", status: "idle", message: "Not tested" },
    { name: "Project Retrieval", status: "idle", message: "Not tested" },
    { name: "Project Deletion", status: "idle", message: "Not tested" },
  ])
  const [testImage, setTestImage] = useState<File | null>(null)
  const [testProjectId, setTestProjectId] = useState<string>("")

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests((prev) =>
      prev.map((test) => (test.name === name ? { ...test, ...updates } : test))
    )
  }

  // Test 1: MongoDB Connection
  const testMongoConnection = async () => {
    const startTime = Date.now()
    updateTest("MongoDB Connection", { status: "running", message: "Testing..." })

    try {
      const response = await fetch("/api/test/mongodb")
      const data = await response.json()
      const duration = Date.now() - startTime

      if (data.success) {
        updateTest("MongoDB Connection", {
          status: "success",
          message: `Connected successfully (${duration}ms)`,
          duration,
        })
        toast.success("MongoDB connection successful!")
      } else {
        updateTest("MongoDB Connection", {
          status: "error",
          message: data.error || "Connection failed",
          duration,
        })
        toast.error("MongoDB connection failed")
      }
    } catch (error) {
      updateTest("MongoDB Connection", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
      toast.error("MongoDB test error")
    }
  }

  // Test 2: Cloudinary Connection
  const testCloudinaryConnection = async () => {
    const startTime = Date.now()
    updateTest("Cloudinary Connection", { status: "running", message: "Testing..." })

    try {
      const response = await fetch("/api/test/cloudinary")
      const data = await response.json()
      const duration = Date.now() - startTime

      if (data.success) {
        updateTest("Cloudinary Connection", {
          status: "success",
          message: `Connected successfully (${duration}ms)`,
          duration,
        })
        toast.success("Cloudinary connection successful!")
      } else {
        updateTest("Cloudinary Connection", {
          status: "error",
          message: data.error || "Connection failed",
          duration,
        })
        toast.error("Cloudinary connection failed")
      }
    } catch (error) {
      updateTest("Cloudinary Connection", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
      toast.error("Cloudinary test error")
    }
  }

  // Test 3: Image Upload
  const testImageUpload = async () => {
    if (!testImage) {
      toast.error("Please select an image first")
      return
    }

    const startTime = Date.now()
    updateTest("Image Upload", { status: "running", message: "Uploading..." })

    try {
      const formData = new FormData()
      formData.append("files", testImage)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      const duration = Date.now() - startTime

      if (data.success) {
        updateTest("Image Upload", {
          status: "success",
          message: `Uploaded successfully (${duration}ms) - ${data.data[0]}`,
          duration,
        })
        toast.success("Image uploaded to Cloudinary!")
      } else {
        updateTest("Image Upload", {
          status: "error",
          message: data.error || "Upload failed",
          duration,
        })
        toast.error("Image upload failed")
      }
    } catch (error) {
      updateTest("Image Upload", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
      toast.error("Image upload test error")
    }
  }

  // Test 4: Project Creation
  const testProjectCreation = async () => {
    const startTime = Date.now()
    updateTest("Project Creation", { status: "running", message: "Creating..." })

    try {
      const testProject = {
        title: `Test Project ${Date.now()}`,
        category: "Test Category",
        description: "This is a test project created by the test suite",
        client: "Test Client",
        duration: 4,
        budget: "৳10,000 - ৳20,000",
        status: "In Progress",
        images: ["https://via.placeholder.com/800x600"],
        tags: ["test", "automated"],
        deliverables: ["Test deliverable"],
        results: ["Test result"],
        metrics: [{ label: "Test Metric", value: "100%" }],
        challenges: ["Test challenge"],
        solutions: ["Test solution"],
        technologies: ["Test Tech"],
        timeline: [{ phase: "Test Phase", duration: "1 week", description: "Test description" }],
        awards: [],
        links: [],
        testimonial: {
          quote: "Test quote",
          author: "Test Author",
          role: "Test Role",
          company: "Test Company",
          avatar: "https://via.placeholder.com/100",
        },
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testProject),
      })
      const data = await response.json()
      const duration = Date.now() - startTime

      if (data.success) {
        setTestProjectId(data.data._id)
        updateTest("Project Creation", {
          status: "success",
          message: `Created successfully (${duration}ms) - ID: ${data.data._id}`,
          duration,
        })
        toast.success("Test project created!")
      } else {
        updateTest("Project Creation", {
          status: "error",
          message: data.error || "Creation failed",
          duration,
        })
        toast.error("Project creation failed")
      }
    } catch (error) {
      updateTest("Project Creation", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
      toast.error("Project creation test error")
    }
  }

  // Test 5: Project Retrieval
  const testProjectRetrieval = async () => {
    if (!testProjectId) {
      toast.error("Please create a test project first")
      return
    }

    const startTime = Date.now()
    updateTest("Project Retrieval", { status: "running", message: "Fetching..." })

    try {
      const response = await fetch(`/api/projects/${testProjectId}`)
      const data = await response.json()
      const duration = Date.now() - startTime

      if (data.success) {
        updateTest("Project Retrieval", {
          status: "success",
          message: `Retrieved successfully (${duration}ms) - "${data.data.title}"`,
          duration,
        })
        toast.success("Test project retrieved!")
      } else {
        updateTest("Project Retrieval", {
          status: "error",
          message: data.error || "Retrieval failed",
          duration,
        })
        toast.error("Project retrieval failed")
      }
    } catch (error) {
      updateTest("Project Retrieval", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
      toast.error("Project retrieval test error")
    }
  }

  // Test 6: Project Deletion
  const testProjectDeletion = async () => {
    if (!testProjectId) {
      toast.error("Please create a test project first")
      return
    }

    const startTime = Date.now()
    updateTest("Project Deletion", { status: "running", message: "Deleting..." })

    try {
      const response = await fetch(`/api/projects/${testProjectId}`, {
        method: "DELETE",
      })
      const data = await response.json()
      const duration = Date.now() - startTime

      if (data.success) {
        updateTest("Project Deletion", {
          status: "success",
          message: `Deleted successfully (${duration}ms)`,
          duration,
        })
        toast.success("Test project deleted!")
        setTestProjectId("")
      } else {
        updateTest("Project Deletion", {
          status: "error",
          message: data.error || "Deletion failed",
          duration,
        })
        toast.error("Project deletion failed")
      }
    } catch (error) {
      updateTest("Project Deletion", {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
      toast.error("Project deletion test error")
    }
  }

  // Run all tests
  const runAllTests = async () => {
    await testMongoConnection()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await testCloudinaryConnection()
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (testImage) {
      await testImageUpload()
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    await testProjectCreation()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await testProjectRetrieval()
    await new Promise((resolve) => setTimeout(resolve, 500))
    await testProjectDeletion()
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "running":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Tests</h1>
        <p className="text-muted-foreground mt-2">
          Test MongoDB, Cloudinary, and CRUD operations
        </p>
      </div>

      <div className="grid gap-6">
        {/* Image Upload Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Test Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="testImage">Select an image to test upload</Label>
                <Input
                  id="testImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTestImage(e.target.files?.[0] || null)}
                  className="mt-2"
                />
              </div>
              {testImage && (
                <div className="text-sm text-muted-foreground">
                  {testImage.name} ({(testImage.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Run All Tests */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={runAllTests} size="lg" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Run All Tests
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test) => (
                <div
                  key={test.name}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-muted-foreground break-all">
                        {test.message}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (test.name === "MongoDB Connection") testMongoConnection()
                      if (test.name === "Cloudinary Connection") testCloudinaryConnection()
                      if (test.name === "Image Upload") testImageUpload()
                      if (test.name === "Project Creation") testProjectCreation()
                      if (test.name === "Project Retrieval") testProjectRetrieval()
                      if (test.name === "Project Deletion") testProjectDeletion()
                    }}
                    disabled={test.status === "running"}
                  >
                    {test.status === "running" ? "Testing..." : "Run"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {testProjectId && (
          <Card className="border-blue-500">
            <CardContent className="pt-6">
              <div className="text-sm">
                <strong>Test Project ID:</strong> {testProjectId}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
