"use client";

import { ChevronRight, Home, LayoutDashboard, Notebook, VideoIcon, type LucideIcon } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const data = [
  {
   title: 'Dashboard',
   url: '/dashboard',
   icon: LayoutDashboard,
   isActive: true,
  },
  {
   title: 'Videos',
   url: '/videos',
   icon: VideoIcon,
   isActive: true,
  },
  {
   title: 'Notes',
   url: '/Notes',
   icon: Notebook,
   isActive: true,
  },
 ]

export function NavMain() {

  const pathname = usePathname()
  


  return (
    <SidebarGroup>
      <SidebarMenu className="gap-2">
        {data.map((item) => (
          <Link href={item.url} key={item.title} className={cn( 'rounded-sm  ',pathname === item.url ? " bg-blue-500 text-white" : 'text-muted-foreground ')}>
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
