// Root Layout
import { ToastContainer } from '@/shared/components';
import '@/shared/styles/globals.scss';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Helpdesk System',
  description: 'Sistema de gerenciamento de tickets de suporte',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
