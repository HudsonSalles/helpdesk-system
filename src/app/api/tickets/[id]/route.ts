// API Route - GET /api/tickets/[id] - Get ticket by ID
// API Route - PUT /api/tickets/[id] - Update ticket
// API Route - DELETE /api/tickets/[id] - Delete ticket

import { ticketEditSchema } from '@/features/tickets/validations/ticketSchema';
import { NextRequest, NextResponse } from 'next/server';
import { delay, deleteTicket, getTicketById, updateTicket } from '../mockData';

// GET - Get ticket by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay();

  try {
    const { id } = await params;
    const ticket = getTicketById(id);

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ticket }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar ticket' },
      { status: 500 }
    );
  }
}

// PUT - Update ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay();

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validationResult = ticketEditSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const updatedTicket = updateTicket(id, validationResult.data);

    if (!updatedTicket) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ticket: updatedTicket }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao atualizar ticket' },
      { status: 500 }
    );
  }
}

// DELETE - Delete ticket
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay();

  try {
    const { id } = await params;
    const success = deleteTicket(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Ticket deletado com sucesso' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erro ao deletar ticket' },
      { status: 500 }
    );
  }
}
