import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const ProgramsPage = () => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    programId: '',
    bookingPrice: '',
    description: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(Date.now())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.programId || !form.bookingPrice || !form.description || !selectedFile) {
      toast.error("All fields are required, including the program image.")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('programId', form.programId)
      formData.append('bookingPrice', form.bookingPrice)
      formData.append('description', form.description)
      if (selectedFile) {
        formData.append('image', selectedFile)
      }

      await axios.post('http://localhost:5000/api/programs', formData)
      toast.success("Program added successfully")
      setForm({ name: '', programId: '', bookingPrice: '', description: '' })
      setSelectedFile(null)
      setFileInputKey(Date.now())
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add program")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Add Program</h1>
        <p className="text-muted-foreground">Create a new yoga program or session.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Program Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name</Label>
                <Input 
                  id="name" 
                  required
                  placeholder="e.g. Morning Hatha Yoga" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programId">Program ID</Label>
                <Input 
                  id="programId" 
                  required
                  placeholder="e.g. PROG-001" 
                  value={form.programId}
                  onChange={(e) => setForm({...form, programId: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Booking Price (₹)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  required
                  placeholder="0.00" 
                  value={form.bookingPrice}
                  onChange={(e) => setForm({...form, bookingPrice: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  required
                  placeholder="Describe the yoga program..." 
                  className="min-h-[100px]"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Program Image</Label>
                <Input 
                  id="image" 
                  key={fileInputKey}
                  type="file" 
                  required
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Program"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProgramsPage
