// Use Tickets Hook
'use client';

import { useEffect } from 'react';
import { TicketService } from '../services/ticketService';
import { useTicketStore } from '../store/ticketStore';
import { useToastStore } from '../store/toastStore';
import type { TicketFilters } from '../types/ticket';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const useTickets = (
  filters?: TicketFilters,
  pagination?: PaginationOptions
) => {
  const { tickets, isLoading, error, setTickets, setLoading, setError } =
    useTicketStore();
  const { addToast } = useToastStore();

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        ...filters,
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
      };
      const data = await TicketService.getAllTickets(params);
      setTickets(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar tickets';
      setError(errorMessage);
      addToast({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchTickets();
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.status, filters?.search, pagination?.page]);

  return {
    tickets,
    isLoading,
    error,
    refetch,
  };
};
