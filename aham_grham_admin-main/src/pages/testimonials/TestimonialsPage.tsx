import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Star, Edit, X, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const TestimonialsPage = () => {
  const [loading, setLoading] = useState(false)
  const [testimonials, setTestimonials] = useState([])
  
  // States for Adding
  const [addForm, setAddForm] = useState({
    name: '',
    testimonialId: '',
    role: '',
    content: '',
  })
  const [addFile, setAddFile] = useState<File | null>(null)
  const [addFileInputKey, setAddFileInputKey] = useState(Date.now())

  // States for Updating
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [updateId, setUpdateId] = useState<string | null>(null)
  const [updateForm, setUpdateForm] = useState({
    name: '',
    testimonialId: '',
    role: '',
    content: '',
  })
  const [updateFile, setUpdateFile] = useState<File | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/testimonials')
      setTestimonials(response.data)
    } catch (error) {
      console.error("Failed to fetch testimonials", error)
    }
  }

  // Handle Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.name || !addForm.testimonialId || !addForm.role || !addForm.content) {
      toast.error("Please fill in all required fields.")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', addForm.name)
      formData.append('testimonialId', addForm.testimonialId)
      formData.append('role', addForm.role)
      formData.append('content', addForm.content)
      formData.append('rating', '5')
      if (addFile) formData.append('image', addFile)

      await axios.post('http://localhost:5000/api/testimonials', formData)
      toast.success("Testimonial added successfully")
      setAddForm({ name: '', testimonialId: '', role: '', content: '' })
      setAddFile(null)
      setAddFileInputKey(Date.now())
      fetchTestimonials()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add testimonial")
    } finally {
      setLoading(false)
    }
  }

  // Handle Update
  const handleUpdateClick = (t: any) => {
    setUpdateId(t._id)
    setUpdateForm({
      name: t.name,
      testimonialId: t.testimonialId,
      role: t.role,
      content: t.content
    })
    setIsUpdateOpen(true)
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', updateForm.name)
      formData.append('testimonialId', updateForm.testimonialId)
      formData.append('role', updateForm.role)
      formData.append('content', updateForm.content)
      formData.append('rating', '5')
      if (updateFile) formData.append('image', updateFile)

      await axios.put(`http://localhost:5000/api/testimonials/${updateId}`, formData)
      toast.success("Testimonial updated successfully")
      setIsUpdateOpen(false)
      fetchTestimonials()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update testimonial")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/testimonials/${id}`)
      toast.success("Testimonial deleted")
      fetchTestimonials()
    } catch (error) {
      toast.error("Failed to delete testimonial")
    }
  }

  return (
    <div className="p-6 space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Testimonials Management</h1>
        <p className="text-muted-foreground">Easily add new client feedback or update existing records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ADD CARD */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              <CardTitle>Add New Testimonial</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-name">Client Name</Label>
                  <Input 
                    id="add-name" 
                    required
                    placeholder="e.g. Sarah Johnson" 
                    value={addForm.name}
                    onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-id">Testimonial ID</Label>
                  <Input 
                    id="add-id" 
                    required
                    placeholder="e.g. TEST-001" 
                    value={addForm.testimonialId}
                    onChange={(e) => setAddForm({...addForm, testimonialId: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-role">Role / Location</Label>
                <Input 
                  id="add-role" 
                  required
                  placeholder="e.g. Yoga Student, Switzerland" 
                  value={addForm.role}
                  onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-content">Testimonial Content</Label>
                <Textarea 
                  id="add-content" 
                  required
                  placeholder="What did the client say?" 
                  className="min-h-[100px]"
                  value={addForm.content}
                  onChange={(e) => setAddForm({...addForm, content: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-image">Client Photo (Optional)</Label>
                <Input 
                  id="add-image" 
                  key={addFileInputKey}
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setAddFile(e.target.files?.[0] || null)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Testimonial"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* LIST CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {testimonials.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No testimonials found.</p>
              ) : (
                testimonials.map((t: any) => (
                  <div key={t._id} className="p-4 border rounded-xl relative group bg-muted/30 hover:bg-muted/50 transition-all">
                    <div className="flex items-start gap-4">
                      {t.image ? (
                        <img 
                          src={`http://localhost:5000${t.image}`} 
                          alt={t.name} 
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm">{t.name}</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t.role}</p>
                              <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded text-primary font-mono">{t.testimonialId}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => handleUpdateClick(t)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(t._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-2 text-xs italic text-muted-foreground line-clamp-3">"{t.content}"</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UPDATE DIALOG */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Testimonial</DialogTitle>
            <DialogDescription>
              Make changes to the testimonial below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="up-name" className="text-right">Name</Label>
                <Input
                  id="up-name"
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="up-id" className="text-right">ID</Label>
                <Input
                  id="up-id"
                  value={updateForm.testimonialId}
                  onChange={(e) => setUpdateForm({...updateForm, testimonialId: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="up-role" className="text-right">Role</Label>
                <Input
                  id="up-role"
                  value={updateForm.role}
                  onChange={(e) => setUpdateForm({...updateForm, role: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="up-content" className="text-right">Content</Label>
                <Textarea
                  id="up-content"
                  value={updateForm.content}
                  onChange={(e) => setUpdateForm({...updateForm, content: e.target.value})}
                  className="col-span-3 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="up-image" className="text-right">Photo</Label>
                <Input
                  id="up-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUpdateFile(e.target.files?.[0] || null)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TestimonialsPage
