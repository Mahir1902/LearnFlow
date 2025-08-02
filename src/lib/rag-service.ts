import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "./supabase/server";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

export type RetrievedContext = {
    content: string;
    metadata: Record<string, any>;
    score: number;
}

export async function retrieveRelevantContext(query:string, videoId:string, topK: number = 5): Promise<RetrievedContext[]> {
        const spabaseclient = await createClient()

        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
        })

        const vectorStore = new SupabaseVectorStore(embeddings, {
            client: spabaseclient,
            tableName: "documents",
            queryName: "match_documents",
        })

        const results = await vectorStore.similaritySearchWithScore(query, topK, {
            video_id: videoId,
        })

        return results.map(([doc, score]) => ({
            content: doc.pageContent,
            metadata: doc.metadata,
            score,
        }))
}


export function formatContextForPrompt(contexts: RetrievedContext[]): string {
    return contexts
      .map((ctx, idx) => `[Context ${idx + 1}]:\n${ctx.content}`)
      .join('\n\n');
  }