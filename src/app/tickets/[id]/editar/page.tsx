// Edit Ticket Page
'use client';

import { AuthProvider } from '@/features/tickets/components/AuthProvider';
import { useTicket } from '@/features/tickets/hooks/useTicket';
import { TicketService } from '@/features/tickets/services/ticketService';
import { useTicketStore } from '@/features/tickets/store/ticketStore';
import { useToastStore } from '@/features/tickets/store/toastStore';
import {
  ticketEditSchema,
  type TicketEditData,
} from '@/features/tickets/validations/ticketSchema';
import { Button, Input, Loading, Select, Textarea } from '@/shared/components';
import { formatDateTime } from '@/shared/utils/formatDate';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './page.module.scss';

function EditTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { ticket, isLoading: isLoadingTicket, error } = useTicket(id);
  const { addToCache } = useTicketStore();
  const { addToast } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketEditData>({
    resolver: zodResolver(ticketEditSchema),
    values: ticket
      ? {
          status: ticket.status,
          priority: ticket.priority,
          category: ticket.category,
          description: ticket.description,
          attachmentUrl: ticket.attachmentUrl || '',
        }
      : undefined,
  });

  const onSubmit = async (data: TicketEditData) => {
    setIsSubmitting(true);

    try {
      const updatedTicket = await TicketService.updateTicket(id, data);
      addToCache(updatedTicket);
      addToast({
        type: 'success',
        message: 'Ticket atualizado com sucesso!',
      });
      router.push(`/tickets/${id}`);
    } catch (err) {
      addToast({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Erro ao atualizar ticket',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTicket) {
    return (
      <div className={styles.container}>
        <Loading fullPage text="Carregando ticket..." />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h1>Ticket não encontrado</h1>
          <p>{error || 'O ticket que você está procurando não existe.'}</p>
          <Link href="/">
            <Button>Voltar para lista</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <header className={styles.header}>
          <Link href={`/tickets/${id}`} className={styles.backLink}>
            ← Voltar
          </Link>
          <h1 className={styles.title}>Editar Ticket</h1>
        </header>

        <div className={styles.disabledInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Título</span>
            <span className={styles.infoValue}>{ticket.title}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>E-mail</span>
            <span className={styles.infoValue}>{ticket.email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Criado em</span>
            <span className={styles.infoValue}>
              {formatDateTime(ticket.createdAt)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Select
            label="Status"
            error={errors.status?.message}
            required
            options={[
              { value: 'open', label: 'Aberto' },
              { value: 'in_progress', label: 'Em Andamento' },
              { value: 'resolved', label: 'Resolvido' },
            ]}
            {...register('status')}
          />

          <Select
            label="Prioridade"
            error={errors.priority?.message}
            required
            options={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' },
            ]}
            {...register('priority')}
          />

          <Select
            label="Categoria"
            error={errors.category?.message}
            required
            options={[
              { value: 'bug', label: 'Bug' },
              { value: 'billing', label: 'Cobrança' },
              { value: 'feature', label: 'Funcionalidade' },
              { value: 'other', label: 'Outro' },
            ]}
            {...register('category')}
          />

          <Textarea
            label="Descrição"
            placeholder="Descreva o problema em detalhes..."
            error={errors.description?.message}
            required
            rows={6}
            {...register('description')}
          />

          <Input
            label="URL do Anexo"
            type="url"
            placeholder="https://exemplo.com/arquivo.pdf"
            error={errors.attachmentUrl?.message}
            helperText="Opcional: Cole o link de um arquivo ou imagem"
            {...register('attachmentUrl')}
          />

          <div className={styles.formActions}>
            <Link href={`/tickets/${id}`}>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AuthProvider>
      <EditTicketPage params={params} />
    </AuthProvider>
  );
}
