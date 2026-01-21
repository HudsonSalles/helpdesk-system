import { TicketService } from '@/features/tickets/services/ticketService';
import { Ticket } from '@/features/tickets/types/ticket';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockFetch = vi.fn();
const originalFetch = global.fetch;

describe('CRUD Functions - TicketService', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('CREATE - createTicket', () => {
    it('creates a ticket successfully', async () => {
      const newTicket = {
        title: 'Test Ticket',
        description: 'Test description',
        email: 'test@example.com',
        priority: 'high' as const,
        category: 'bug' as const,
        status: 'open' as const,
      };

      const createdTicket = {
        id: '123',
        ...newTicket,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ticket: createdTicket }),
      } as Response);

      const result = await TicketService.createTicket(newTicket);

      expect(mockFetch).toHaveBeenCalledWith('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket),
      });
      expect(result).toEqual(createdTicket);
    });

    it('throws error when create fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to create' }),
      } as Response);

      await expect(
        TicketService.createTicket({
          title: 'Test',
          description: 'Test',
          email: 'test@test.com',
          priority: 'low',
          category: 'other',
          status: 'open',
        })
      ).rejects.toThrow('Failed to create');
    });
  });

  describe('READ - getAllTickets', () => {
    it('gets all tickets successfully', async () => {
      const tickets: Ticket[] = [
        {
          id: '1',
          title: 'Ticket 1',
          description: 'Description 1',
          email: 'user1@test.com',
          priority: 'high' as const,
          category: 'bug' as const,
          status: 'open' as const,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tickets }),
      } as Response);

      const result = await TicketService.getAllTickets();

      expect(mockFetch).toHaveBeenCalledWith('/api/tickets');
      expect(result).toEqual(tickets);
    });

    it('gets tickets with filters', async () => {
      const tickets: Ticket[] = [];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tickets }),
      } as Response);

      await TicketService.getAllTickets({ status: 'open', search: 'bug' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/tickets?status=open&search=bug'
      );
    });
  });

  describe('READ - getTicketById', () => {
    it('gets ticket by id successfully', async () => {
      const ticket = {
        id: '123',
        title: 'Test Ticket',
        description: 'Description',
        email: 'test@example.com',
        priority: 'medium' as const,
        category: 'support' as const,
        status: 'in_progress' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ticket }),
      } as Response);

      const result = await TicketService.getTicketById('123');

      expect(mockFetch).toHaveBeenCalledWith('/api/tickets/123');
      expect(result).toEqual(ticket);
    });

    it('throws error when ticket not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Ticket não encontrado' }),
      } as Response);

      await expect(TicketService.getTicketById('nonexistent')).rejects.toThrow(
        'Ticket não encontrado'
      );
    });
  });

  describe('UPDATE - updateTicket', () => {
    it('updates ticket successfully', async () => {
      const updateData = {
        status: 'resolved' as const,
        priority: 'low' as const,
        category: 'bug' as const,
        description: 'Updated description',
      };

      const updatedTicket = {
        id: '123',
        title: 'Original Title',
        email: 'test@example.com',
        ...updateData,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ticket: updatedTicket }),
      } as Response);

      const result = await TicketService.updateTicket('123', updateData);

      expect(mockFetch).toHaveBeenCalledWith('/api/tickets/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(updatedTicket);
    });

    it('throws error when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Update failed' }),
      } as Response);

      await expect(
        TicketService.updateTicket('123', {
          status: 'resolved',
          priority: 'low',
          category: 'bug',
          description: 'Test',
        })
      ).rejects.toThrow('Update failed');
    });
  });

  describe('DELETE - deleteTicket', () => {
    it('deletes ticket successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await expect(TicketService.deleteTicket('123')).resolves.toBeUndefined();

      expect(mockFetch).toHaveBeenCalledWith('/api/tickets/123', {
        method: 'DELETE',
      });
    });

    it('throws error when delete fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Delete failed' }),
      } as Response);

      await expect(TicketService.deleteTicket('123')).rejects.toThrow(
        'Delete failed'
      );
    });
  });
});
