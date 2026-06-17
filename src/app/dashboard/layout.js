"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, Camera, BookType, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const navItems = [
    { href: '/dashboard', label: 'Beranda', icon: Home },
    { href: '/dashboard/strategi', label: 'Strategi Belajar', icon: BookOpen },
    { href: '/dashboard/audio', label: 'Audio Pembelajaran', icon: BookType },
    { href: '/dashboard/pemindai', label: 'Pemindai Gambar', icon: Camera },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <nav className="w-64 bg-zinc-50 border-r border-zinc-200 flex flex-col p-6">
        <div className="mb-10 px-2">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 mb-1">SCITOSY</h2>
          <span className="text-sm text-zinc-500">{user.name}</span>
        </div>
        
        <div className="flex flex-col gap-2 flex-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac ${active ? 'bg-lilac text-zinc-900 shadow-sm' : 'text-zinc-600 hover:bg-bunny hover:text-zinc-900'}`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </div>

        <button 
          onClick={logout} 
          className="mt-auto flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-zinc-600 hover:bg-changeling/50 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-changeling"
        >
          <LogOut size={18} /> Keluar
        </button>
      </nav>

      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
