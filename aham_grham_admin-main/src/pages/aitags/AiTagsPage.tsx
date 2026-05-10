import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

const AiTagsPage = () => {
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/aitags')
      setTags(response.data)
    } catch (error) {
      console.error("Failed to fetch tags", error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.description) {
      toast.error("All fields are required.")
      return
    }

    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/aitags', form)
      toast.success("AI Tag added successfully")
      setForm({ name: '', description: '' })
      fetchTags()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add AI Tag")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/aitags/${id}`)
      toast.success("AI Tag deleted successfully")
      fetchTags()
    } catch (error: any) {
      toast.error("Failed to delete AI Tag")
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">AI Tags Management</h1>
        <p className="text-muted-foreground">Manage animated tags for the footer and other sections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New AI Tag</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tag Name</Label>
                  <Input 
                    id="name" 
                    required
                    placeholder="e.g. Neurological Sync" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    required
                    placeholder="Short description of the tag" 
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Adding..." : "Add AI Tag"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing AI Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <TableRow key={tag._id}>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{tag.description}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDelete(tag._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No AI tags found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AiTagsPage
