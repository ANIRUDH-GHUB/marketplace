'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Upload, Lock, Key, Eye, EyeOff, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const categories = [
  'General',
  'Development',
  'Data Analysis',
  'Content Creation',
  'Customer Support',
  'Research',
  'Education',
];

const capabilities = [
  'Text Generation',
  'Code Generation',
  'Data Analysis',
  'Image Generation',
  'Audio Processing',
  'Video Processing',
  'Natural Language Processing',
  'Machine Learning',
  'Web Scraping',
  'API Integration',
];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string(),
  hostUrl: z.string().url('Please enter a valid URL'),
  capabilities: z.array(z.string()),
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
  initialData?: Partial<FormData>;
  onSave: (data: FormData) => void;
  onCancel: () => void;
}

export function AgentForm({ agentType, initialData, onSave, onCancel }: AgentFormProps) {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [selectedAuth, setSelectedAuth] = useState<('SPNEGO' | 'OIDC')[]>(initialData?.authentication || []);
  const [showSecret, setShowSecret] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(initialData?.capabilities || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const jsonContent = JSON.parse(content);
          setFileContent(JSON.stringify(jsonContent, null, 2));
        } catch {
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
      JSON.parse(content);
      setValue('openApiSpec', content);
    } catch {
      setValue('openApiSpec', content);
    }
  };

  const toggleCapability = (capability: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capability)
        ? prev.filter((c) => c !== capability)
        : [...prev, capability]
    );
    setValue('capabilities', selectedCapabilities);
  };

  const onSubmit = (data: FormData) => {
    onSave({
      ...data,
      capabilities: selectedCapabilities,
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

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={(value) => setValue('category', value)}
            defaultValue={initialData?.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hostUrl">Host URL</Label>
          <Input
            id="hostUrl"
            {...register('hostUrl')}
            placeholder="https://api.example.com"
          />
          {errors.hostUrl && (
            <p className="text-sm text-destructive">{errors.hostUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Capabilities</Label>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((capability) => (
              <Badge
                key={capability}
                variant={selectedCapabilities.includes(capability) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleCapability(capability)}
              >
                {capability}
                {selectedCapabilities.includes(capability) ? (
                  <X size={12} className="ml-1" />
                ) : (
                  <Plus size={12} className="ml-1" />
                )}
              </Badge>
            ))}
          </div>
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
                onValueChange={(value: ('SPNEGO' | 'OIDC')[]) => setSelectedAuth(value)}
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

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Agent' : 'Register Agent'}
        </Button>
      </div>
    </form>
  );
} 