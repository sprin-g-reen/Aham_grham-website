"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Tv,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Gauge,
  ShoppingCart,
  LayoutGrid,
  File,
  Grid2x2,
  Landmark,
  LockKeyhole,
  CircleUserRound,
  ChartNoAxesCombined,
  TriangleAlert,
  Code,
  Droplet,
  Library,
  Calendar,
  Eye,
  MessageSquareQuote,
  Sparkles
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Jhon Deo",
    email: "m@example.com",
    avatar: "https://github.com/evilrabbit.png",
  },
  teams: [
    {
      name: "Aham Grham",
      logo: GalleryVerticalEnd,
      plan: "Admin Dashboard",
    },
  ],
  overview: [
    {
      title: "Overview",
      url: "dashboard/overview",
      icon: Gauge,
    },
    {
      title: "Add Program",
      url: "dashboard/programs",
      icon: Library,
    },
    {
      title: "Program Details",
      url: "dashboard/program-details",
      icon: Eye,
    },
    {
      title: "Add Event",
      url: "dashboard/events",
      icon: Calendar,
    },
    {
      title: "Event Details",
      url: "dashboard/event-details",
      icon: Eye,
    },
    {
      title: "Add Testimonials",
      url: "dashboard/testimonials",
      icon: MessageSquareQuote,
    },
    {
      title: "About Us",
      url: "dashboard/about",
      icon: BookOpen,
    },
    {
      title: "Page Content",
      url: "dashboard/hero",
      icon: Sparkles,
    },
    {
      title: "Our Centers",
      url: "dashboard/centers",
      icon: Landmark,
    },
    {
      title: "AI Tags",
      url: "dashboard/aitags",
      icon: Code,
    },
    {
      title: "Content Controller",
      url: "dashboard/content-controller",
      icon: Settings2,
    },
    {
      title: "Footer Section",
      url: "dashboard/footer",
      icon: LayoutGrid,
    },
    {
      title: "Product List",
      url: "eCommerce/product-list",
      icon: ShoppingCart,
    },
    {
      title: "Product Grid",
      url: "eCommerce/product-grid",
      icon: ShoppingCart,
    },
    {
      title: "Add Product",
      url: "eCommerce/add-product",
      icon: ShoppingCart,
    },
    {
      title: "Categories",
      url: "eCommerce/categories",
      icon: ShoppingCart,
    },
    {
      title: "Order List",
      url: "eCommerce/order-list",
      icon: ShoppingCart,
    },
    {
      title: "Order Details",
      url: "eCommerce/order-details",
      icon: ShoppingCart,
    },
    {
      title: "Customer List",
      url: "eCommerce/customer-list",
      icon: ShoppingCart,
    },
    {
      title: "Customer Details",
      url: "eCommerce/customer-details/1",
      icon: ShoppingCart,
    },
    {
      title: "Invoice",
      url: "eCommerce/invoice",
      icon: ShoppingCart,
    },
    {
      title: "Authentication",
      url: "#",
      icon: LockKeyhole,
      items: [
        {
          title: "Basic",
          url: "#",
          items: [
            {
              title: "Login",
              url: "auth/basic/login",
            },
            {
              title: "Register",
              url: "auth/basic/register",
            },
            {
              title: "Verify Email",
              url: "auth/basic/verify-email",
            },
            {
              title: "Forgot Password",
              url: "auth/basic/forgot-password",
            },
            {
              title: "New Password",
              url: "auth/basic/reset-password",
            },
            {
              title: "Reset Success",
              url: "auth/basic/password-reset-success",
            },
          ],
        },
        {
          title: "Cover",
          url: "#",
          items: [
            {
              title: "Login",
              url: "auth/cover/login",
            },
            {
              title: "Register",
              url: "auth/cover/register",
            },
            {
              title: "Verify Email",
              url: "auth/cover/verify-email",
            },
            {
              title: "Forgot Password",
              url: "auth/cover/forgot-password",
            },
            {
              title: "New Password",
              url: "auth/cover/new-password",
            },
            {
              title: "Reset Success",
              url: "auth/cover/password-reset-success",
            },
          ],
        },
      ],
    },
    {
      title: "Accounts",
      url: "#",
      icon: CircleUserRound,
      items: [
        {
          title: "Profile",
          url: "account/profile",
        },
        {
          title: "Edit Profile",
          url: "account/edit-profile",
        },
        {
          title: "Password Setting",
          url: "account/password-setting",
        },
        {
          title: "Noitifications",
          url: "account/notifications",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: Code,
      items: [
        {
          title: "Docs",
          url: "docs",
        },
        {
          title: "Upload",
          url: "forms/file-upload",
        },
      ],
    },
    {
      title: "Pricing",
      url: "pricing/pricing-tables",
      icon: Landmark,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon"
     {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.overview} label="Dashboard" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
