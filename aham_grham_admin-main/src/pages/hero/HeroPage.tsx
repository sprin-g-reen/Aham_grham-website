import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Save, Sparkles, Layout } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const HeroPage = () => {
  const [loading, setLoading] = useState(false)
  const [heroData, setHeroData] = useState<any>(null)
  const [heroImage, setHeroImage] = useState<File | null>(null)
  const [selectedPage, setSelectedPage] = useState('about')

  useEffect(() => {
    setHeroData(null)
    fetchHero()
  }, [selectedPage])

  const fetchHero = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/hero?page=${selectedPage}`)
      setHeroData(response.data)
    } catch (error) {
      toast.error(`Failed to fetch Hero content for ${selectedPage}`)
      // Fallback to empty state if fetch fails to avoid showing previous page's data
      setHeroData({
        kicker: '',
        title: '',
        subtitle: '',
        buttonText: '',
        image: ''
      })
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('page', selectedPage)
      formData.append('kicker', heroData.kicker)
      formData.append('title', heroData.title)
      formData.append('subtitle', heroData.subtitle)
      formData.append('buttonText', heroData.buttonText)
      
      if (heroImage) {
        formData.append('heroImage', heroImage)
      }

      await axios.put('http://localhost:5000/api/hero', formData)
      toast.success(`${selectedPage.toUpperCase()} Hero updated successfully`)
      fetchHero()
    } catch (error) {
      toast.error("Failed to update Hero section")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Layout className="w-8 h-8 text-primary" />
            Page Hero Management
          </h1>
          <p className="text-muted-foreground">Customize banners for various pages (excluding Home).</p>
        </div>

        <div className="w-full md:w-64">
          <Label className="mb-2 block text-xs font-bold uppercase">Select Page to Edit</Label>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full bg-background border-primary/20">
              <SelectValue placeholder="Choose a page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="about">About Us</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="centers">Centers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        <Card className="border-primary/20 shadow-lg min-h-[400px]">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="capitalize">{selectedPage} Hero Section</CardTitle>
                <CardDescription>This is the main banner displayed at the top of the {selectedPage} page.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {!heroData ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground italic">Fetching {selectedPage} content...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Kicker (Small Text Above Title)</Label>
                    <Input 
                      placeholder="e.g. Experience Stillness"
                      value={heroData.kicker}
                      onChange={(e) => setHeroData({...heroData, kicker: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Main Title</Label>
                  <Input 
                    placeholder="The journey back to yourself"
                    value={heroData.title}
                    onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                    className="text-lg font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Subtitle / Description</Label>
                  <Textarea 
                    placeholder="Enter a compelling description..."
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <Label className="text-sm font-semibold">Hero Background Image</Label>
                  <Input 
                    type="file" 
                    onChange={(e) => setHeroImage(e.target.files?.[0] || null)} 
                    className="bg-background"
                  />
                  {heroData.image && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-muted-foreground font-mono">Current path: {heroData.image}</p>
                      <img 
                        src={`http://localhost:5000${heroData.image}`} 
                        alt="Current Hero" 
                        className="w-full max-h-[200px] object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="px-8 shadow-md" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving Changes..." : `Publish ${selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} Hero`}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default HeroPage
