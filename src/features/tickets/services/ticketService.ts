// Ticket Service - API Communication
import type { Ticket, TicketFilters, TicketFormData } from '../types/ticket';
import type { TicketEditData } from '../validations/ticketSchema';

export class TicketService {
  private static baseUrl = '/api/tickets';

  static async getAllTickets(filters?: TicketFilters): Promise<Ticket[]> {
    const params = new URLSearchParams();

    if (filters?.status) {
      params.append('status', filters.status);
    }

    if (filters?.search) {
      params.append('search', filters.search);
    }

    const url = params.toString()
      ? `${this.baseUrl}?${params.toString()}`
      : this.baseUrl;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro ao buscar tickets');
    }

    const data = await response.json();
    return data.tickets;
  }

  static async getTicketById(id: string): Promise<Ticket> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ticket não encontrado');
      }
      throw new Error('Erro ao buscar ticket');
    }

    const data = await response.json();
    return data.ticket;
  }

  static async createTicket(ticketData: TicketFormData): Promise<Ticket> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar ticket');
    }

    const data = await response.json();
    return data.ticket;
  }

  static async updateTicket(
    id: string,
    ticketData: TicketEditData
  ): Promise<Ticket> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar ticket');
    }

    const data = await response.json();
    return data.ticket;
  }

  static async deleteTicket(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao deletar ticket');
    }
  }
}
