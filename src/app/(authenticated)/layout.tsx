// Authenticated Pages Layout
import { AuthProvider } from '@/features/tickets/components/AuthProvider';
import { Header } from '@/shared/components';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}
