import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, MapPin } from "lucide-react"

interface Center {
  _id: string;
  name: string;
  location: string;
  description: string;
  status: string;
  image?: string;
}

const CentersPage = () => {
  const [loading, setLoading] = useState(false)
  const [centers, setCenters] = useState<Center[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    status: 'opened',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(Date.now())

  useEffect(() => {
    fetchCenters()
  }, [])

  const fetchCenters = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/centers')
      setCenters(data)
    } catch (error) {
      toast.error("Failed to fetch centers")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.location || !form.description || !form.status) {
      toast.error("Please fill in all required fields.")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('location', form.location)
      formData.append('description', form.description)
      formData.append('status', form.status)
      if (selectedFile) {
        formData.append('image', selectedFile)
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/centers/${editingId}`, formData)
        toast.success("Center updated successfully")
      } else {
        await axios.post('http://localhost:5000/api/centers', formData)
        toast.success("Center added successfully")
      }

      setForm({ name: '', location: '', description: '', status: 'opened' })
      setSelectedFile(null)
      setEditingId(null)
      setFileInputKey(Date.now()) // Clear the file input
      fetchCenters()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save center")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (center: Center) => {
    setEditingId(center._id)
    setForm({
      name: center.name,
      location: center.location,
      description: center.description,
      status: center.status,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/centers/${id}`)
      toast.success("Center deleted")
      fetchCenters()
    } catch (error) {
      toast.error("Failed to delete center")
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{editingId ? "Update Center" : "Our Centers"}</h1>
        <p className="text-muted-foreground">Manage your physical sanctuary locations and their status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Center" : "Add New Center"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Center Name</Label>
                  <Input 
                    id="name" 
                    required
                    placeholder="e.g. The Midnight Grove" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location / Address</Label>
                  <Input 
                    id="location" 
                    required
                    placeholder="e.g. Seattle, WA" 
                    value={form.location}
                    onChange={(e) => setForm({...form, location: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Operational Status</Label>
                  <Select 
                    value={form.status} 
                    onValueChange={(val) => setForm({...form, status: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opened">Opened</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    required
                    placeholder="Describe the center..." 
                    className="min-h-[100px]"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Center Image {editingId && "(Optional if not changing)"}</Label>
                  <Input 
                    id="image" 
                    key={fileInputKey}
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Saving..." : editingId ? "Update Center" : "Add Center"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingId(null)
                      setForm({ name: '', location: '', description: '', status: 'opened' })
                    }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Existing Centers</h2>
          <div className="grid grid-cols-1 gap-4">
            {centers.length === 0 ? (
              <p className="text-muted-foreground italic">No centers added yet.</p>
            ) : (
              centers.map((center) => (
                <Card key={center._id} className="overflow-hidden">
                  <div className="flex h-full">
                    {center.image && (
                      <div className="w-32 h-full flex-shrink-0">
                        <img 
                          src={`http://localhost:5000${center.image}`} 
                          alt={center.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{center.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {center.location}
                          </p>
                        </div>
                        <Badge variant={center.status === 'opened' ? 'default' : 'destructive'}>
                          {center.status}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-2 mb-4 text-muted-foreground">
                        {center.description}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(center)}>
                          <Pencil className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(center._id)}>
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CentersPage
