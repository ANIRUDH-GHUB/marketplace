"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bot, Code2, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface AgentCardProps {
  name: string;
  description: string;
  type: "OpenAPI" | "Prompt";
  status: "active" | "inactive";
  category: string;
}

export function AgentCard({ name, description, type, status, category }: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {type === "OpenAPI" ? (
                <Code2 className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
              <h3 className="font-semibold">{name}</h3>
            </div>
            <Switch
              checked={status === "active"}
              onCheckedChange={() => {}}
              aria-label="Toggle agent status"
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Badge variant="secondary">{category}</Badge>
          <Badge variant={type === "OpenAPI" ? "default" : "outline"}>{type}</Badge>
        </CardFooter>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-[200%] group-hover:animate-shimmer" />
      </Card>
    </motion.div>
  );
}