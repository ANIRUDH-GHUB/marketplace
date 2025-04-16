import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  isActive: boolean;
  type: 'prompt' | 'openapi';
  icon?: string;
}

interface ChatResponse {
  response: string;
}

export const agentApi = createApi({
  reducerPath: 'agentApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/agents' }),
  tagTypes: ['Agent'],
  endpoints: (builder) => ({
    // Get all agents
    getAgents: builder.query<Agent[], void>({
      query: () => '/agent-list',
      providesTags: ['Agent'],
      transformResponse: (response: any) => {
        // Mock response
        return [
          {
            id: "1",
            name: "Analysis Assistant",
            description: "Advanced data analysis and visualization agent",
            category: "Analysis",
            capabilities: ["Data Analysis", "Visualization"],
            isActive: true,
            type: "openapi"
          },
          {
            id: "2",
            name: "Chat Bot",
            description: "Intelligent conversational agent for customer support",
            category: "Chat",
            capabilities: ["Conversation", "Support"],
            isActive: true,
            type: "prompt"
          }
        ];
      }
    }),

    // Create new agent
    createAgent: builder.mutation<Agent, Partial<Agent>>({
      query: (agent) => ({
        url: '/create',
        method: 'POST',
        body: agent,
      }),
      invalidatesTags: ['Agent'],
      transformResponse: (response: any) => {
        // Mock response
        return {
          id: Date.now().toString(),
          name: response.name,
          description: response.description,
          category: response.category,
          capabilities: response.capabilities,
          isActive: true,
          type: response.type
        };
      }
    }),

    // Update agent
    updateAgent: builder.mutation<Agent, Partial<Agent>>({
      query: (agent) => ({
        url: '/update',
        method: 'PUT',
        body: agent,
      }),
      invalidatesTags: ['Agent'],
      transformResponse: (response: any) => {
        // Mock response
        return response;
      }
    }),

    // Delete agent
    deleteAgent: builder.mutation<void, string>({
      query: (id) => ({
        url: '/delete',
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: ['Agent'],
    }),

    // Chat with agent
    chatWithAgent: builder.query<ChatResponse, { query: string }>({
      query: ({ query }) => ({
        url: '/chat',
        method: 'GET',
        params: { query },
      }),
      transformResponse: (response: any) => {
        // Mock response
        return {
          response: "This is a mock response from the agent. In a real implementation, this would come from your AI service."
        };
      }
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useChatWithAgentQuery,
} = agentApi; 