"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { AgentCard } from "@/components/agents/AgentCard";
import { AgentSkeleton } from "@/components/agent-skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAgentsQuery } from "@/lib/store/agentApi";

export default function Home() {
  const { data: agents, isLoading, error } = useGetAgentsQuery();

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center text-destructive">
          Error loading agents. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="automation">Automation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              <AgentSkeleton />
              <AgentSkeleton />
              <AgentSkeleton />
            </>
          ) : (
            agents?.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onUpdate={(updatedAgent) => {
                  // Handle update through API
                  console.log('Update agent:', updatedAgent);
                }}
                onDelete={(id) => {
                  // Handle delete through API
                  console.log('Delete agent:', id);
                }}
                onToggleActive={(id) => {
                  // Handle toggle active through API
                  console.log('Toggle active:', id);
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}