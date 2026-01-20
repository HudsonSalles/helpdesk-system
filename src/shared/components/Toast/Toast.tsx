// Toast Component
'use client';

import { useToastStore } from '@/features/tickets/store/toastStore';
import React from 'react';
import styles from './Toast.module.scss';

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[`type-${toast.type}`]}`}
          role="alert"
        >
          <span className={styles.icon} aria-hidden="true">
            {icons[toast.type]}
          </span>
          <div className={styles.content}>
            <p className={styles.message}>{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={styles.closeButton}
            aria-label="Fechar notificação"
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
