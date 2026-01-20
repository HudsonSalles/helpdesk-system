// Use Ticket Hook (single ticket)
'use client';

import { useEffect, useState } from 'react';
import { TicketService } from '../services/ticketService';
import { useTicketStore } from '../store/ticketStore';
import { useToastStore } from '../store/toastStore';
import type { Ticket } from '../types/ticket';

export const useTicket = (id: string) => {
  const { addToCache, getFromCache } = useTicketStore();
  const { addToast } = useToastStore();
  const [ticket, setTicket] = useState<Ticket | null>(getFromCache(id) || null);
  const [isLoading, setIsLoading] = useState(!getFromCache(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      // Check cache first
      const cached = getFromCache(id);
      if (cached) {
        setTicket(cached);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await TicketService.getTicketById(id);
        setTicket(data);
        addToCache(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar ticket';
        setError(errorMessage);
        addToast({ type: 'error', message: errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await TicketService.getTicketById(id);
      setTicket(data);
      addToCache(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar ticket';
      setError(errorMessage);
      addToast({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ticket,
    isLoading,
    error,
    refetch,
  };
};
