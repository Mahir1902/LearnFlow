import { createMessage, getChatById, getChatHistory } from "@/app/actions/chat-actions";
import { formatContextForPrompt, retrieveRelevantContext } from "@/lib/rag-service";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const supabaseClient = await createClient();

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, chatId } = await req.json();

    const chat = await getChatById(chatId);
    if (!chat || chat.userId !== userData.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lastMessage = messages[messages.length - 1];

    await createMessage(chatId, lastMessage.content, "user");

    const contexts = await retrieveRelevantContext(lastMessage.content, chat.videoId, 5);

    const contextPrompt = formatContextForPrompt(contexts);

    // Get chat history for additional context
    const history = await getChatHistory(chatId, 5);
    const historyContext = history.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

    const systemPrompt = `You are a helpful AI assistant discussing a YouTube video. 
    
      Video Title: ${chat.title}

      Relevant Context from the video transcript:
      ${contextPrompt}

      Previous conversation:
      ${historyContext}

      Instructions:
      - Answer questions based on the video content provided in the context.
      - If the user asks about something not in the context, politely mention that you can only discuss what's in the video.
      - Be conversational and helpful.
      - Keep responses concise but comprehensive.

      CRITICAL Formatting Rules (MUST FOLLOW):
      
      1. **Structure & Spacing:**
         - Start with a brief introduction sentence
         - Use proper paragraph breaks (double line breaks) between different ideas
         - Add spacing before and after lists
         - Add spacing before and after headings
      
      2. **Headings Usage:**
         - Use ## for main sections (not # - save that for titles)
         - Use ### for subsections
         - Always add a blank line before and after headings
      
      3. **Lists & Points:**
         - Use bullet points (-) for unordered lists
         - Use numbers (1. 2. 3.) for sequential or ranked items
         - Add a blank line before starting any list
         - Keep list items concise
      
      4. **Emphasis & Quotes:**
         - Use **bold** for key terms and important concepts
         - Use *italics* for subtle emphasis
         - Use > for direct quotes from the video
         - Add spacing around quote blocks
      
      5. **Response Structure Template:**
         [Opening paragraph addressing the question]
         
         ## [Main Topic Heading]
         
         [Content paragraph]
         
         ### [Subtopic if needed]
         
         - **Key Point 1:** Explanation
         - **Key Point 2:** Explanation
         
         [Another paragraph if needed]
         
         ### [Another Subtopic]
         
         > "Quote from video if relevant"
         
         [Concluding thoughts]
      
      Remember: White space is your friend. Better to have too much spacing than too little.`;

    // Stream the response
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages,
      onFinish: async ({ text }) => {
        // Save assistant message after streaming completes
        await createMessage(chatId, text, "assistant");
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
