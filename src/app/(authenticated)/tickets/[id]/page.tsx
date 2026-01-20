// Ticket Detail Page
'use client';

import { useDeleteTicket } from '@/features/tickets/hooks/useDeleteTicket';
import { useTicket } from '@/features/tickets/hooks/useTicket';
import { Badge, Button, Loading, Modal } from '@/shared/components';
import { formatDateTime } from '@/shared/utils/formatDate';
import Link from 'next/link';
import { use, useState } from 'react';
import styles from './page.module.scss';

function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { ticket, isLoading, error } = useTicket(id);
  const { deleteTicket, isDeleting } = useDeleteTicket();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    await deleteTicket(id, true);
    setDeleteModalOpen(false);
  };

  if (isLoading) {
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
      <div className={styles.detailContainer}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Voltar
          </Link>
          <div className={styles.actions}>
            <Link href={`/tickets/${id}/editar`}>
              <Button variant="outline">Editar</Button>
            </Link>
            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
              Excluir
            </Button>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{ticket.title}</h1>
            <div className={styles.badges}>
              <Badge type={ticket.status} variant="status" />
              <Badge type={ticket.priority} variant="priority" />
              <Badge type={ticket.category} variant="category" />
            </div>
          </div>

          <div className={styles.infoGrid}>
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

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Atualizado em</span>
              <span className={styles.infoValue}>
                {formatDateTime(ticket.updatedAt)}
              </span>
            </div>

            {ticket.attachmentUrl && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Anexo</span>
                <a
                  href={ticket.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attachmentLink}
                >
                  Ver anexo ↗
                </a>
              </div>
            )}
          </div>

          <div className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>Descrição</h2>
            <p className={styles.description}>{ticket.description}</p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar exclusão"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
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

export default TicketDetailPage;
