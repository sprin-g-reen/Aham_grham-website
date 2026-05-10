import { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  MoreVertical,
  Plus,
  Search,
  ShoppingBag,
  Wallet,
  Users,
  Box,
  List,
} from "lucide-react"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  image: string
  isMostSelling: boolean
  description: string
  offer: string
  sku?: string
  tax?: string
  stockStatus?: string
}

const UPLOADS_URL = 'http://localhost:5000/uploads';
const PAGE_SIZE = 8;

export default function ProductGrid() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products')
      setData(response.data || [])
    } catch (error) {
      toast.error("Failed to fetch products")
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`)
      toast.success("Product deleted")
      fetchProducts()
    } catch (error) {
      toast.error("Failed to delete product")
    }
  }

  const toggleMostSelling = async (product: Product) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${product._id}`, {
        isMostSelling: !product.isMostSelling
      })
      toast.success(product.isMostSelling ? "Removed from Most Selling" : "Added to Most Selling")
      fetchProducts()
    } catch (error) {
      toast.error("Failed to update product status")
    }
  }

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter(p =>
      `${p.name} ${p.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, data])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const safePage = Math.min(page, totalPages)

  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const toggleOne = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-md text-muted-foreground">Total Orders</p>
                            <p className="text-sm text-muted-foreground">All Regions</p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Export</DropdownMenuItem>
                                <DropdownMenuItem>Refresh</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <h2 className="text-2xl font-bold">8,542</h2>

                    <div className="mt-3 flex items-center gap-1 text-emerald-600">
                        <ShoppingBag className="h-5 w-5" />
                        <span className="text-sm font-medium">+3.5% since last month</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-purple-600 text-white border-purple-500/30">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-md">Total Revenue</p>
                            <p className="text-sm opacity-80">This Quarter</p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="text-white">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Export</DropdownMenuItem>
                                <DropdownMenuItem>Refresh</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <h2 className="text-2xl font-bold">$23,456</h2>

                    <div className="mt-3 flex items-center gap-1">
                        <Wallet className="h-5 w-5" />
                        <span className="text-sm font-medium">+8.5% since last month</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-md text-muted-foreground">Total Customers</p>
                            <p className="text-sm text-muted-foreground">Worldwide</p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Export</DropdownMenuItem>
                                <DropdownMenuItem>Refresh</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <h2 className="text-2xl font-bold">5,678</h2>

                    <div className="mt-3 flex items-center gap-1 text-rose-600">
                        <Users className="h-5 w-5" />
                        <span className="text-sm font-medium">-2.5% since last month</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-emerald-600 text-white border-emerald-500/30">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-md">Total Products</p>
                            <p className="text-sm opacity-80">Inventory</p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="text-white">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Export</DropdownMenuItem>
                                <DropdownMenuItem>Refresh</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <h2 className="text-2xl font-bold">1,234</h2>

                    <div className="mt-3 flex items-center gap-1">
                        <Box className="h-5 w-5" />
                        <span className="text-sm font-medium">+5.0% since last month</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-yellow-400 bg-yellow-50 text-yellow-900">
                <CardContent className="p-6">
                    <p className="text-md text-muted-foreground">Active Shoppers</p>
                    <p className="text-sm text-muted-foreground">Live Now</p>

                    <h2 className="text-2xl font-bold my-3">179</h2>

                    <div className="flex items-center gap-1 text-yellow-600">
                        <Users className="h-5 w-5" />
                        <span className="text-sm font-medium">44% today</span>
                    </div>
                </CardContent>
            </Card>

        </div>

      {/* HEADER */}
      <Card>
        <CardHeader className="flex flex-row flex-wrap gap-4 items-center justify-between border-b py-4">
          <div>
            <CardTitle className="text-lg">Products Grid</CardTitle>
            <CardDescription>
              Visual product management
            </CardDescription>
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="flex gap-2">
              <Link to="/ecommerce/product-list">
                <Button size="sm" variant="outline">
                  <List className="mr-1 h-4 w-4" />
                  Product List
                </Button>
              </Link>
              <Link to="/ecommerce/add-product">
                <Button size="sm">
                  <Plus className="mr-1 h-5 w-5" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        {/* GRID */}
        <CardContent className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map(product => (
              <ProductGridCard
                key={product._id}
                product={product}
                selected={selected.includes(product._id)}
                onSelect={() => toggleOne(product._id)}
                onDelete={() => deleteProduct(product._id)}
                onToggleMostSelling={() => toggleMostSelling(product)}
              />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-muted-foreground">
              Page {safePage} of {totalPages}
            </span>

            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </Button>
              <Button
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


/* PRODUCT CARD */
type ProductProps = {
  product: Product
  selected: boolean
  onSelect: () => void
  onDelete: () => void
  onToggleMostSelling: () => void
}

function ProductGridCard({
  product,
  selected,
  onSelect,
  onDelete,
  onToggleMostSelling,
}: ProductProps) {
  return (
    <Card className="group overflow-hidden transition hover:shadow-lg border hover:border-primary cursor-pointer shadow-none hover:shadow-primary/10">
      <CardContent className="p-4 space-y-4">

        {/* Top row */}
        <div className="flex items-center justify-between">
          <Checkbox checked={selected} onCheckedChange={onSelect} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onToggleMostSelling}>
                {product.isMostSelling ? "Unfeature" : "Feature (Most Selling)"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Full update feature coming soon!")}>Update</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={onDelete}
              >
                Remove 
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Image */}
        <div className="aspect-square rounded-xl bg-muted overflow-hidden">
          <img
            src={product.image && product.image !== 'no-photo.jpg' ? `${UPLOADS_URL}/${product.image}` : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 p-2"
          />
        </div>

        {/* Info */}
        <div className="space-y-1">
          <div className="flex justify-between items-start">
             <h4 className="font-semibold leading-tight">{product.name}</h4>
             <span className="font-bold text-primary">₹{product.price}</span>
          </div>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
           <Button variant="outline" size="sm" onClick={() => toast.info("Update feature coming soon!")}>Update</Button>
           <Button variant="destructive" size="sm" onClick={onDelete}>Remove</Button>
        </div>
      </CardContent>
    </Card>
  )
}


