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
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { chats } from "@/lib/db/schema";

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

type UserChats = typeof chats.$inferSelect

export function NavMain({userChats}: {userChats: UserChats[]}) {

  const pathname = usePathname()
  const router = useRouter()
  console.log(pathname)
  const chatId = pathname.split('/').pop()
  


  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      {/* map over chats in db */}
      <div className="flex flex-col gap-2">
        {userChats.map((chat, index) => (
          <div key={index} onClick={() => router.push(`/chat/${chat.id}`)} className={`rounded-md ${chatId === chat.id ? 'bg-sidebar-item-active' : ''} hover:bg-sidebar-item-active/50 text-sm p-2 truncate`}>
            {chat.title}
          </div>
        ))}
      </div>
      {/* <SidebarMenu className="gap-2">
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
      </SidebarMenu> */}
    </SidebarGroup>
  );
}
