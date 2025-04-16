'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Upload, Lock, Key, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  prompt: z.string().optional(),
  openApiSpec: z.any().optional(),
  authentication: z.array(z.enum(['SPNEGO', 'OIDC'])).optional(),
  oidc: z.object({
    clientId: z.string().optional(),
    clientSecret: z.string().optional(),
    scope: z.string().optional(),
    namespace: z.string().optional(),
  }).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AgentFormProps {
  agentType: 'prompt' | 'openapi';
}

export function AgentForm({ agentType }: AgentFormProps) {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [selectedAuth, setSelectedAuth] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          // Try to parse as JSON
          const jsonContent = JSON.parse(content);
          setFileContent(JSON.stringify(jsonContent, null, 2));
        } catch {
          // If not JSON, assume YAML
          setFileContent(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFileContent(content);
    try {
      // Try to parse as JSON
      JSON.parse(content);
      setValue('openApiSpec', content);
    } catch {
      // If not JSON, assume YAML
      setValue('openApiSpec', content);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log({
      ...data,
      authentication: selectedAuth,
      openApiSpec: agentType === 'openapi' ? fileContent : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter agent name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Enter agent description"
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {agentType === 'prompt' ? (
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              {...register('prompt')}
              placeholder="Enter agent prompt"
              rows={6}
            />
            {errors.prompt && (
              <p className="text-sm text-destructive">{errors.prompt.message}</p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>OpenAPI Specification</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload size={20} />
                  Upload File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".json,.yaml,.yml"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {fileName && (
                  <span className="text-sm text-muted-foreground">{fileName}</span>
                )}
              </div>
            </div>

            {fileContent && (
              <div className="space-y-2">
                <Label>File Content</Label>
                <Card className="p-4">
                  <ScrollArea className="h-[300px]">
                    <Textarea
                      value={fileContent}
                      onChange={handleFileContentChange}
                      className="font-mono text-sm min-h-[200px]"
                    />
                  </ScrollArea>
                </Card>
              </div>
            )}

            <div className="space-y-2">
              <Label>Authentication</Label>
              <ToggleGroup
                type="multiple"
                value={selectedAuth}
                onValueChange={(value) => setSelectedAuth(value)}
                className="flex gap-2"
              >
                <ToggleGroupItem
                  value="SPNEGO"
                  className="flex items-center gap-2"
                >
                  <Lock size={20} />
                  SPNEGO
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="OIDC"
                  className="flex items-center gap-2"
                >
                  <Key size={20} />
                  OIDC
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {selectedAuth.includes('OIDC') && (
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="text-sm font-medium">
                  OIDC Configuration
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      {...register('oidc.clientId')}
                      placeholder="Enter OIDC client ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <div className="relative">
                      <Input
                        id="clientSecret"
                        type={showSecret ? 'text' : 'password'}
                        {...register('oidc.clientSecret')}
                        placeholder="Enter OIDC client secret"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scope">Scope</Label>
                    <Input
                      id="scope"
                      {...register('oidc.scope')}
                      placeholder="Enter OIDC scope"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="namespace">Namespace</Label>
                    <Input
                      id="namespace"
                      {...register('oidc.namespace')}
                      placeholder="Enter OIDC namespace"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </>
        )}
      </div>

      <Button type="submit" className="w-full">
        Register Agent
      </Button>
    </form>
  );
} 