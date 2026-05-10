import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import axios from "axios"




export default function AddProduct() {
  const [categoriesData, setCategoriesData] = useState<any[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/categories')
        setCategoriesData(data)
      } catch (error) {
        console.error("Failed to fetch categories")
      }
    }
    fetchCategories()
  }, [])

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    metaDescription: "",
    price: "",
    salePrice: "",
    tax: "",
    stock: "",
    stockStatus: "",
    offer: "",
  })

  const validate = () => {
    const errors: Record<string, string> = {}

    if (!form.name) errors.name = "Product name is required"
    if (!form.sku) errors.sku = "Product ID is required"
    if (!form.price) errors.price = "Price is required"
    if (!form.category) errors.category = "Category is required"
    if (!form.tax) errors.tax = "GST is required"
    if (!form.stockStatus) errors.stockStatus = "Stock Status is required"

    return errors
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploaderKey, setUploaderKey] = useState(Date.now())
  const handleSubmit = async () => {
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('offer', form.offer);
      formData.append('sku', form.sku);
      formData.append('tax', form.tax);
      formData.append('stockStatus', form.stockStatus);
      formData.append('isMostSelling', 'false');

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Product created successfully!")

      setForm({
        name: "",
        sku: "",
        category: "",
        description: "",
        metaDescription: "",
        price: "",
        salePrice: "",
        tax: "",
        stock: "",
        stockStatus: "",
        offer: "",
      })
      setSelectedFile(null)
      setErrors({})
      setUploaderKey(Date.now())
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }



  // State for published status
  const [published, setPublished] = useState(true)

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Add New Product</h2>
          <p className="text-sm text-muted-foreground">
            Create a standard product with full details
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline">Discard</Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:col-span-2">
            <GeneralInfoCard form={form} setForm={setForm} errors={errors} setErrors={setErrors} categories={categoriesData} />
            <PricingCard form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
            <InventoryCard form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
            <ProductImageUploader key={uploaderKey} onFileSelect={setSelectedFile} />
          </div>
          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <StatusCard published={published} setPublished={setPublished} />
            <SeoCard form={form} setForm={setForm} />
          </div>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS TO CLEAN UP MAIN RENDER ---

function GeneralInfoCard({ form, setForm, errors, setErrors, categories }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Product Name</Label>
          <Input
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value })
              setErrors({ ...errors, name: "" })
            }}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Product ID</Label>
          <Input
            placeholder="Enter product ID"
            value={form.sku}
            onChange={(e) => {
              setForm({ ...form, sku: e.target.value })
              setErrors({ ...errors, sku: "" })
            }}
          />
          {errors.sku && (
            <p className="text-sm text-red-500">{errors.sku}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Category</Label>
          <Select
            onValueChange={(value) => {
              setForm({ ...form, category: value })
              setErrors({ ...errors, category: "" })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories && categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat.name.toLowerCase()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.category && (
            <p className="text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            rows={4}
            placeholder="Product description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Any Offer</Label>
          <Input
            placeholder="e.g. Special festive discount available"
            value={form.offer}
            onChange={(e) => setForm({ ...form, offer: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function PricingCard({ form, setForm, errors, setErrors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            placeholder="₹0.00"
            value={form.price}
            onChange={(e) => {
              setForm({ ...form, price: e.target.value })
              setErrors({ ...errors, price: "" })
            }}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Sale Price</Label>
          <Input
            placeholder="₹0.00"
            value={form.salePrice}
            onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>GST</Label>
          <Select
            onValueChange={(value) => {
              setForm({ ...form, tax: value })
              setErrors({ ...errors, tax: "" })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select GST" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No GST</SelectItem>
              <SelectItem value="5">5% GST</SelectItem>
              <SelectItem value="12">12% GST</SelectItem>
              <SelectItem value="18">18% GST</SelectItem>
              <SelectItem value="28">28% GST</SelectItem>
            </SelectContent>
          </Select>
          {errors.tax && (
            <p className="text-sm text-red-500">{errors.tax}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function InventoryCard({ form, setForm, errors, setErrors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Stock Quantity</Label>
          <Input
            placeholder="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Stock Status</Label>
          <Select
            onValueChange={(value) => {
              setForm({ ...form, stockStatus: value })
              setErrors({ ...errors, stockStatus: "" })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          {errors.stockStatus && (
            <p className="text-sm text-red-500">{errors.stockStatus}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Switch />
          <Label>Track Inventory</Label>
        </div>
      </CardContent>
    </Card>
  )
}



function StatusCard({ published, setPublished }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Switch
          checked={published}
          onCheckedChange={setPublished}
        />
        <span className="text-sm text-muted-foreground">
          {published ? "Published" : "Draft"}
        </span>
      </CardContent>
    </Card>
  )
}

function SeoCard({ form, setForm }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Engine Listing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>SEO Title</Label>
          <Input placeholder="SEO title" />
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <Input placeholder="product-slug" />
        </div>

        <div className="space-y-2">
          <Label>Meta Description</Label>
          <Textarea
            rows={3}
            value={form.metaDescription}
            onChange={(e) =>
              setForm({ ...form, metaDescription: e.target.value })
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Separate component for image uploading and preview
function ProductImageUploader({ onFileSelect }: { onFileSelect?: (file: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [images, setImages] = useState<string[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] // Handling single image for now as per backend upload.single('image')
    const newImage = URL.createObjectURL(file)

    setImages([newImage])
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  useEffect(() => {
    return () => {
      images.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images])


  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFiles(e.dataTransfer.files)
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground hover:bg-muted/40"
        >
          <Upload className="mb-2 h-6 w-6" />
          <p>
            Drag & drop images here or{" "}
            <span className="font-medium text-primary">
              click to upload
            </span>
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-md border"
              >
                <img
                  src={src}
                  alt="Product"
                  className="h-full w-full object-cover"
                />

                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                  onClick={() =>
                    setImages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

