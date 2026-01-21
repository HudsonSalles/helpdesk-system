// Ticket Validation Schemas - Helpdesk System
import { z } from 'zod';

// Base validations
const titleSchema = z
  .string()
  .min(5, 'O título deve ter no mínimo 5 caracteres')
  .max(100, 'O título deve ter no máximo 100 caracteres');

const descriptionSchema = z
  .string()
  .min(20, 'A descrição deve ter no mínimo 20 caracteres')
  .max(1000, 'A descrição deve ter no máximo 1000 caracteres');

const emailSchema = z
  .string()
  .min(1, 'O e-mail é obrigatório')
  .email('E-mail inválido');

const attachmentUrlSchema = z
  .string()
  .url('URL inválida')
  .optional()
  .or(z.literal(''));

const prioritySchema = z.enum(['low', 'medium', 'high'], {
  errorMap: () => ({ message: 'Prioridade inválida' }),
});

const categorySchema = z.enum(['bug', 'billing', 'feature', 'other'], {
  errorMap: () => ({ message: 'Categoria inválida' }),
});

const statusSchema = z.enum(['open', 'in_progress', 'resolved'], {
  errorMap: () => ({ message: 'Status inválido' }),
});

// Step 1 Schema
export const ticketStep1Schema = z.object({
  title: titleSchema,
  email: emailSchema,
  category: categorySchema,
  priority: prioritySchema,
});

export type TicketStep1Data = z.infer<typeof ticketStep1Schema>;

// Step 2 Schema
export const ticketStep2Schema = z.object({
  description: descriptionSchema,
  attachmentUrl: attachmentUrlSchema,
  status: statusSchema,
});

export type TicketStep2Data = z.infer<typeof ticketStep2Schema>;

// Full Ticket Schema with conditional validations
export const ticketFormSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    email: emailSchema,
    priority: prioritySchema,
    category: categorySchema,
    status: statusSchema,
    attachmentUrl: attachmentUrlSchema,
  })
  .superRefine((data, ctx) => {
    // Conditional: Billing → corporate email only
    if (data.category === 'billing') {
      const corporateEmailPattern =
        /^[a-zA-Z0-9._%+-]+@(?!gmail|hotmail|yahoo|outlook)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!corporateEmailPattern.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Para categoria "Cobrança", utilize um e-mail corporativo',
          path: ['email'],
        });
      }
    }

    // Conditional: High priority → description min 60 characters
    if (data.priority === 'high' && data.description.length < 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 60,
        type: 'string',
        inclusive: true,
        message:
          'Para prioridade "Alta", a descrição deve ter no mínimo 60 caracteres',
        path: ['description'],
      });
    }
  });

export type TicketFormData = z.infer<typeof ticketFormSchema>;

// Edit Ticket Schema (only editable fields)
export const ticketEditSchema = z.object({
  status: statusSchema,
  priority: prioritySchema,
  category: categorySchema,
  description: descriptionSchema,
  attachmentUrl: attachmentUrlSchema,
});

export type TicketEditData = z.infer<typeof ticketEditSchema>;
