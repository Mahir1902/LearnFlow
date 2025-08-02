"use server";

import db from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";


export async function getAllChats(userId: string) {
  const userChats = await db.select().from(chats).where(eq(chats.userId, userId));
  return userChats || null;
}

export async function getChatById(chatId: string) {
  const _chat = await db.select().from(chats).where(eq(chats.id, chatId));
  console.log("chat", _chat)
  return _chat[0] || null;
}

export async function getChatMessages(chatId: string) {
  const chatMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt);
  
  return chatMessages || [];
}

export async function createMessage(chatId:string, content:string, role: "user" | "assistant") {
  const supabaseClient = await createClient()

  const {data: userData, error: userError} = await supabaseClient.auth.getUser()

  if(userError || !userData) {
    redirect("/login")
  }

  const chat = await getChatById(chatId)
  if(!chat || chat.userId !== userData.user?.id) {
    throw new Error("Unauthorized")
  } 

  const [newMessage] = await db.insert(messages).values({
    id: crypto.randomUUID(),
    chatId,
    content,
    role,
  }).returning()

  return newMessage
}

export async function getChatHistory(chatId: string, limit: number = 10) {
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
  
  return history.reverse(); // Return in chronological order
}