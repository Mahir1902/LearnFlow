'use server'

import { createClient } from "@/lib/supabase/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const embedAndStore = async (videoUrl: string) => {

    // const chunks = await chunkTranscript(videoUrl)
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
    
        const supabaseClient = await createClient()
    
        const vectorStore = new SupabaseVectorStore(embeddings, {
            client: supabaseClient,
            tableName: 'documents',
        })
    
        await vectorStore.addDocuments(chunks) 
        
    } catch (error) {
        console.log(error)
    }
    
}
