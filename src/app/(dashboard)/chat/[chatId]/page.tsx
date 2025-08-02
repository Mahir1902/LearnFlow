"use client";

import { getChatById } from "@/app/actions/chat-actions";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
// import { retriveChapters } from "@/app/actions/retrive-chapters"
import db from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { eq } from "drizzle-orm";
import { Book, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = useParams();
  const leftDivRef = useRef<HTMLDivElement>(null);
  const rightDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isResizingRef = useRef(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    if (!isResizingRef.current || !leftDivRef.current || !rightDivRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = e.clientX - containerRect.left;

    const minWidth = 400;
    const maxWidth = containerRect.width - 450;

    const clampedWidth = Math.max(minWidth, Math.min(newLeftWidth, maxWidth));

    leftDivRef.current.style.width = `${clampedWidth}px`;
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const {
    data: chatData,
    isLoading: isChatLoading,
    isError: isChatError,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.get(`/api/chat?chatId=${chatId}`);
      console.log("response", response);
      return response.data;
    },
  });

  const {
    data: messages,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const response = await axios.get(`/api/chat/messages?chatId=${chatId}`);
      return response.data;
    },
  });

  if (isChatLoading || isMessagesLoading) return <div>Loading...</div>;
  {
    isChatError ? <div>Error loading chat data</div> : isMessagesError ? <div>Error loading messages</div> : null;
  }
  if (!chatData) return <div>No chat data</div>;

  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden border border-t">
      <div ref={leftDivRef} className="w-1/2 px-2">
        <div className="mt-2 aspect-video rounded-lg">
          <iframe
            className="h-full w-full rounded-md"
            src={chatData && `https://www.youtube.com/embed/${chatData.videoId}`}
            title={chatData.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write;  gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div
        className="h-full w-[2px] cursor-ew-resize bg-gray-300/10 transition-colors hover:bg-gray-300/40"
        onMouseDown={handleMouseDown}
      />
      {/* Chats section and notes*/}
      <div ref={rightDivRef} className="flex-1">
        <div className="flex h-full w-full flex-col ">
          <div className="bg-background-secondary flex-shrink-0 p-2">
            <div className="bg-background flex w-full gap-2 rounded-lg p-2">
              <Button className="text-highlight-blue bg-highlight-blue/20 border border-highlight-blue hover:bg-highlight-blue/30 flex-1 cursor-pointer">
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
              <Button className="flex-1 border-none bg-inherit text-white hover:bg-inherit cursor-pointer">
                <Book className="h-4 w-4" />
                Notes
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <ChatInterface
              chatId={chatId as string}
              initialMessages={
                messages?.map((msg: any) => ({
                  id: msg.id,
                  role: msg.role,
                  content: msg.content,
                })) || []
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
