// Ticket Types - Helpdesk System

export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketCategory = 'bug' | 'billing' | 'feature' | 'other';
export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  email: string;
  priority: TicketPriority;
  category: TicketCategory;
  status: TicketStatus;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  email: string;
  priority: TicketPriority;
  category: TicketCategory;
  status: TicketStatus;
  attachmentUrl?: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  search?: string;
}
