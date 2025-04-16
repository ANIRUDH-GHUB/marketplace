"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { LLMResponseRenderer } from "@/components/chat/LLMResponseRenderer";

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: content,
        // content:
        //   "This is a simulated response. In a real implementation, this would come from your AI service.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const formatMessage = (content: string) => {
    const html = marked(content);
    return DOMPurify.sanitize(html);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="flex flex-col h-[600px]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
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
                    {/* <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.content),
                      }}
                    /> */}
                  </div>
                </motion.div>
              ))}
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
              />
              <Button onClick={handleSend}>
                <Send size={16} className="mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
