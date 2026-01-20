// Use Tickets Hook
'use client';

import { useEffect } from 'react';
import { TicketService } from '../services/ticketService';
import { useTicketStore } from '../store/ticketStore';
import { useToastStore } from '../store/toastStore';
import type { TicketFilters } from '../types/ticket';

export const useTickets = (filters?: TicketFilters) => {
  const { tickets, isLoading, error, setTickets, setLoading, setError } =
    useTicketStore();
  const { addToast } = useToastStore();

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await TicketService.getAllTickets(filters);
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
  }, [filters?.status, filters?.search]);

  return {
    tickets,
    isLoading,
    error,
    refetch,
  };
};
