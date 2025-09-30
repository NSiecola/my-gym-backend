'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Lista de rotas onde o Header NÃO deve aparecer
  const noHeaderRoutes = ['/login', '/register'];

  const shouldShowHeader = !noHeaderRoutes.includes(pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </>
  );
}