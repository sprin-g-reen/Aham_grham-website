import { useMemo, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, MoreVertical, UserIcon, SettingsIcon, LogOutIcon } from "lucide-react"

const statusClass = (status: string) =>
  status === "Active"
    ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/30"
    : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/30"

 type Category = {
  _id: string
  name: string
  description: string
  status: string
  slug: string
}

export default function CategoryList() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
 
  const [categoryList, setCategoryList] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/categories')
      setCategoryList(data)
    } catch (error) {
      toast.error("Failed to fetch categories")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const [selected, setSelected] = useState<string[]>([])
  const PAGE_SIZE = 10

  const filtered = useMemo(() => {
    return categoryList.filter((c) =>
      `${c.name} ${c.description} ${c.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, categoryList])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const safePage = Math.min(page, totalPages)

  const start = (safePage - 1) * PAGE_SIZE

  const paginated = filtered.slice(start, start + PAGE_SIZE)

  const handleSelectAll = () => {
    if (selected.length === paginated.length) {
      setSelected([])
    } else {
      setSelected(paginated.map((cat) => cat._id))
    }
  }

  const handleSelectOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`)
      toast.success("Category deleted")
      fetchCategories()
    } catch (error) {
      toast.error("Failed to delete category")
    }
  }

  const handleEdit = (cat: Category) => {
    setEditId(cat._id)
    setForm({
      name: cat.name,
      description: cat.description || "",
      status: cat.status || "Active",
    })
    setOpen(true)
  }

  const handleDeleteSelected = async () => {
    try {
      for (const id of selected) {
        await axios.delete(`http://localhost:5000/api/categories/${id}`)
      }
      toast.success("Selected categories deleted")
      setSelected([])
      fetchCategories()
    } catch (error) {
      toast.error("Failed to delete some categories")
    }
  }

  const isAllSelected =
  paginated.length > 0 &&
  paginated.every(cat => selected.includes(cat._id))

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active",
  })

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!form.name) errors.name = "Required"
    return errors
  }

  const handleSubmit = async () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/categories/${editId}`, form)
        toast.success("Category updated")
      } else {
        await axios.post('http://localhost:5000/api/categories', form)
        toast.success("Category created")
      }
      setOpen(false)
      setEditId(null)
      setForm({ name: "", description: "", status: "Active" })
      fetchCategories()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category List</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <div className="flex gap-2">
            {selected.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                Delete Selected ({selected.length})
              </Button>
            )}
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="rounded-md border p-6 text-center text-muted-foreground">
            No matching categories found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(cat._id)}
                      onCheckedChange={() => handleSelectOne(cat._id)}
                    />
                  </TableCell>

                  <TableCell className="font-medium">
                    {cat.name}
                  </TableCell>

                  <TableCell>{cat.description || '-'}</TableCell>

                  <TableCell>
                    <Badge className={statusClass(cat.status)} variant="outline">
                      {cat.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-gray-300 dark:border-gray-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(cat)}>
                          <SettingsIcon className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => deleteCategory(cat._id)}
                        >
                          <LogOutIcon className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            Result {start + 1}–
            {Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>

      </CardContent>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[420px]">
          <SheetHeader>
            <SheetTitle>{editId ? "Edit Category" : "Add New Category"}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                placeholder="Category name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                placeholder="Category description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Discard
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Category"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  )
}