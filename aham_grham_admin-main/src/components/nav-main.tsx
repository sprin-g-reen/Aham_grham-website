"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type MenuItem = {
  title: string
  url: string
  icon?: LucideIcon
  items?: MenuItem[]
}

export function NavMain({ items, label = "Platform" }: { items: MenuItem[], label?: string }) {
  const location = useLocation()

  const isActiveRoute = (url: string) => {
    return location.pathname === `/${url}` ||
           location.pathname.startsWith(`/${url}`)
  }

  const renderMenuItems = (menuItems: MenuItem[]) => {
    return menuItems.map((item) => {
      const hasChildren = item.items && item.items.length > 0

      // Check if any child is active
      const isParentActive =
        hasChildren &&
        item.items!.some((sub) =>
          sub.items
            ? sub.items.some((child) =>
                location.pathname.startsWith(`/${child.url}`)
              )
            : location.pathname.startsWith(`/${sub.url}`)
        )

      if (!hasChildren) {
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActiveRoute(item.url)}
            >
              <Link to={item.url}>
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      }

      return (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={isParentActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isParentActive}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) =>
                  subItem.items ? (
                    <SidebarMenuSubItem key={subItem.title}>
                      <Collapsible
                        defaultOpen={subItem.items.some((child) =>
                          location.pathname.startsWith(`/${child.url}`)
                        )}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton>
                            <span>{subItem.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {subItem.items.map((child) => (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActiveRoute(child.url)}
                                >
                                  <Link to={child.url}>
                                    <span>{child.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuSubItem>
                  ) : (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActiveRoute(subItem.url)}
                      >
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    })
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {renderMenuItems(items)}
      </SidebarMenu>
    </SidebarGroup>
  )
}