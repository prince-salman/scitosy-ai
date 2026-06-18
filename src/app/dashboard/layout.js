"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, Camera, BookType, LogOut, Heart, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTTS } from '@/hooks/useTTS';

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const { speak } = useTTS();
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
    { href: '/dashboard/audio', label: 'Audio Pembelajaran', icon: BookType },
    { href: '/dashboard/pemindai', label: 'Pemindai Gambar', icon: Camera },
    { href: '/dashboard/strategi', label: 'Strategi Belajar', icon: BookOpen },
    { href: '/dashboard/motivasi', label: 'Motivasi Harian', icon: Heart },
    { href: '/dashboard/tutor', label: 'Tutor AI Suara', icon: Bot },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <nav className="w-64 bg-zinc-50 border-r border-zinc-200 flex flex-col p-6">
        <div className="mb-10 px-2" tabIndex={0} onFocus={() => speak('Menu Navigasi Utama')}>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 mb-1">SCITOSY</h2>
          <span className="text-sm text-zinc-500">{user.name}</span>
        </div>
        
        <div className="flex flex-col gap-2 flex-1" role="navigation" aria-label="Menu Utama">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                aria-label={`Menu ${item.label}`}
                onFocus={() => speak(`Menu ${item.label}`)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac ${active ? 'bg-lilac text-zinc-900 shadow-sm' : 'text-zinc-600 hover:bg-bunny hover:text-zinc-900'}`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </div>

        <button 
          onClick={logout} 
          onFocus={() => speak('Tombol Keluar Akun')}
          aria-label="Keluar Akun"
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
