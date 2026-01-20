// Loading Spinner Component
import React from 'react';
import styles from './Loading.module.scss';

export type LoadingSize = 'sm' | 'md' | 'lg';

export interface LoadingProps {
  size?: LoadingSize;
  text?: string;
  fullPage?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullPage = false,
  className = '',
}) => {
  return (
    <div
      className={`${styles.container} ${fullPage ? styles.fullPage : ''} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`${styles.spinner} ${styles[`size-${size}`]}`}
        aria-hidden="true"
      />
      {text && <span className={styles.text}>{text}</span>}
      <span className="sr-only">Carregando...</span>
    </div>
  );
};
