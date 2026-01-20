// Auth API Route - POST /api/auth/login

import { NextRequest, NextResponse } from 'next/server';

// Mock user credentials
const MOCK_USER = {
  email: 'user@test.com.br',
  password: '123Teste@',
  name: 'Usuário Teste',
};

// Artificial delay
const delay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  await delay();

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Check credentials
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      return NextResponse.json(
        {
          user: {
            email: MOCK_USER.email,
            name: MOCK_USER.name,
          },
        },
        { status: 200 }
      );
    }

    // Invalid credentials
    return NextResponse.json(
      { error: 'E-mail ou senha inválidos' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erro ao processar login' },
      { status: 500 }
    );
  }
}
