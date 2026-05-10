import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Save, Globe, Share2, PhoneCall, Quote } from 'lucide-react';

interface SocialMedia {
  platform: string;
  url: string;
}

interface FooterData {
  centers: string[];
  socialMedia: SocialMedia[];
  contact: {
    email: string;
    phone: string;
  };
  slogan: string;
}

const FooterPage = () => {
  const [data, setData] = useState<FooterData>({
    centers: [],
    socialMedia: [],
    contact: { email: '', phone: '' },
    slogan: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/footer');
      setData(response.data);
    } catch (error) {
      toast.error("Failed to load footer data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5000/api/footer', data);
      toast.success("Footer updated successfully");
    } catch (error) {
      toast.error("Failed to update footer");
    }
  };

  // Centers logic
  const addCenter = () => {
    setData({ ...data, centers: [...data.centers, ''] });
  };

  const updateCenter = (index: number, value: string) => {
    const newCenters = [...data.centers];
    newCenters[index] = value;
    setData({ ...data, centers: newCenters });
  };

  const removeCenter = (index: number) => {
    setData({ ...data, centers: data.centers.filter((_, i) => i !== index) });
  };

  // Social Media logic
  const addSocial = () => {
    setData({ ...data, socialMedia: [...data.socialMedia, { platform: '', url: '' }] });
  };

  const updateSocial = (index: number, field: keyof SocialMedia, value: string) => {
    const newSocials = [...data.socialMedia];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setData({ ...data, socialMedia: newSocials });
  };

  const removeSocial = (index: number) => {
    setData({ ...data, socialMedia: data.socialMedia.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-6 space-y-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Save className="w-8 h-8 text-primary" />
            Footer Management
          </h1>
          <p className="text-muted-foreground text-sm">Update your centers, social links, and contact info globally.</p>
        </div>
        <Button 
          onClick={handleSave} 
          size="lg"
          className="shadow-md gap-2"
        >
          <Save size={18} />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* OUR CENTERS */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-xl">Our Centers</CardTitle>
                  <CardDescription>Location labels shown in footer</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={addCenter} className="border-primary/20 hover:bg-primary/10">
                <Plus size={16} className="mr-1" /> Add Center
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {data.centers.map((center, index) => (
              <div key={index} className="flex gap-2 group">
                <Input 
                  value={center}
                  onChange={(e) => updateCenter(index, e.target.value)}
                  placeholder="e.g. Rishikesh, India"
                  className="bg-background border-primary/10 focus:border-primary"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeCenter(index)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
            {data.centers.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm border-2 border-dashed border-muted rounded-xl bg-muted/20">
                No centers added yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* SOCIAL MEDIA */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-xl">Social Media</CardTitle>
                  <CardDescription>Platforms and profile URLs</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={addSocial} className="border-primary/20 hover:bg-primary/10">
                <Plus size={16} className="mr-1" /> Add Social
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {data.socialMedia.map((social, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-primary/10 bg-muted/30 relative group">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform</Label>
                  <Input 
                    value={social.platform}
                    onChange={(e) => updateSocial(index, 'platform', e.target.value)}
                    placeholder="e.g. Instagram"
                    className="bg-background h-10"
                  />
                </div>
                <div className="space-y-1.5 pr-10">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL</Label>
                  <Input 
                    value={social.url}
                    onChange={(e) => updateSocial(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="bg-background h-10"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeSocial(index)}
                  className="absolute right-2 top-[38px] text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SLOGAN */}
        <Card className="border-primary/20 shadow-lg lg:col-span-2">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-3">
              <Quote className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-xl">Brand Slogan</CardTitle>
                <CardDescription>The main quote or mission statement in the footer brand column</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm font-semibold">Slogan Text</Label>
                <span className={`text-[10px] font-medium ${data.slogan.length >= 150 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {data.slogan.length} / 150 characters
                </span>
              </div>
              <textarea 
                value={data.slogan}
                onChange={(e) => setData({ ...data, slogan: e.target.value.slice(0, 150) })}
                maxLength={150}
                placeholder="Enter brand slogan..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] border-primary/10 transition-all focus:border-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* CONTACT US */}
        <Card className="border-primary/20 shadow-lg lg:col-span-2">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-xl">Contact Us</CardTitle>
                <CardDescription>Official email and phone number displayed in footer</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Public Email Address</Label>
              <Input 
                value={data.contact.email}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })}
                placeholder="contact@ahamgraham.com"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Phone Number</Label>
              <Input 
                value={data.contact.phone}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })}
                placeholder="+91 98765 43210"
                className="bg-background"
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default FooterPage;
