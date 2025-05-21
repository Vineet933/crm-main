import { Lead, Conversation } from "../types";

const API_BASE = "/api";

// Lead API calls
export const leadApi = {
  // Get all leads
  getAll: async (): Promise<Lead[]> => {
    const response = await fetch(`${API_BASE}/leads`);
    if (!response.ok) throw new Error("Failed to fetch leads");
    return response.json();
  },

  // Get single lead
  getOne: async (id: string): Promise<Lead> => {
    const response = await fetch(`${API_BASE}/leads?id=${id}`);
    if (!response.ok) throw new Error("Failed to fetch lead");
    return response.json();
  },

  // Create new lead
  create: async (
    lead: Omit<Lead, "id" | "createdAt" | "updatedAt">
  ): Promise<Lead> => {
    const response = await fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error("Failed to create lead");
    return response.json();
  },

  // Update lead
  update: async (id: string, lead: Partial<Lead>): Promise<Lead> => {
    const response = await fetch(`${API_BASE}/leads?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error("Failed to update lead");
    return response.json();
  },

  // Delete lead
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/leads?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete lead");
  },
};

// Conversation API calls
export const conversationApi = {
  // Get all conversations for a lead
  getByLead: async (leadId: string): Promise<Conversation[]> => {
    const response = await fetch(`${API_BASE}/conversations?leadId=${leadId}`);
    if (!response.ok) throw new Error("Failed to fetch conversations");
    return response.json();
  },

  // Create new conversation
  create: async (
    conversation: Omit<Conversation, "id" | "date">
  ): Promise<Conversation> => {
    const response = await fetch(`${API_BASE}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conversation),
    });
    if (!response.ok) throw new Error("Failed to create conversation");
    return response.json();
  },

  // Update conversation
  update: async (
    id: string,
    conversation: Partial<Conversation>
  ): Promise<Conversation> => {
    const response = await fetch(`${API_BASE}/conversations?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conversation),
    });
    if (!response.ok) throw new Error("Failed to update conversation");
    return response.json();
  },

  // Delete conversation
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/conversations?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete conversation");
  },
};
