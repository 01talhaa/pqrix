"use client"

import type React from "react"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDataStore, type Service } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { services, updateService, addService } = useDataStore()
  const [loading, setLoading] = useState(false)

  const isNew = resolvedParams.id === "new"
  const existingService = services.find((s) => s.id === resolvedParams.id)

  const [formData, setFormData] = useState<Omit<Service, "id">>({
    title: "",
    slug: "",
    description: "",
    icon: "Box",
    features: [""],
    image: "",
    detailedDescription: "",
    process: [{ step: 1, title: "", description: "" }],
    packages: [{ name: "Basic", price: "$0", features: [""], deliveryTime: "" }],
    stats: [{ label: "", value: "" }],
  })

  useEffect(() => {
    if (existingService) {
      setFormData(existingService)
    }
  }, [existingService])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Generate slug from title if empty
    if (!formData.slug) {
      formData.slug = formData.title.toLowerCase().replace(/\s+/g, "-")
    }

    if (isNew) {
      addService(formData)
    } else {
      updateService(resolvedParams.id, formData)
    }

    setLoading(false)
    router.push("/admin/services")
  }

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] })
  }

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const addProcessStep = () => {
    setFormData({
      ...formData,
      process: [...formData.process, { step: formData.process.length + 1, title: "", description: "" }],
    })
  }

  const removeProcessStep = (index: number) => {
    const newProcess = formData.process.filter((_, i) => i !== index)
    setFormData({ ...formData, process: newProcess })
  }

  const updateProcessStep = (index: number, field: "title" | "description", value: string) => {
    const newProcess = [...formData.process]
    newProcess[index][field] = value
    setFormData({ ...formData, process: newProcess })
  }

  const addPackage = () => {
    setFormData({
      ...formData,
      packages: [...formData.packages, { name: "", price: "$0", features: [""], deliveryTime: "" }],
    })
  }

  const removePackage = (index: number) => {
    const newPackages = formData.packages.filter((_, i) => i !== index)
    setFormData({ ...formData, packages: newPackages })
  }

  const updatePackage = (index: number, field: keyof Service["packages"][0], value: string | string[]) => {
    const newPackages = [...formData.packages]
    newPackages[index] = { ...newPackages[index], [field]: value }
    setFormData({ ...formData, packages: newPackages })
  }

  const addPackageFeature = (packageIndex: number) => {
    const newPackages = [...formData.packages]
    newPackages[packageIndex].features.push("")
    setFormData({ ...formData, packages: newPackages })
  }

  const removePackageFeature = (packageIndex: number, featureIndex: number) => {
    const newPackages = [...formData.packages]
    newPackages[packageIndex].features = newPackages[packageIndex].features.filter((_, i) => i !== featureIndex)
    setFormData({ ...formData, packages: newPackages })
  }

  const updatePackageFeature = (packageIndex: number, featureIndex: number, value: string) => {
    const newPackages = [...formData.packages]
    newPackages[packageIndex].features[featureIndex] = value
    setFormData({ ...formData, packages: newPackages })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/services">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{isNew ? "Add New Service" : "Edit Service"}</h1>
            <p className="text-white/60 mt-2">Fill in the service details</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Service"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated from title"
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detailedDescription">Detailed Description</Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                rows={5}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., Box, Palette, Video"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/service-image.jpg"
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Features</CardTitle>
              <Button type="button" size="sm" onClick={addFeature}>
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Feature description"
                  className="bg-white/5 border-white/10"
                />
                <Button type="button" size="icon" variant="destructive" onClick={() => removeFeature(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Process Steps */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Process Steps</CardTitle>
              <Button type="button" size="sm" onClick={addProcessStep}>
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.process.map((step, index) => (
              <div key={index} className="p-4 border border-white/10 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Step {step.step}</span>
                  <Button type="button" size="sm" variant="destructive" onClick={() => removeProcessStep(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={step.title}
                  onChange={(e) => updateProcessStep(index, "title", e.target.value)}
                  placeholder="Step title"
                  className="bg-white/5 border-white/10"
                />
                <Textarea
                  value={step.description}
                  onChange={(e) => updateProcessStep(index, "description", e.target.value)}
                  placeholder="Step description"
                  className="bg-white/5 border-white/10"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Packages */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Pricing Packages</CardTitle>
              <Button type="button" size="sm" onClick={addPackage}>
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.packages.map((pkg, packageIndex) => (
              <div key={packageIndex} className="p-4 border border-white/10 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Package {packageIndex + 1}</span>
                  <Button type="button" size="sm" variant="destructive" onClick={() => removePackage(packageIndex)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={pkg.name}
                    onChange={(e) => updatePackage(packageIndex, "name", e.target.value)}
                    placeholder="Package name"
                    className="bg-white/5 border-white/10"
                  />
                  <Input
                    value={pkg.price}
                    onChange={(e) => updatePackage(packageIndex, "price", e.target.value)}
                    placeholder="$0"
                    className="bg-white/5 border-white/10"
                  />
                  <Input
                    value={pkg.deliveryTime}
                    onChange={(e) => updatePackage(packageIndex, "deliveryTime", e.target.value)}
                    placeholder="Delivery time"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Package Features</Label>
                    <Button type="button" size="sm" variant="outline" onClick={() => addPackageFeature(packageIndex)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updatePackageFeature(packageIndex, featureIndex, e.target.value)}
                        placeholder="Feature"
                        className="bg-white/5 border-white/10"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => removePackageFeature(packageIndex, featureIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
