import { Stage } from "@prisma/client";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  linkedIn: string;
  notes?: string;
  tags: string[];
  stage: Stage;
  nextFollowUp?: Date;
  createdAt: Date;
  updatedAt: Date;
  conversations?: Conversation[];
}

export interface Conversation {
  id: string;
  leadId: string;
  type: string;
  content: string;
  timestamp: Date;
  reminder?: Date | null;
  lead?: Lead;
}

export interface Column {
  id: string;
  title: string;
  color: string;
}
