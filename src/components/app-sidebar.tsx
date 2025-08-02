import * as React from "react";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { AppSidebarClient } from "./sidebar";


// This is now a pure Server Component
export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient();

  const {data: userData} = await supabase.auth.getUser()

  console.log("data", userData)

  if (!userData.user) {
    return redirect('/login');
  }

  // We only pass serializable, plain data to the client component
  const profileData = {
    id: userData.user.id,
    name: userData.user.user_metadata?.fullname ?? "No Name",
    email: userData.user.email ?? "",
  };

  return (
    <Sidebar {...props}>
      <AppSidebarClient user={profileData} /> 
    </Sidebar>
  );
}