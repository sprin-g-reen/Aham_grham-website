"use client"

import { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  MoreVertical,
  Plus,
  ShoppingBag,
  Wallet,
  Users,
  Box,
  ArrowUpRight,
  ArrowDownRight,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  Search,
  LayoutGrid,
} from "lucide-react"

// Define a proper interface for the product
interface Product {
  _id: string
  name: string
  category: string
  price: number
  image: string
  isMostSelling: boolean
  isServicePage: boolean
  description: string
  offer: string
  sku?: string
  tax?: string
  stockStatus?: string
}

const UPLOADS_URL = 'http://localhost:5000/uploads';

export default function ProductList() {
  const [search, setSearch] = useState("")
  const [pageState, setPageState] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [ordersData, setOrdersData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const PAGE_SIZE = 10

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products')
      setOrdersData(response.data || [])
    } catch (error) {
      toast.error("Failed to fetch products")
      setOrdersData([])
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

  const toggleServicePage = async (product: Product) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${product._id}`, {
        isServicePage: !product.isServicePage
      })
      toast.success(product.isServicePage ? "Removed from Services" : "Added to Services")
      fetchProducts()
    } catch (error) {
      toast.error("Failed to update service status")
    }
  }

  // 🔍 Search filter
  const filteredOrders = useMemo(() => {
    if (!ordersData) return []
    return ordersData.filter((order) =>
      `${order.name} ${order.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, ordersData])


  // Calculation for safe pagination without useEffect
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const currentPage = Math.min(pageState, totalPages)

  const paginatedProducts = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE, 
    currentPage * PAGE_SIZE
  )

  // ☑️ Checkbox logic
  const toggleAll = (checked: boolean) => {
    setSelected(checked ? paginatedProducts.map(p => p._id) : [])
  }
  
  const toggleOne = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // 📤 Export to CSV
  const exportToCSV = (rows: Product[]) => {
    const headers = ["Name", "Category", "Stock Status", "SKU", "Price"]

    const csvContent = [
      headers.join(","),
      ...rows.map(row =>
        [
          row.name,
          row.category,
          row.stockStatus || "N/A",
          row.sku || "N/A",
          row.price,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "products.csv"
    link.click()

    URL.revokeObjectURL(url)
  }

    
  return (
    <div className="space-y-6">

      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value="8,542"
          trend="+3.5%"
          icon={<ShoppingBag />}
          positive
        />
        <StatCard
          title="Total Revenue"
          value="$23,456"
          trend="+8.5%"
          icon={<Wallet />}
          positive
        />
        <StatCard
          title="Customers"
          value="5,678"
          trend="-2.5%"
          icon={<Users />}
        />
        <StatCard
          title="Products"
          value="1,234"
          trend="+5.0%"
          icon={<Box />}
          positive
        />
      </div>

      {/* PRODUCT LIST */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b py-4 flex-wrap gap-3">
          <div>
          <CardTitle className="text-lg mb-0">Products List</CardTitle>
          <CardDescription>
            Latest product purchases
          </CardDescription>
          </div>
          {/* Search */}
          <div className="relative mb-0 max-w-lg w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPageState(1) 
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {/* Selection Bar */}
          {selected.length > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2">
              <p className="text-sm text-muted-foreground">
                {selected.length} selected
              </p>

              <div className="flex gap-2">
                <Button
                   size="sm"
                   variant="destructive"
                   onClick={async () => {
                     for (const id of selected) {
                        await deleteProduct(id)
                     }
                     setSelected([])
                   }}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="relative w-full overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                    checked={
                      paginatedProducts.length > 0 &&
                      selected.length === paginatedProducts.length
                    }
                    onCheckedChange={(val) => toggleAll(!!val)}
                  />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Checkbox
                      checked={selected.includes(product._id)}
                      onCheckedChange={() => toggleOne(product._id)}
                    />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image && product.image !== 'no-photo.jpg' ? `${UPLOADS_URL}/${product.image}` : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'}
                          alt={product.name}
                          className="h-10 w-10 rounded-full border object-cover p-1 bg-muted/50"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>{product.sku || 'N/A'}</TableCell>

                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.price}</TableCell>

                    <TableCell>
                      <Badge className={product.isMostSelling ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20" : "bg-muted text-muted-foreground"} variant="outline">
                        {product.isMostSelling ? "Most Selling" : "Normal"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge className={product.isServicePage ? "bg-purple-100 text-purple-600 dark:bg-purple-500/20" : "bg-muted text-muted-foreground"} variant="outline">
                        {product.isServicePage ? "On Services" : "Off"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                           <Button 
                             variant={product.isMostSelling ? "default" : "outline"}
                             size="sm"
                             onClick={() => toggleMostSelling(product)}
                             className={product.isMostSelling ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                           >
                              {product.isMostSelling ? "Featured" : "Feature"}
                           </Button>
                           <Button 
                             variant={product.isServicePage ? "default" : "outline"}
                             size="sm"
                             onClick={() => toggleServicePage(product)}
                             className={product.isServicePage ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}
                           >
                              {product.isServicePage ? "On Services" : "To Service"}
                           </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.info("Full update feature coming soon!")}
                          >
                             Update
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteProduct(product._id)}
                          >
                             Remove
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination controls */}
          <div className="flex items-center justify-between px-2 py-2">
            <div className="text-sm text-muted-foreground">
              {filteredOrders.length === 0
                ? "Showing 0 of 0"
                : `Showing ${ (currentPage - 1) * PAGE_SIZE + 1 } - ${ Math.min(currentPage * PAGE_SIZE, filteredOrders.length) } of ${ filteredOrders.length }`}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPageState((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>

              <span className="text-sm">Page {currentPage} of {totalPages}</span>

              <Button
                onClick={() => setPageState((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
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

/* KPI CARD */
function StatCard({
  title,
  value,
  trend,
  icon,
  positive,
}: {
  title: string
  value: string
  trend: string
  icon: React.ReactNode
  positive?: boolean
}) {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-6">
        <div>
          <p className="text-md text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-medium">{value}</h3>
          <div className="flex items-center gap-1 mt-1 text-sm font-medium mt-2">
            {positive ? (
              <ArrowUpRight className="h-4 w-5 text-emerald-600" />
            ) : (
              <ArrowDownRight className="h-4 w-5 text-rose-600" />
            )}
            <span>{trend}</span>
          </div>
        </div>
        <div className="rounded-xl bg-muted p-3">{icon}</div>
      </CardContent>
    </Card>
  )
}