'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import BottomNav from './BottomNav'; 

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/login', '/register'];

  const showLayout = !noLayoutRoutes.includes(pathname);

  return (
    <>
      {/* Mostra o Header apenas se showLayout for verdadeiro */}
      {showLayout && <Header />}

      <main className="container mx-auto px-4 py-8 pb-20">
        {children}
      </main>

      {/* Mostra a BottomNav apenas se showLayout for verdadeiro */}
      {showLayout && <BottomNav />}
    </>
  );
}