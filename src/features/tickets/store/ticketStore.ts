// Ticket Store - Helpdesk System
import { create, StateCreator } from 'zustand';
import type { Ticket, TicketFilters } from '../types/ticket';

// Ticket List Slice
interface TicketListSlice {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  filters: TicketFilters;
  setTickets: (tickets: Ticket[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: TicketFilters) => void;
  resetFilters: () => void;
}

const createTicketListSlice: StateCreator<
  TicketListSlice & TicketCacheSlice & TicketActionsSlice,
  [],
  [],
  TicketListSlice
> = (set) => ({
  tickets: [],
  isLoading: false,
  error: null,
  filters: {},

  setTickets: (tickets) => set({ tickets }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} }),
});

// Ticket Cache Slice
interface TicketCacheSlice {
  ticketCache: Record<string, Ticket>;
  addToCache: (ticket: Ticket) => void;
  getFromCache: (id: string) => Ticket | undefined;
  removeFromCache: (id: string) => void;
  clearCache: () => void;
}

const createTicketCacheSlice: StateCreator<
  TicketListSlice & TicketCacheSlice & TicketActionsSlice,
  [],
  [],
  TicketCacheSlice
> = (set, get) => ({
  ticketCache: {},

  addToCache: (ticket) =>
    set((state) => ({
      ticketCache: { ...state.ticketCache, [ticket.id]: ticket },
    })),

  getFromCache: (id) => get().ticketCache[id],

  removeFromCache: (id) =>
    set((state) => {
      const { [id]: _removed, ...rest } = state.ticketCache;
      return { ticketCache: rest };
    }),

  clearCache: () => set({ ticketCache: {} }),
});

// Ticket Actions Slice
interface TicketActionsSlice {
  optimisticUpdate: <T>(
    action: () => Promise<T>,
    rollback: () => void
  ) => Promise<T>;
}

const createTicketActionsSlice: StateCreator<
  TicketListSlice & TicketCacheSlice & TicketActionsSlice,
  [],
  [],
  TicketActionsSlice
> = () => ({
  optimisticUpdate: async (action, rollback) => {
    try {
      return await action();
    } catch (error) {
      rollback();
      throw error;
    }
  },
});

// Combined Store
export type TicketStoreState = TicketListSlice &
  TicketCacheSlice &
  TicketActionsSlice;

export const useTicketStore = create<TicketStoreState>()((...a) => ({
  ...createTicketListSlice(...a),
  ...createTicketCacheSlice(...a),
  ...createTicketActionsSlice(...a),
}));
