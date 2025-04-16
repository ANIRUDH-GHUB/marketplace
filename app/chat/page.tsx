"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { LLMResponseRenderer } from "@/components/chat/LLMResponseRenderer";
import { useChatWithAgentQuery } from "@/lib/store/agentApi";

const content = `## Welcome to Your Quick Dev Guide! 🚀

Here's a breakdown of some popular web frameworks and their features:

### 🔍 Framework Comparison Table \

| Framework   | Language | Performance ⚡ | Learning Curve 📘 | Popularity ⭐ |
|-------------|----------|----------------|-------------------|---------------|
| Express.js  | Node.js  | Medium          | Easy              | ⭐⭐⭐⭐         |
| Flask       | Python   | Medium          | Easy              | ⭐⭐⭐⭐         |
| FastAPI     | Python   | High            | Medium            | ⭐⭐⭐⭐⭐        |
| Spring Boot | Java     | High            | Hard              | ⭐⭐⭐⭐         |
| Ruby on Rails | Ruby   | Medium          | Medium            | ⭐⭐⭐          |

### 📦 Sample Code Snippet (FastAPI)

\`\`\`pythonW
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "🔥 Hello from FastAPI"}
\`\`\`
`;

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatHistory {
  messages: Message[];
  metadata: {
    agentId: string;
    agentName: string;
    startTime: Date;
    lastUpdated: Date;
  };
}

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [],
    metadata: {
      agentId: "default",
      agentName: "Default Agent",
      startTime: new Date(),
      lastUpdated: new Date(),
    },
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { refetch: chatWithAgent } = useChatWithAgentQuery(
    { query: input },
    { skip: true }
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory.messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setChatHistory((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      metadata: {
        ...prev.metadata,
        lastUpdated: new Date(),
      },
    }));
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithAgent();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data?.response || "No response received",
        role: "assistant",
        timestamp: new Date(),
      };

      setChatHistory((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date(),
        },
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = async (content: string) => {
    const html = await marked(content);
    return DOMPurify.sanitize(html);
  };

  const exportChatHistory = async () => {
    const formattedHistory = {
      messages: chatHistory.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      metadata: {
        ...chatHistory.metadata,
        startTime: chatHistory.metadata.startTime,
        lastUpdated: chatHistory.metadata.lastUpdated,
      },
    };

    const historyString = JSON.stringify(formattedHistory, null, 2);
    const blob = new Blob([historyString], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-history-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="flex flex-col h-[600px]">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">{chatHistory.metadata.agentName}</h2>
            <Button variant="outline" onClick={exportChatHistory}>
              Export Chat History
            </Button>
          </div>
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              {chatHistory.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {message.role === "user" ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                      <span className="text-sm font-medium">
                        {message.role === "user" ? "You" : "Assistant"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <LLMResponseRenderer
                      content={message.content}
                      typing={false}
                    />
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Assistant is typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} className="mr-2" />
                )}
                Send
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
