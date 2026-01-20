// Home Page - Ticket Listing
'use client';

import { AuthProvider } from '@/features/tickets/components/AuthProvider';
import { useDeleteTicket } from '@/features/tickets/hooks/useDeleteTicket';
import { useTickets } from '@/features/tickets/hooks/useTickets';
import { useAuthStore } from '@/features/tickets/store/authStore';
import type { TicketStatus } from '@/features/tickets/types/ticket';
import {
  Badge,
  Button,
  Input,
  Modal,
  Select,
  Skeleton,
} from '@/shared/components';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatDate } from '@/shared/utils/formatDate';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.scss';

function HomePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const { tickets, isLoading, error } = useTickets({
    status: statusFilter || undefined,
    search: debouncedSearch || undefined,
  });
  const { deleteTicket, isDeleting } = useDeleteTicket();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Image
            src="/logo.png"
            alt="Helpdesk System Logo"
            width={200}
            height={50}
            priority
          />
          {user && (
            <>
              <div className={styles.userSection}>
                <span className={styles.userName}>Olá, {user.name}</span>
                <div className={styles.themeToggleHeader}>
                  <ThemeToggle variant="inline" />
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
              <button
                className={styles.hamburger}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className={styles.drawerOverlay}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerUserName}>Olá, {user?.name}</span>
              <button
                className={styles.drawerClose}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                ×
              </button>
            </div>
            <nav className={styles.drawerNav}>
              <Link
                href="/"
                className={styles.drawerLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                📋 Tickets
              </Link>
              <Link
                href="/novo"
                className={styles.drawerLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                ➕ Novo Ticket
              </Link>
              <div className={styles.drawerTheme}>
                <span className={styles.drawerThemeLabel}>Tema</span>
                <ThemeToggle variant="inline" />
              </div>
              <button
                className={styles.drawerLogout}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                🚪 Sair
              </button>
            </nav>
          </div>
        </>
      )}

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

export default function Page() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}
