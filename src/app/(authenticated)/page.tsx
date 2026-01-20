// Home Page - Ticket Listing
'use client';

import { useDeleteTicket } from '@/features/tickets/hooks/useDeleteTicket';
import { useTickets } from '@/features/tickets/hooks/useTickets';
import type { TicketStatus } from '@/features/tickets/types/ticket';
import {
  Badge,
  Button,
  Input,
  Modal,
  Select,
  Skeleton,
} from '@/shared/components';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatDate } from '@/shared/utils/formatDate';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.scss';

function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { tickets, isLoading, error } = useTickets({
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
  });
  const { deleteTicket, isDeleting } = useDeleteTicket();

  const handleDeleteClick = (id: string) => {
    setTicketToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (ticketToDelete) {
      await deleteTicket(ticketToDelete);
      setDeleteModalOpen(false);
      setTicketToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setTicketToDelete(null);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.actions}>
          <Link href="/novo">
            <Button>+ Novo Ticket</Button>
          </Link>
        </div>

        <div className={styles.filters}>
          <Input
            placeholder="Buscar tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />

          <Select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as TicketStatus | '')
            }
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'open', label: 'Aberto' },
              { value: 'in_progress', label: 'Em Andamento' },
              { value: 'resolved', label: 'Resolvido' },
            ]}
            placeholder="Filtrar por status"
          />
        </div>

        {isLoading && !tickets.length ? (
          <div className={styles.ticketGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.ticketCard}>
                <Skeleton variant="title" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" />
                <div className={styles.skeletonFooter}>
                  <Skeleton width={60} height={24} />
                  <Skeleton width={80} height={24} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <p className={styles.errorText}>{error}</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum ticket encontrado</p>
            {(search || statusFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.ticketGrid}>
            {tickets.map((ticket) => (
              <article key={ticket.id} className={styles.ticketCard}>
                <Link
                  href={`/tickets/${ticket.id}`}
                  className={styles.ticketLink}
                >
                  <div className={styles.ticketHeader}>
                    <h2 className={styles.ticketTitle}>{ticket.title}</h2>
                  </div>

                  <p className={styles.ticketDescription}>
                    {ticket.description}
                  </p>

                  <div className={styles.ticketMeta}>
                    <span className={styles.ticketEmail}>{ticket.email}</span>
                    <span className={styles.ticketDate}>
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>

                  <div className={styles.ticketFooter}>
                    <div className={styles.badges}>
                      <Badge type={ticket.status} variant="status" />
                      <Badge type={ticket.priority} variant="priority" />
                      <Badge type={ticket.category} variant="category" />
                    </div>
                  </div>
                </Link>

                <div className={styles.ticketActions}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/tickets/${ticket.id}/editar`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(ticket.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        title="Confirmar exclusão"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </>
        }
      >
        <p>
          Tem certeza que deseja excluir este ticket? Esta ação não pode ser
          desfeita.
        </p>
      </Modal>
    </div>
  );
}

export default HomePage;
