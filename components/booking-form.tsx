"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface BookingFormProps {
  serviceId: string
  serviceName: string
  packages: Array<{ name: string; price: string }>
}

export function BookingForm({ serviceId, serviceName, packages }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    package: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Generate unique client ID
      const clientId = `client-${Date.now()}-${Math.random().toString(36).substring(7)}`

      // Create WhatsApp message
      const whatsappMessage = `
New Service Booking Request

Service: ${serviceName}
Package: ${formData.package}

Client Details:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone || "N/A"}
- Company: ${formData.company || "N/A"}

Project Details:
${formData.message}

Please review this booking in the admin dashboard.
      `.trim()

      // Create booking
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          serviceId,
          serviceTitle: serviceName,
          packageName: formData.package,
          packagePrice: packages.find((p) => p.name === formData.package)?.price || "N/A",
          whatsappMessage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Booking Request Received!",
          description: "We've created your invoice. Check your email for details and payment instructions.",
          duration: 5000,
        })

        // If invoice was created, show it to the user
        if (data.data.invoiceId) {
          setTimeout(() => {
            window.open(`/client/invoices/${data.data.invoiceId}`, "_blank")
          }, 1000)
        }

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          package: "",
          message: "",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit booking request",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Full Name *
          </Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500"
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-white">
            Company Name
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500"
            placeholder="Your Company"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="package" className="text-white">
          Select Package *
        </Label>
        <Select required value={formData.package} onValueChange={(value) => handleChange("package", value)}>
          <SelectTrigger className="liquid-glass border-white/20 bg-white/5 text-white">
            <SelectValue placeholder="Choose a package" />
          </SelectTrigger>
          <SelectContent className="liquid-glass border-white/20 bg-gray-900 text-white">
            {packages.filter(pkg => pkg.name && pkg.name.trim() !== "").map((pkg) => (
              <SelectItem key={pkg.name} value={pkg.name}>
                {pkg.name} - {pkg.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-white">
          Project Details *
        </Label>
        <Textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          className="liquid-glass border-white/20 bg-white/5 text-white placeholder:text-gray-500 min-h-[120px]"
          placeholder="Tell us about your project, timeline, and any specific requirements..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-lime-400 px-8 py-6 text-base font-semibold text-black hover:bg-lime-300"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Booking Request"
        )}
      </Button>

      <p className="text-center text-sm text-gray-400">
        By submitting this form, you agree to our terms of service and privacy policy
      </p>
    </form>
  )
}
