// Use Delete Ticket Hook
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TicketService } from '../services/ticketService';
import { useTicketStore } from '../store/ticketStore';
import { useToastStore } from '../store/toastStore';

export const useDeleteTicket = () => {
  const router = useRouter();
  const { tickets, setTickets, removeFromCache } = useTicketStore();
  const { addToast } = useToastStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTicket = async (id: string, redirectToHome = false) => {
    setIsDeleting(true);

    // Optimistic update
    const previousTickets = tickets;
    const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
    setTickets(updatedTickets);

    try {
      await TicketService.deleteTicket(id);
      removeFromCache(id);
      addToast({
        type: 'success',
        message: 'Ticket deletado com sucesso!',
      });

      if (redirectToHome) {
        router.push('/');
      }
    } catch (err) {
      // Rollback on error
      setTickets(previousTickets);
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao deletar ticket';
      addToast({ type: 'error', message: errorMessage });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteTicket,
    isDeleting,
  };
};
