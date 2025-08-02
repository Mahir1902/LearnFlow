import db from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"


// Get all chats based on user
export async function GET(request: Request) {
try {
    const {searchParams} = new URL(request.url)
    const userId = searchParams.get("userId")
    const chatId = searchParams.get("chatId")

    if(!userId && !chatId) {
        return NextResponse.json({error: "User ID or Chat ID are required"}, {status: 400})
    }

    if(userId) {
        const userChats = await db.select().from(chats).where(eq(chats.userId, userId))
        return NextResponse.json(userChats || [])
    }

    if(chatId) {
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
        return NextResponse.json(_chats[0] || [])
    }
   
    } catch (error) {
        console.error("Error fetching chats:", error)
        return NextResponse.json({error: "Failed to fetch chats"}, {status: 500})
    }
}