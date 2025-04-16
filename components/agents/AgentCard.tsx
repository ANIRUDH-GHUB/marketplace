"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Eye, Edit, Trash, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Code, Network } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AgentForm } from "./AgentForm";
import { cn } from "@/lib/utils";
import { useUpdateAgentMutation, useDeleteAgentMutation } from "@/lib/store/agentApi";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  isActive: boolean;
  type: "prompt" | "openapi";
  icon?: string;
}

interface AgentCardProps {
  agent: Agent;
  onUpdate: (agent: Agent) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function AgentCard({ agent, onUpdate, onDelete, onToggleActive }: AgentCardProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updateAgent] = useUpdateAgentMutation();
  const [deleteAgent] = useDeleteAgentMutation();

  const handleUpdate = async (data: Partial<Agent>) => {
    try {
      const updatedAgent = await updateAgent({ ...agent, ...data }).unwrap();
      onUpdate(updatedAgent);
      setIsEditOpen(false);
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAgent(agent.id).unwrap();
      onDelete(agent.id);
    } catch (error) {
      console.error('Failed to delete agent:', error);
    }
  };

  const handleToggleActive = async () => {
    try {
      const updatedAgent = await updateAgent({
        ...agent,
        isActive: !agent.isActive
      }).unwrap();
      onToggleActive(updatedAgent.id);
    } catch (error) {
      console.error('Failed to toggle agent status:', error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: agent.isActive ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "transition-all duration-200",
          !agent.isActive && "opacity-70"
        )}
      >
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg",
            agent.isActive
              ? "border-l-4 border-green-500 bg-card"
              : "bg-muted/50 border-muted"
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex gap-3 items-start">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    agent.isActive ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  {agent.icon ? (
                    <img
                      src={agent.icon}
                      alt={agent.name}
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    <Bot
                      size={20}
                      className={cn(
                        agent.isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>
                <div>
                  <CardTitle
                    className={cn(
                      "text-lg font-semibold",
                      !agent.isActive && "text-muted-foreground"
                    )}
                  >
                    {agent.name}
                  </CardTitle>

                  <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                    {agent.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={agent.isActive}
                  onCheckedChange={handleToggleActive}
                  className="data-[state=checked]:bg-green-500"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsViewOpen(true)}
                      disabled={!agent.isActive}
                    >
                      <Eye size={14} className="mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsEditOpen(true)}
                      disabled={!agent.isActive}
                    >
                      <Edit size={14} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={!agent.isActive}
                    >
                      <Trash size={14} className="mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <hr className="border-muted mx-4 mb-3" />

          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Description
              </h4>
              <p
                className={cn(
                  "text-sm",
                  !agent.isActive && "text-muted-foreground"
                )}
              >
                {agent.description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Capabilities
              </h4>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((capability) => (
                  <Badge
                    key={capability}
                    variant="outline"
                    className={cn(
                      "px-2 py-1 text-xs",
                      !agent.isActive && "border-muted text-muted-foreground"
                    )}
                  >
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
            {/* Add styles to div to full width */}
            <div className="flex justify-end">
              <Badge
                variant={agent.type === "openapi" ? "default" : "outline"}
                className="mt-1 flex items-center gap-1 w-fit"
              >
                {agent.type === "openapi" ? (
                  <Network size={12} className="mr-1" />
                ) : (
                  <Code size={12} className="mr-1" />
                )}
                {agent.type === "openapi" ? "OpenAPI" : "Prompt"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg",
                  agent.isActive ? "bg-primary/10" : "bg-muted"
                )}
              >
                {agent.icon ? (
                  <img
                    src={agent.icon}
                    alt={agent.name}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <Bot
                    size={24}
                    className={cn(
                      agent.isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{agent.name}</h2>
                <p className="text-muted-foreground">{agent.category}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{agent.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability) => (
                    <Badge
                      key={capability}
                      variant="outline"
                      className="px-2 py-1"
                    >
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <Badge
                  variant={agent.isActive ? "default" : "secondary"}
                  className={cn(
                    "px-2 py-1",
                    agent.isActive
                      ? "bg-green-500/20 text-green-500"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {agent.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          <AgentForm
            agentType={agent.type}
            initialData={agent}
            onSave={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
