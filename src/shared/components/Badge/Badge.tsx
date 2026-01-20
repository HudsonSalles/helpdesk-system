// Badge Component
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '@/features/tickets/types/ticket';
import React from 'react';
import styles from './Badge.module.scss';

type BadgeType = TicketPriority | TicketCategory | TicketStatus;
type BadgeVariant = 'priority' | 'category' | 'status';

export interface BadgeProps {
  type: BadgeType;
  variant: BadgeVariant;
  className?: string;
}

const labels: Record<BadgeType, string> = {
  // Priority
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  // Status
  open: 'Aberto',
  in_progress: 'Em Andamento',
  resolved: 'Resolvido',
  // Category
  bug: 'Bug',
  billing: 'Cobrança',
  feature: 'Funcionalidade',
  other: 'Outro',
};

export const Badge: React.FC<BadgeProps> = ({
  type,
  variant,
  className = '',
}) => {
  const badgeClass = [styles.badge, styles[`${variant}-${type}`], className]
    .filter(Boolean)
    .join(' ');

  return <span className={badgeClass}>{labels[type]}</span>;
};
