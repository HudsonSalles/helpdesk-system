# PRD – Helpdesk System (Support Tickets)

## 1. Project Overview

### 1.1 Objective
Develop a complete web application for support ticket management (Helpdesk) with full CRUD functionality, demonstrating solid proficiency in React, Next.js (App Router), TypeScript, and modern front-end best practices. The project simulates a real-world product scenario, focusing on architecture, state management, UX, accessibility, and code quality.

### 1.2 Mandatory Tech Stack
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: SCSS Modules (no Tailwind or utility-first frameworks)
- **State Management**: Zustand
- **Forms & Validation**: React Hook Form + Zod
- **Linting & Formatting**: ESLint + Prettier
- **Backend Strategy**: Mock API using Next.js Route Handlers (in-memory data only)

No external backend, database, or third-party API is used. The mock layer exists solely to simulate real-world asynchronous interactions.

---

## 2. Architecture

### 2.0 File Size and Responsibility Rules

- Files must remain **small and highly focused**.
- If a file grows beyond a reasonable size or accumulates multiple responsibilities, it **must be split**.
- Large components must be decomposed into smaller components.
- Complex logic must be extracted into hooks, services, or utilities.
- A single file should represent **one clear responsibility** only.
- Long files are considered a code smell and must be avoided.

This rule applies to **all layers**: components, hooks, services, stores, and styles.


### 2.1 Folder Structure (Feature-Based)

```
src/
├── app/
│   ├── tickets/
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── editar/
│   │           └── page.tsx
│   ├── novo/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── tickets/
│           ├── route.ts
│           └── [id]/
│               └── route.ts
├── features/
│   ├── tickets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── validations/
│   │   ├── types/
│   │   └── utils/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── styles/
│   └── utils/
├── ai-notes/
└── .github/workflows/
```

### 2.2 Architectural Principles

- **Separation of Concerns**
  - Components: UI only, declarative, stateless, props-driven
  - Hooks: reusable logic and side effects
  - Services: API communication and business rules
  - Stores: global state management
  - Utils: pure helper functions

- **Component Rule**
  - Components must not contain business rules, data transformations, or side effects
  - All logic must live in hooks, services, or stores

- **Server vs Client Components**
  - Server Components by default
  - Client Components (`"use client"`) only when required (forms, filters, modals)

---

## 3. Backend Strategy (Mock API)

The application uses **Next.js Route Handlers** exclusively as a mock API layer.

- Data is stored in memory during runtime
- No persistence between reloads
- Artificial latency (500–1000ms) is introduced
- Error simulation is included to validate UX states

This approach enables realistic CRUD flows without introducing a real backend or database.

---

## 4. Domain Model

### Ticket

```ts
interface Ticket {
  id: string;
  title: string;
  description: string;
  email: string;
  priority: 'low' | 'medium' | 'high';
  category: 'bug' | 'billing' | 'feature' | 'other';
  status: 'open' | 'in_progress' | 'resolved';
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Features

### 5.0 Authentication (Mock Login)

The application includes a simple authentication flow to simulate a real-world protected system and increase perceived product maturity.

#### Login Page (`/login`)

- Fields:
  - email
  - password
- Credentials are validated against a **mocked in-memory user**:
  - **Email**: `user@test.com.br`
  - **Password**: `123Teste@`
- No real authentication provider or backend persistence is used
- Authentication state is managed on the client side

#### Behavior

- Successful login grants access to protected routes
- Failed login shows accessible error feedback
- Authentication state persists across refresh using localStorage
- Logout clears authentication state

#### Route Protection

- All ticket-related routes are protected
- Unauthenticated users are redirected to `/login`

---



### 5.1 Ticket Listing (`/`)

- Display title, status, priority, category, createdAt
- Filter by status
- Search by title (debounced)
- Loading, error, empty and success states
- Skeleton loading for initial fetch

**Rendering Strategy**: SSR or ISR (decision documented in README)

**Responsive Layout**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

---

### 5.2 Ticket Creation (`/novo`)

#### Multi-Step Form (2 Steps)

**Step 1**
- title
- email
- category
- priority

**Step 2**
- description
- attachmentUrl (optional)
- status (default: open)

#### Behavior
- Persist form data between steps
- Persist draft in localStorage to recover from refresh or connection loss
- Restore draft on load with user confirmation
- Clear all stored data after successful submission

#### Validations (Zod)
- title: min 5 characters
- description: min 20 characters
- email: valid format
- attachmentUrl: valid URL if provided

**Conditional Validation (at least one)**:
- Billing → corporate email only
- High priority → description min 60 characters
- Bug → title must start with `[BUG]`

---

### 5.3 Ticket Detail (`/tickets/[id]`)

- Display all ticket data
- Visual badges for status, priority, category
- Actions: Edit, Delete, Back
- Handle not-found state with proper UX

---

### 5.4 Ticket Editing (`/tickets/[id]/editar`)

- Editable: status, priority, category, description, attachmentUrl
- Disabled: title, email, createdAt
- Loading, success and error feedback

---

### 5.5 Ticket Deletion

- Delete action from list or detail
- Confirmation modal
- Optimistic UI update
- Success feedback

---

## 6. State Management (Zustand)

- Ticket list
- Ticket cache by id
- Global loading and error states
- Toast/feedback system
- Form draft state

---

## 7. Styling & Design System

- SCSS Modules only
- Design tokens for colors, spacing, typography
- Mixins for layout and responsiveness
- Mobile-first approach

---

## 8. Accessibility

- Semantic HTML
- Proper label/input association
- Keyboard navigation
- Visible focus states
- ARIA used only when necessary

---

## 9. Performance

- Lazy loading for heavy components
- Skeleton loading
- Debounce for search and auto-save
- Memoization only when justified

---

## 10. Versioning & CI/CD

### Commits
- Conventional Commits required

### CI
- Lint
- Type check
- Build

### Code Review Rules (Senior-Level)
- Enforce separation of concerns
- No business logic in components
- Proper typing
- Accessibility compliance
- SCSS Modules usage

---

## 11. AI Usage Documentation

- All AI assistance is documented in `ai-notes/`
- Prompts, context, generated code, and manual adjustments are recorded
- All AI-generated code is reviewed and adapted manually before acceptance

---

## 12. Final Notes

This PRD prioritizes clarity, maintainability, and realistic product behavior while remaining aligned with the expectations of a Front-end Developer (Pleno) technical assessment.

