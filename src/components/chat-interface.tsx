"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { CSSProperties, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Textarea } from "./ui/textarea";
import { AutosizeTextarea } from "./auto-size-textarea";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface ChatInterfaceProps {
  chatId: string;
  initialMessages?: any[];
}

export function ChatInterface({ chatId, initialMessages = [] }: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat/stream",
    body: {
      chatId,
    },
    initialMessages,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col bg-background-secondary">
      {/* Messages scroll area */}
      <div className="min-h-0 flex-1 overflow-y-auto" ref={scrollAreaRef}>
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground py-8 text-center">Ask a question about the video to get started!</div>
          </div>
        )}
        <div className={cn("flex flex-col gap-3 p-4")}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("rounded-lg px-4 py-2 text-wrap", message.role === "user" ? "bg-[#303030]" : "")}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-md dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !match ? (
                          // @ts-ignore
                          <SyntaxHighlighter style={dark} language={match?.[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input form */}
      <div className="flex-shrink-0">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex items-end gap-2 rounded-lg bg-[#303030] p-2">
            <AutosizeTextarea
              value={input}
              maxHeight={120}
              className="flex-1 resize-none border-none bg-inherit focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={handleInputChange}
              placeholder="Ask about the video..."
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading}
              className="text-muted-foreground group border-none bg-inherit hover:bg-inherit"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
