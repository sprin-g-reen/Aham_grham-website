import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Trash2, 
  Edit, 
  Filter, 
  Search
} from 'lucide-react'

import { 
  Dialog as ShadcnDialog, 
  DialogContent as ShadcnContent, 
  DialogHeader as ShadcnHeader, 
  DialogTitle as ShadcnTitle,
  DialogFooter as ShadcnFooter 
} from "@/components/ui/dialog"

const EventDetails = () => {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Edit State
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    eventId: '',
    bookingPrice: '',
    description: '',
    about: '',
    category: ''
  })
  const [editFile, setEditFile] = useState<File | null>(null)
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events')
      setEvents(response.data)
    } catch (error) {
      toast.error("Failed to fetch events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`)
      toast.success("Event deleted")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete event")
    }
  }

  const handleEditClick = (event: any) => {
    setEditingEvent(event)
    setEditForm({
      name: event.name,
      eventId: event.eventId,
      bookingPrice: event.bookingPrice.toString(),
      description: event.description || '',
      about: event.about || '',
      category: event.category || 'Main Event'
    })
    setEditFile(null)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const isHighlight = editForm.category === 'Highlight'
    if (!editForm.name || !editForm.eventId || !editForm.category || (!isHighlight && (!editForm.bookingPrice || !editForm.about)) || !editForm.description) {
      toast.error("Please fill all required fields, including 'What it is all about'.")
      return
    }

    setIsUpdateLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', editForm.name)
      formData.append('eventId', editForm.eventId)
      formData.append('bookingPrice', editForm.bookingPrice)
      formData.append('description', editForm.description)
      formData.append('about', editForm.about)
      formData.append('category', editForm.category)
      if (editFile) {
        if (isHighlight) {
          if (editFile.type.startsWith('video/')) {
            formData.append('video', editFile)
          } else {
            formData.append('image', editFile)
          }
        } else {
          formData.append('image', editFile)
        }
      }

      await axios.put(`http://localhost:5000/api/events/${editingEvent._id}`, formData)
      toast.success("Event updated successfully")
      setEditingEvent(null)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update event")
    } finally {
      setIsUpdateLoading(false)
    }
  }

  const filteredEvents = events.filter(e => 
    (e.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (e.eventId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Details</h1>
          <p className="text-muted-foreground">Manage and view all your active events and meetups.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search event..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-12 border rounded-xl border-dashed">
            {searchTerm ? "No events match your search." : "No events found."}
          </p>
        ) : (
          filteredEvents.map((ev) => (
            <Card key={ev._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center gap-6 p-6">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-xl truncate">{ev.name}</h3>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase">
                      {ev.eventId}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs mt-2">
                    <div className="flex items-center gap-1.5 text-primary font-bold">
                      {ev.category !== 'Highlight' && <span>₹{ev.bookingPrice}</span>}
                    </div>
                    <span className="text-muted-foreground">Created: {new Date(ev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center gap-2 hover:bg-primary/5 hover:text-primary border-muted ${ev.isBlog ? 'bg-orange-50 text-orange-600 border-orange-200' : ''}`}
                    onClick={async () => {
                      try {
                        await axios.patch(`http://localhost:5000/api/events/${ev._id}/toggle-blog`)
                        toast.success(ev.isBlog ? "Removed from Blog" : "Added to Blog")
                        fetchData()
                      } catch (error) {
                        toast.error("Failed to update blog status")
                      }
                    }}
                  >
                    {ev.isBlog ? "Remove from Blog" : "Add to Blog"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 hover:bg-primary/5 hover:text-primary border-muted"
                    onClick={() => handleEditClick(ev)}
                  >
                    <Edit className="h-4 w-4" />
                    Update
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border-muted"
                    onClick={() => handleDelete(ev._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* UPDATE MODAL */}
      <ShadcnDialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <ShadcnContent className="sm:max-w-[500px]">
          <ShadcnHeader>
            <ShadcnTitle>Update Event</ShadcnTitle>
          </ShadcnHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Event Name</Label>
              <Input 
                id="edit-name" 
                required
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-id">Event ID</Label>
              <Input 
                id="edit-id" 
                required
                value={editForm.eventId}
                onChange={(e) => setEditForm({...editForm, eventId: e.target.value})}
              />
            </div>
            {editForm.category !== 'Highlight' && (
              <div className="space-y-2">
                <Label htmlFor="edit-price">Booking Price (₹)</Label>
                <Input 
                  id="edit-price" 
                  type="number"
                  required
                  value={editForm.bookingPrice}
                  onChange={(e) => setEditForm({...editForm, bookingPrice: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <select 
                id="edit-category"
                className="w-full p-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={editForm.category}
                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
              >
                <option value="Main Event">Main Event</option>
                <option value="Workshop">Workshop</option>
                <option value="Highlight">Highlight</option>
                <option value="Upcoming Event">Upcoming Event</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Short Description</Label>
              <Textarea 
                id="edit-desc" 
                required
                className="min-h-[80px]"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            </div>
            {editForm.category !== 'Highlight' && (
              <div className="space-y-2">
                <Label htmlFor="edit-about">What it is all about</Label>
                <Textarea 
                  id="edit-about" 
                  required
                  placeholder="Provide detailed information about the event..." 
                  className="min-h-[120px]"
                  value={editForm.about}
                  onChange={(e) => setEditForm({...editForm, about: e.target.value})}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-media">
                {editForm.category === 'Highlight' ? 'Update Highlight Media (Image or Video)' : 'Update Image (Optional)'}
              </Label>
              <Input 
                id="edit-media" 
                type="file" 
                accept={editForm.category === 'Highlight' ? 'image/*,video/*' : 'image/*'}
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
              />
            </div>
            <ShadcnFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditingEvent(null)}>Cancel</Button>
              <Button type="submit" disabled={isUpdateLoading}>
                {isUpdateLoading ? "Updating..." : "Save Changes"}
              </Button>
            </ShadcnFooter>
          </form>
        </ShadcnContent>
      </ShadcnDialog>
    </div>
  )
}

export default EventDetails
