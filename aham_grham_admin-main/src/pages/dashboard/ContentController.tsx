import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  LayoutGrid, 
  Code, 
  Library, 
  Calendar, 
  MessageSquareQuote, 
  ShoppingCart,
  ArrowRight,
  Settings2,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText } from 'lucide-react';

const ContentController = () => {
  const navigate = useNavigate();

  const controlSections = [
    {
      title: "Page Content",
      description: "Customize top banners, titles, and backgrounds for all main pages.",
      icon: Sparkles,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      path: "/dashboard/hero"
    },
    {
      title: "Footer & Branding",
      description: "Update the site slogan, logo settings, and footer link structures.",
      icon: LayoutGrid,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      path: "/dashboard/footer"
    },
    {
      title: "AI & Meta Tags",
      description: "Manage dynamic marquee tags and SEO meta information.",
      icon: Code,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      path: "/dashboard/aitags"
    },
    {
      title: "Programs & Courses",
      description: "Add or edit yoga programs, descriptions, and scheduling.",
      icon: Library,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      path: "/dashboard/programs"
    },
    {
      title: "Events & Workshops",
      description: "Control upcoming workshop details, dates, and event imagery.",
      icon: Calendar,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      path: "/dashboard/events"
    },
    {
      title: "Testimonial Hub",
      description: "Review and manage user feedback and lineage voice quotes.",
      icon: MessageSquareQuote,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      path: "/dashboard/testimonials"
    },
    {
      title: "E-Commerce Suite",
      description: "Add new products, manage categories, and track orders.",
      icon: ShoppingCart,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      path: "/eCommerce/product-list"
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-primary" />
          Content Controller
        </h1>
        <p className="text-muted-foreground text-lg">
          The central hub for managing all dynamic content across the Aham Grham platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {controlSections.map((section, index) => (
          <Card key={index} className="group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl ${section.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                <section.icon className={`w-6 h-6 ${section.color}`} />
              </div>
              <CardTitle className="text-xl">{section.title}</CardTitle>
              <CardDescription className="min-h-[40px]">{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full group/btn flex items-center justify-between"
                onClick={() => navigate(section.path)}
              >
                <span>Manage Content</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="py-10 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary/40" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">New Feature Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              We are working on a drag-and-drop page builder to give you full control over site layouts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentController;
