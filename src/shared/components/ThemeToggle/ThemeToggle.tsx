'use client';

import { useThemeStore } from '@/features/tickets/store/themeStore';
import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.scss';

interface ThemeToggleProps {
  variant?: 'floating' | 'inline';
}

export function ThemeToggle({ variant = 'floating' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={styles[`toggle-${variant}`]}
        aria-label="Toggle theme"
      >
        <span className={styles.icon}>🌓</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles[`toggle-${variant}`]}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={styles.icon} aria-hidden="true">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
