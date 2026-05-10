import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Save, Info, Heart, Quote, Users, Sparkles } from 'lucide-react'

const AboutPage = () => {
  const [loading, setLoading] = useState(false)
  const [aboutData, setAboutData] = useState<any>(null)
  const [heroImage, setHeroImage] = useState<File | null>(null)
  const [ctaImage, setCtaImage] = useState<File | null>(null)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/about')
      setAboutData(response.data)
    } catch (error) {
      toast.error("Failed to fetch About page content")
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('hero', JSON.stringify(aboutData.hero))
      formData.append('halfSections', JSON.stringify(aboutData.halfSections))
      formData.append('corePhilosophy', JSON.stringify(aboutData.corePhilosophy))
      formData.append('lineageVoice', JSON.stringify(aboutData.lineageVoice))
      formData.append('ancientLineage', JSON.stringify(aboutData.ancientLineage))
      formData.append('faculties', JSON.stringify(aboutData.faculties))
      formData.append('cta', JSON.stringify(aboutData.cta))
      
      if (heroImage) {
        formData.append('heroImage', heroImage)
      }
      if (ctaImage) {
        formData.append('ctaImage', ctaImage)
      }

      await axios.put('http://localhost:5000/api/about', formData)
      toast.success("About page updated successfully")
      fetchAbout()
    } catch (error) {
      toast.error("Failed to update About page")
    } finally {
      setLoading(false)
    }
  }

  if (!aboutData) return <div className="p-10">Loading...</div>

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">About Us Management</h1>
        <p className="text-muted-foreground">Customize the story and values of Aham Grham.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        
        {/* HERO SECTION */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner at the top of the About page.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kicker</Label>
                <Input 
                  value={aboutData.hero.kicker}
                  onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, kicker: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={aboutData.hero.title}
                  onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, title: e.target.value}})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea 
                value={aboutData.hero.subtitle}
                onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, subtitle: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <Label>Hero Image</Label>
              <Input type="file" onChange={(e) => setHeroImage(e.target.files?.[0] || null)} />
              <p className="text-[10px] text-muted-foreground">Current image: {aboutData.hero.image}</p>
            </div>
          </CardContent>
        </Card>

        {/* HALF SECTIONS */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Info className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Narrative Sections</CardTitle>
              <CardDescription>Two side-by-side informational sections.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            {aboutData.halfSections && aboutData.halfSections.length > 0 ? (
              aboutData.halfSections.map((section: any, index: number) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/20">
                  <div className="space-y-2">
                    <Label>{index === 0 ? "Left Box (Architectural Soul)" : "Right Box (Breath of the Earth)"} - Title</Label>
                    <Input 
                      value={section.title}
                      onChange={(e) => {
                        const newSections = aboutData.halfSections.map((s: any, i: number) => 
                          i === index ? { ...s, title: e.target.value } : s
                        );
                        setAboutData({...aboutData, halfSections: newSections});
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{index === 0 ? "Left Box" : "Right Box"} - Content</Label>
                    <Textarea 
                      value={section.content}
                      onChange={(e) => {
                        const newSections = aboutData.halfSections.map((s: any, i: number) => 
                          i === index ? { ...s, content: e.target.value } : s
                        );
                        setAboutData({...aboutData, halfSections: newSections});
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-4 text-center text-muted-foreground italic">
                No narrative sections found. Please contact support or check database.
              </div>
            )}
          </CardContent>
        </Card>

        {/* CORE PHILOSOPHY */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Heart className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Core Philosophy</CardTitle>
              <CardDescription>Wide section highlighting your main values.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={aboutData.corePhilosophy.title}
                onChange={(e) => setAboutData({...aboutData, corePhilosophy: {...aboutData.corePhilosophy, title: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <Label>Philosophy Statement</Label>
              <Textarea 
                className="min-h-[100px]"
                value={aboutData.corePhilosophy.content}
                onChange={(e) => setAboutData({...aboutData, corePhilosophy: {...aboutData.corePhilosophy, content: e.target.value}})}
              />
            </div>
          </CardContent>
        </Card>

        {/* LINEAGE VOICE */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Quote className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Lineage Voice (Quote)</CardTitle>
              <CardDescription>Inspirational quote from a founder or tradition.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Header</Label>
              <Input 
                value={aboutData.lineageVoice.title}
                onChange={(e) => setAboutData({...aboutData, lineageVoice: {...aboutData.lineageVoice, title: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <Label>Quote</Label>
              <Textarea 
                value={aboutData.lineageVoice.quote}
                onChange={(e) => setAboutData({...aboutData, lineageVoice: {...aboutData.lineageVoice, quote: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input 
                value={aboutData.lineageVoice.author}
                onChange={(e) => setAboutData({...aboutData, lineageVoice: {...aboutData.lineageVoice, author: e.target.value}})}
              />
            </div>
          </CardContent>
        </Card>

        {/* ANCIENT LINEAGE */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Lineage Details</CardTitle>
              <CardDescription>Small section next to the quote.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Kicker</Label>
              <Input 
                value={aboutData.ancientLineage.kicker}
                onChange={(e) => setAboutData({...aboutData, ancientLineage: {...aboutData.ancientLineage, kicker: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea 
                value={aboutData.ancientLineage.content}
                onChange={(e) => setAboutData({...aboutData, ancientLineage: {...aboutData.ancientLineage, content: e.target.value}})}
              />
            </div>
          </CardContent>
        </Card>

        {/* FACULTIES SECTION */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Our Faculties (Spiritual Guides)</CardTitle>
              <CardDescription>Manage the team of experts shown on the About page.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input 
                  value={aboutData.faculties?.title}
                  onChange={(e) => setAboutData({...aboutData, faculties: {...aboutData.faculties, title: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <Label>Section Subtitle</Label>
                <Input 
                  value={aboutData.faculties?.subtitle}
                  onChange={(e) => setAboutData({...aboutData, faculties: {...aboutData.faculties, subtitle: e.target.value}})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-semibold">Faculty Members</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newGuides = [...(aboutData.faculties?.guides || []), { name: '', role: '', bio: '', image: 'placeholder.png' }];
                    setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}});
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Add New Guide
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aboutData.faculties?.guides?.map((guide: any, index: number) => (
                  <div key={index} className="p-4 border rounded-xl bg-muted/30 space-y-4 relative group">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        const newGuides = aboutData.faculties.guides.filter((_: any, i: number) => i !== index);
                        setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}});
                      }}
                    >
                      <Save className="w-4 h-4 rotate-45 text-red-500" />
                    </Button>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold uppercase tracking-wider text-primary">
                        {guide.name || `New Guide #${index + 1}`}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        value={guide.name}
                        onChange={(e) => {
                          const newGuides = aboutData.faculties.guides.map((g: any, i: number) => 
                            i === index ? { ...g, name: e.target.value } : g
                          );
                          setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}});
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input 
                        value={guide.role}
                        onChange={(e) => {
                          const newGuides = aboutData.faculties.guides.map((g: any, i: number) => 
                            i === index ? { ...g, role: e.target.value } : g
                          );
                          setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}});
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Biography</Label>
                      <Textarea 
                        value={guide.bio}
                        onChange={(e) => {
                          const newGuides = aboutData.faculties.guides.map((g: any, i: number) => 
                            i === index ? { ...g, bio: e.target.value } : g
                          );
                          setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}});
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image Name (e.g. 22.jpg)</Label>
                      <Input 
                        value={guide.image}
                        onChange={(e) => {
                          const newGuides = aboutData.faculties.guides.map((g: any, i: number) => 
                            i === index ? { ...g, image: e.target.value } : g
                          );
                          setAboutData({...aboutData, faculties: {...aboutData.faculties, guides: newGuides}});
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA SECTION */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Call to Action (Begin Your Ascent)</CardTitle>
              <CardDescription>The bottom section of the page with a background image.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={aboutData.cta?.title}
                  onChange={(e) => setAboutData({...aboutData, cta: {...aboutData.cta, title: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input 
                  value={aboutData.cta?.buttonText}
                  onChange={(e) => setAboutData({...aboutData, cta: {...aboutData.cta, buttonText: e.target.value}})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea 
                value={aboutData.cta?.subtitle}
                onChange={(e) => setAboutData({...aboutData, cta: {...aboutData.cta, subtitle: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Image</Label>
              <Input type="file" onChange={(e) => setCtaImage(e.target.files?.[0] || null)} />
              <p className="text-[10px] text-muted-foreground">Current image: {aboutData.cta?.image || 'None'}</p>
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-6 flex justify-end">
          <Button type="submit" size="lg" className="shadow-xl" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving Changes..." : "Publish Updates"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AboutPage
