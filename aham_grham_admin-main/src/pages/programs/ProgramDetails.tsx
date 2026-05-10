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

// Note: Assuming Dialog components are available from your UI library
import { 
  Dialog as ShadcnDialog, 
  DialogContent as ShadcnContent, 
  DialogHeader as ShadcnHeader, 
  DialogTitle as ShadcnTitle,
  DialogFooter as ShadcnFooter 
} from "@/components/ui/dialog"

const ProgramDetails = () => {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Edit State
  const [editingProgram, setEditingProgram] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    programId: '',
    bookingPrice: '',
    description: ''
  })
  const [editFile, setEditFile] = useState<File | null>(null)
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/programs')
      setPrograms(response.data)
    } catch (error) {
      toast.error("Failed to fetch programs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/programs/${id}`)
      toast.success("Program deleted")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete program")
    }
  }

  const handleEditClick = (program: any) => {
    setEditingProgram(program)
    setEditForm({
      name: program.name,
      programId: program.programId,
      bookingPrice: program.bookingPrice.toString(),
      description: program.description || ''
    })
    setEditFile(null)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm.name || !editForm.programId || !editForm.bookingPrice) {
      toast.error("Please fill required fields")
      return
    }

    setIsUpdateLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', editForm.name)
      formData.append('programId', editForm.programId)
      formData.append('bookingPrice', editForm.bookingPrice)
      formData.append('description', editForm.description)
      if (editFile) {
        formData.append('image', editFile)
      }

      await axios.put(`http://localhost:5000/api/programs/${editingProgram._id}`, formData)
      toast.success("Program updated successfully")
      setEditingProgram(null)
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update program")
    } finally {
      setIsUpdateLoading(false)
    }
  }

  const filteredPrograms = programs.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.programId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Program Details</h1>
          <p className="text-muted-foreground">Manage and view all your active yoga programs.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search program..." 
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
          <div className="text-center py-12">Loading programs...</div>
        ) : filteredPrograms.length === 0 ? (
          <p className="text-muted-foreground text-center py-12 border rounded-xl border-dashed">
            {searchTerm ? "No programs match your search." : "No programs found."}
          </p>
        ) : (
          filteredPrograms.map((prog) => (
            <Card key={prog._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center gap-6 p-6">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-xl truncate">{prog.name}</h3>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase">
                      {prog.programId}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs mt-2">
                    <div className="flex items-center gap-1.5 text-primary font-bold">
                      <span>₹{prog.bookingPrice}</span>
                    </div>
                    <span className="text-muted-foreground">Created: {new Date(prog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 hover:bg-primary/5 hover:text-primary border-muted"
                    onClick={() => handleEditClick(prog)}
                  >
                    <Edit className="h-4 w-4" />
                    Update
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border-muted"
                    onClick={() => handleDelete(prog._id)}
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
      <ShadcnDialog open={!!editingProgram} onOpenChange={() => setEditingProgram(null)}>
        <ShadcnContent className="sm:max-w-[500px]">
          <ShadcnHeader>
            <ShadcnTitle>Update Program</ShadcnTitle>
          </ShadcnHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Program Name</Label>
              <Input 
                id="edit-name"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-id">Program ID</Label>
              <Input 
                id="edit-id"
                required
                value={editForm.programId}
                onChange={(e) => setEditForm({...editForm, programId: e.target.value})}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea 
                id="edit-desc" 
                required
                className="min-h-[100px]"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Update Image (Optional)</Label>
              <Input 
                id="edit-image" 
                type="file" 
                accept="image/*"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
              />
            </div>
            <ShadcnFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditingProgram(null)}>Cancel</Button>
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

export default ProgramDetails
