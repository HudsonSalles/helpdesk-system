'use client';

import { useThemeStore } from '@/features/tickets/store/themeStore';
import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className={styles.toggle} aria-label="Toggle theme">
        <span className={styles.icon}>🌓</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={styles.icon} aria-hidden="true">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
