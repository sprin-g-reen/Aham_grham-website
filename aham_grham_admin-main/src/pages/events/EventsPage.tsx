import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const EventsPage = () => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    eventId: '',
    bookingPrice: '',
    description: '',
    about: '',
    category: '',
    isBlog: false
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(Date.now())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isHighlight = form.category === 'Highlight'
    if (!form.name || !form.eventId || !form.category || (!isHighlight && (!form.bookingPrice || !form.about)) || !form.description || !selectedFile) {
      toast.error(`All fields are required, including Category and ${isHighlight ? 'Highlight Media' : 'Event Image'}.`)
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('eventId', form.eventId)
      formData.append('bookingPrice', form.bookingPrice)
      formData.append('description', form.description)
      formData.append('about', form.about)
      formData.append('category', form.category)
      formData.append('isBlog', String(form.isBlog))
      if (selectedFile) {
        if (isHighlight) {
          // Detect if it's a video or image
          if (selectedFile.type.startsWith('video/')) {
            formData.append('video', selectedFile)
          } else {
            formData.append('image', selectedFile)
          }
        } else {
          formData.append('image', selectedFile)
        }
      }

      await axios.post('http://localhost:5000/api/events', formData)
      toast.success("Event added successfully")
      setForm({ name: '', eventId: '', bookingPrice: '', description: '', about: '', category: '', isBlog: false })
      setSelectedFile(null)
      setFileInputKey(Date.now())
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Add Event</h1>
        <p className="text-muted-foreground">Create a new special event or meetup.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input 
                  id="name" 
                  required
                  placeholder="e.g. Summer Solstice Retreat" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventId">Event ID</Label>
                <Input 
                  id="eventId" 
                  required
                  placeholder="e.g. EVNT-001" 
                  value={form.eventId}
                  onChange={(e) => setForm({...form, eventId: e.target.value})}
                />
              </div>

              {form.category !== 'Highlight' && (
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
              )}

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  className="w-full p-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  required
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Main Event">Main Event</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Highlight">Highlight</option>
                  <option value="Upcoming Event">Upcoming Event</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea 
                  id="description" 
                  required
                  placeholder="A brief summary of the event..." 
                  className="min-h-[80px]"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                />
              </div>

              {form.category !== 'Highlight' && (
                <div className="space-y-2">
                  <Label htmlFor="about">What it is all about</Label>
                  <Textarea 
                    id="about" 
                    required
                    placeholder="Provide detailed information about the event..." 
                    className="min-h-[120px]"
                    value={form.about}
                    onChange={(e) => setForm({...form, about: e.target.value})}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="media">
                  {form.category === 'Highlight' ? 'Highlight Media (Image or Video)' : 'Event Image'}
                </Label>
                <Input 
                  id="media" 
                  key={fileInputKey}
                  type="file" 
                  required
                  accept={form.category === 'Highlight' ? 'image/*,video/*' : 'image/*'}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input 
                  id="isBlog" 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={form.isBlog}
                  onChange={(e) => setForm({...form, isBlog: e.target.checked})}
                />
                <Label htmlFor="isBlog" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Show this event in the website Blog section
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Event"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EventsPage
