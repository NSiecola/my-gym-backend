'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const routes = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/routines', label: 'Treinos', icon: Dumbbell },
    { href: '/profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-card md:hidden">
      <div className="container mx-auto px-4 h-16 flex justify-around items-center">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <route.icon className="h-5 w-5" />
              <span className="text-xs">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}