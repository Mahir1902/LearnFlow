'use client';

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import NewChatButton from "./new-chat-button";
import { getAllChats } from "@/app/actions/chat-actions";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";

type UserProfile = {
  id: string;
  name: string;
  email: string;
};

export function AppSidebarClient({ user }: { user: UserProfile }) {
  const { data: userChats, isLoading, isError } = useQuery({
    queryKey: ["chats", user.id],
    queryFn: async () => {
      const response = await axios.get(`/api/chat?userId=${user.id}`)
      console.log("response", response)
      return response.data
    },
    enabled: !!user.id,
  });

  return (
    <>
      <SidebarHeader className="mb-5 px-4 py-2">
        <h1 className="text-2xl font-bold">Logo</h1>
      </SidebarHeader>
      <SidebarContent>
        <NewChatButton />
        {isLoading ? (
          <div className="space-y-2 px-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ) : isError ? (
          <p className="px-4 text-sm text-red-500">Error loading chats.</p>
        ) : (
          <NavMain userChats={userChats || []} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </>
  );
}