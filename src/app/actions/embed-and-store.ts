'use server'

import { createClient } from "@/lib/supabase/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import db from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { FilteredVideoInfo } from "@/types";
import { redirect } from "next/navigation";

export const embedAndStore = async (videoUrl: string, videoData: FilteredVideoInfo) => {

    // const chunks = await chunkTranscript(videoUrl)
    const supabaseClient = await createClient()

    const {data: userData, error: userError} = await supabaseClient.auth.getUser()



    if(userError || !userData.user) {
        redirect('/login')
    }

    console.log('videoData', videoData)
    try {
        const loader = YoutubeLoader.createFromUrl(videoUrl, {
            language: "en",
            addVideoInfo: true,
        })
        
    
        const youtubeDoc = await loader.load()
    
        const transcript = youtubeDoc[0].pageContent
        const videoId = youtubeDoc[0].metadata.source
        const description = youtubeDoc[0].metadata.description
    
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        }) 
    
        const chunks = await splitter.splitDocuments([new Document({pageContent: transcript, metadata: {video_id: videoId}})])
    
        const embeddings = new OpenAIEmbeddings({
            modelName: "text-embedding-3-small",
        })
    
        // const supabaseClient = await createClient()
    
        const vectorStore = new SupabaseVectorStore(embeddings, {
            client: supabaseClient,
            tableName: 'documents',
        })
    
        await vectorStore.addDocuments(chunks) 
        
        const [newChat] = await db.insert(chats).values({
            id: crypto.randomUUID(),
            userId: userData.user.id,
            title: videoData.title,
            videoId: videoData.video_id || '',
            videoUrl: videoUrl,
        }).returning()

        return {
            success: true,
            chatId: newChat.id,
        }
    } catch (error) {
        console.log(error)
    }
    
}
