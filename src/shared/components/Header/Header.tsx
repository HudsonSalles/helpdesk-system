// Header Component
'use client';

import { useAuthStore } from '@/features/tickets/store/authStore';
import { Button } from '@/shared/components/Button';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Header.module.scss';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Helpdesk System Logo"
              width={200}
              height={50}
              priority
            />
          </Link>
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
    </>
  );
}
