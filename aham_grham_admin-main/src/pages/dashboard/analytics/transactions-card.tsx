"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// ✅ Define the shape of your form data
interface BillingFormData {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  zipCode: string
  saveInfo: boolean
}

export default function CheckoutBillingForm() {
  const [formData, setFormData] = useState<BillingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    saveInfo: false,
  })

  // ✅ Use React.ChangeEvent with HTMLInputElement instead of 'any'
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // ✅ Handle checkbox changes separately
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, saveInfo: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Submitted:", formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Address</CardTitle>
        <CardDescription>Fill in your shipping and billing information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input id="zipCode" value={formData.zipCode} onChange={handleChange} required />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="saveInfo" 
              checked={formData.saveInfo} 
              onCheckedChange={handleCheckboxChange} 
            />
            <Label htmlFor="saveInfo" className="text-sm font-normal">
              Save this information for next time
            </Label>
          </div>

          <Button type="submit" className="w-full">Continue to Checkout</Button>
        </form>
      </CardContent>
    </Card>
  )
}