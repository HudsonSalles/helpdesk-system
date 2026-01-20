// Auth Provider Component
'use client';

import { useAuthStore } from '@/features/tickets/store/authStore';
import { Loading } from '@/shared/components';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

const publicPaths = ['/login'];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const isPublicPath = publicPaths.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
    } else if (isAuthenticated && isPublicPath) {
      router.push('/');
    }
  }, [isAuthenticated, pathname, router]);

  // Show loading while checking auth on protected routes
  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return <Loading fullPage text="Verificando autenticação..." />;
  }

  return <>{children}</>;
};
