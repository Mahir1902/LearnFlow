import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Link,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

import YoutubeLinkForm from "./forms/YoutubeLinkForm";

// This is sample data.


export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient();

  

  const { data: user } = await supabase.auth.getUser();

  const userData = {
    name: user.user?.user_metadata?.fullname ?? "",
    email: user.user?.email ?? "",
    // avatar: user?.user?.user_metadata?.avatar_url,
  };

  console.log(user);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="mb-5 px-4 py-2">
        <h1 className="text-2xl font-bold">Logo</h1>
      </SidebarHeader>
      <SidebarContent>
        <Dialog>
          <DialogTrigger asChild>
            <div className="w-full px-2">
              <Button className="w-full">
                <Link />
                New Video
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="w-md">
            <DialogHeader>
              <DialogTitle>Enter a youtube video link</DialogTitle>
            </DialogHeader>
            <YoutubeLinkForm />
          </DialogContent>
        </Dialog>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
