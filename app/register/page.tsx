'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare } from 'lucide-react';
import { AgentForm } from '@/components/agents/AgentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [agentType, setAgentType] = useState<'prompt' | 'openapi'>('prompt');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register New Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="prompt"
                className="flex items-center gap-2"
                onClick={() => setAgentType('prompt')}
              >
                <MessageSquare size={20} />
                Prompt-based
              </TabsTrigger>
              <TabsTrigger
                value="openapi"
                className="flex items-center gap-2"
                onClick={() => setAgentType('openapi')}
              >
                <FileText size={20} />
                OpenAPI-based
              </TabsTrigger>
            </TabsList>
            <TabsContent value="prompt">
              <AgentForm agentType="prompt" />
            </TabsContent>
            <TabsContent value="openapi">
              <AgentForm agentType="openapi" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
} 