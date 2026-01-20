// Skeleton Component
import React from 'react';
import styles from './Skeleton.module.scss';

export type SkeletonVariant = 'text' | 'title' | 'avatar' | 'rect';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const style: React.CSSProperties = {};

  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height)
    style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${styles.skeleton} ${styles[`variant-${variant}`]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};
