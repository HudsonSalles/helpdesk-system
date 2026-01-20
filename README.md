# Helpdesk System - Support Tickets

Sistema completo de gerenciamento de tickets de suporte (Helpdesk) desenvolvido com Next.js 13+ (App Router), TypeScript, SCSS Modules, Zustand e React Hook Form + Zod.

## 📋 Visão Geral

Este projeto demonstra proficiência em React, Next.js (App Router), TypeScript e práticas modernas de desenvolvimento front-end, seguindo uma arquitetura baseada em features com separação clara de responsabilidades.

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15+ (App Router)
- **Linguagem**: TypeScript
- **Estilização**: SCSS Modules (mobile-first)
- **Gerenciamento de Estado**: Zustand
- **Formulários & Validação**: React Hook Form + Zod
- **Linting & Formatação**: ESLint + Prettier
- **Backend**: Mock API com Next.js Route Handlers (dados em memória)

## 🏗️ Arquitetura

### Estrutura de Pastas (Feature-Based)

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Route Handlers (Mock API)
│   ├── login/             # Página de login
│   ├── novo/              # Criação de ticket (multi-step)
│   ├── tickets/[id]/      # Detalhes e edição
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Listagem de tickets
├── features/
│   └── tickets/
│       ├── components/    # Componentes específicos
│       ├── hooks/         # Hooks customizados
│       ├── services/      # API communication
│       ├── store/         # Zustand stores
│       ├── types/         # TypeScript types
│       ├── utils/         # Utilitários
│       └── validations/   # Schemas Zod
├── shared/
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Hooks compartilhados
│   ├── styles/            # Design system (tokens, mixins)
│   └── utils/             # Utilitários globais
└── ai-notes/              # Documentação de uso de IA
```

### Princípios Arquiteturais

- **Separação de Responsabilidades**
  - Componentes: UI apenas, declarativos, stateless, dirigidos por props
  - Hooks: Lógica reutilizável e side effects
  - Services: Comunicação com API e regras de negócio
  - Stores: Gerenciamento de estado global
  - Utils: Funções auxiliares puras

- **Component Rule**
  - Componentes não contêm regras de negócio, transformações de dados ou side effects
  - Toda lógica reside em hooks, services ou stores

- **Server vs Client Components**
  - Server Components por padrão
  - Client Components (`"use client"`) apenas quando necessário

## ✨ Funcionalidades

### 1. Autenticação (Mock Login)

- Página de login em `/login`
- Credenciais mockadas:
  - Email: `user@test.com.br`
  - Password: `123Teste@`
- Proteção de rotas
- Persistência via localStorage

### 2. Listagem de Tickets (`/`)

- Exibição de título, status, prioridade, categoria, data de criação
- Filtro por status
- Busca por título (debounced)
- Estados: Loading, Error, Empty, Success
- Skeleton loading
- Layout responsivo (Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols)

### 3. Criação de Ticket (`/novo`)

#### Formulário Multi-Step (2 etapas)

**Etapa 1:**

- Título
- Email
- Categoria
- Prioridade

**Etapa 2:**

- Descrição
- URL do anexo (opcional)
- Status

#### Comportamento

- Persistência de dados entre etapas
- Salvamento de rascunho em localStorage
- Restauração de rascunho com confirmação do usuário
- Limpeza de dados após submissão

#### Validações (Zod)

- Título: mínimo 5 caracteres
- Descrição: mínimo 20 caracteres
- Email: formato válido
- URL do anexo: URL válida se fornecida

**Validações Condicionais:**

- Cobrança → email corporativo apenas
- Prioridade Alta → descrição mínimo 60 caracteres
- Bug → título deve começar com `[BUG]`

### 4. Detalhes do Ticket (`/tickets/[id]`)

- Exibição de todos os dados do ticket
- Badges visuais para status, prioridade, categoria
- Ações: Editar, Excluir, Voltar
- Tratamento de estado not-found

### 5. Edição de Ticket (`/tickets/[id]/editar`)

- Campos editáveis: status, prioridade, categoria, descrição, anexo
- Campos desabilitados: título, email, data de criação
- Feedback de loading, sucesso e erro

### 6. Exclusão de Ticket

- Ação disponível na listagem e detalhes
- Modal de confirmação
- Atualização otimista da UI
- Feedback de sucesso

## 🎨 Design System

- **SCSS Modules** apenas
- Design tokens para cores, espaçamento, tipografia
- Mixins para layout e responsividade
- Abordagem mobile-first

## ♿ Acessibilidade

- HTML semântico
- Associação correta label/input
- Navegação por teclado
- Estados de foco visíveis
- ARIA usado apenas quando necessário

## ⚡ Performance

- Lazy loading para componentes pesados
- Skeleton loading
- Debounce para busca e auto-save
- Memoização apenas quando justificado

## 🔄 Versionamento & CI/CD

### Commits

- Conventional Commits obrigatório

### CI

- Lint
- Type check
- Build

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20+
- npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/HudsonSalles/helpdesk-system.git

# Entre na pasta do projeto
cd helpdesk-system

# Instale as dependências
npm install

# Execute o projeto em desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build de produção
npm run start      # Inicia servidor de produção
npm run lint       # Executa ESLint
npm run type-check # Verifica tipos TypeScript
npm run format     # Formata código com Prettier
```

## 📝 Notas Sobre IA

Todo uso de IA assistiva está documentado em `src/ai-notes/`, incluindo:

- Prompts utilizados
- Contexto fornecido
- Código gerado
- Ajustes manuais realizados

Todo código gerado por IA foi revisado e adaptado manualmente antes da aceitação.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Hudson Salles - [GitHub](https://github.com/HudsonSalles)
