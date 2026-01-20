// Mock Data - Tickets
import type { Ticket } from '@/features/tickets/types/ticket';

// In-memory data store
export const tickets: Ticket[] = [
  {
    id: '1',
    title: '[BUG] Login não funciona no Safari',
    description:
      'Ao tentar fazer login no navegador Safari, o sistema retorna erro 500. O problema não ocorre em outros navegadores como Chrome ou Firefox. Já testei em diferentes versões do Safari e o erro persiste. Preciso de uma solução urgente pois isso está afetando vários usuários.',
    email: 'joao.silva@empresa.com.br',
    priority: 'high',
    category: 'bug',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Solicitação de nova funcionalidade',
    description:
      'Gostaria de solicitar a implementação de um sistema de notificações em tempo real. Isso melhoraria muito a experiência do usuário e nos permitiria comunicar atualizações importantes de forma mais eficiente.',
    email: 'maria.santos@tech.com.br',
    priority: 'medium',
    category: 'feature',
    status: 'open',
    attachmentUrl: 'https://example.com/mockup.pdf',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Problema com cobrança duplicada',
    description:
      'Fui cobrado duas vezes pelo mesmo serviço no mês passado. Preciso de um estorno urgente e gostaria de entender como isso aconteceu para evitar problemas futuros.',
    email: 'pedro.oliveira@corporativo.com.br',
    priority: 'high',
    category: 'billing',
    status: 'resolved',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Dúvida sobre recursos do plano',
    description:
      'Gostaria de saber quais são os recursos incluídos no plano premium e se há possibilidade de upgrade do meu plano atual sem perder os dados.',
    email: 'ana.costa@email.com',
    priority: 'low',
    category: 'other',
    status: 'open',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper functions
export const getAllTickets = (): Ticket[] => tickets;

export const getTicketById = (id: string): Ticket | undefined =>
  tickets.find((ticket) => ticket.id === id);

export const createTicket = (
  data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>
): Ticket => {
  const newTicket: Ticket = {
    ...data,
    id: Math.random().toString(36).substring(2, 11),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tickets.push(newTicket);
  return newTicket;
};

export const updateTicket = (
  id: string,
  data: Partial<Omit<Ticket, 'id' | 'createdAt'>>
): Ticket | null => {
  const index = tickets.findIndex((ticket) => ticket.id === id);
  if (index === -1) return null;

  tickets[index] = {
    ...tickets[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return tickets[index];
};

export const deleteTicket = (id: string): boolean => {
  const index = tickets.findIndex((ticket) => ticket.id === id);
  if (index === -1) return false;

  tickets.splice(index, 1);
  return true;
};

// Artificial delay to simulate network latency
export const delay = (ms: number = 500 + Math.random() * 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
