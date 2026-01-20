// API Route - GET /api/tickets - List all tickets
// API Route - POST /api/tickets - Create new ticket

import { ticketFormSchema } from '@/features/tickets/validations/ticketSchema';
import { NextRequest, NextResponse } from 'next/server';
import { createTicket, delay, getAllTickets } from './mockData';

// GET - List all tickets with optional filters
export async function GET(request: NextRequest) {
  await delay();

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let tickets = getAllTickets();

    // Apply filters
    if (status) {
      tickets = tickets.filter((ticket) => ticket.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      tickets = tickets.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by createdAt descending (newest first)
    tickets.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ tickets }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar tickets' },
      { status: 500 }
    );
  }
}

// POST - Create new ticket
export async function POST(request: NextRequest) {
  await delay();

  try {
    const body = await request.json();

    // Validate request body
    const validationResult = ticketFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const newTicket = createTicket(validationResult.data);

    return NextResponse.json({ ticket: newTicket }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao criar ticket' },
      { status: 500 }
    );
  }
}
