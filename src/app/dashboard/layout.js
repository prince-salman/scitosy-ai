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
    { href: '/dashboard/audio', label: 'Audio', icon: BookType },
    { href: '/dashboard/pemindai', label: 'Pemindai', icon: Camera },
    { href: '/dashboard/strategi', label: 'Strategi', icon: BookOpen },
    { href: '/dashboard/motivasi', label: 'Motivasi', icon: Heart },
    { href: '/dashboard/tutor', label: 'AI Tutor', icon: Bot },
  ];

  return (
    <div className="flex min-h-screen bg-white pb-16 md:pb-0">
      {/* Sidebar untuk Desktop */}
      <nav className="hidden md:flex w-64 bg-zinc-50 border-r border-zinc-200 flex-col p-6 sticky top-0 h-screen">
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

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>

      {/* Bottom Navigation untuk HP/Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-around items-center h-16 z-50 px-1 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              aria-label={`Menu ${item.label}`}
              onFocus={() => speak(`Menu ${item.label}`)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? 'text-lilac' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <Icon size={active ? 22 : 20} className={active ? 'fill-lilac/20' : ''} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
