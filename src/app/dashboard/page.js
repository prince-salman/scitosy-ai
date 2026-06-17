"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Camera, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTTS } from '@/hooks/useTTS';
import { Card } from '@/components/ui';

export default function Dashboard() {
  const { user } = useAuth();
  const { speak } = useTTS();

  useEffect(() => {
    if (user) {
      speak(`Selamat datang di dashboard, ${user.name}. Gunakan tab untuk menavigasi.`);
    }
  }, [user, speak]);

  return (
    <div className="p-12 lg:p-16">
      <header className="mb-16">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-3">Dashboard</h1>
        <p className="text-zinc-500 text-lg">Pilih modul yang ingin Anda gunakan hari ini.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link href="/dashboard/audio" className="block focus:outline-none">
          <Card className="h-full border-t-4 border-t-lilac hover:border-lilac hover:-translate-y-1 transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-lilac focus-visible:ring-offset-2">
            <BookOpen size={28} className="mb-6 text-lilac" />
            <h3 className="mb-3 text-lg font-semibold text-zinc-900">Audio Pembelajaran</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">Akses materi pembelajaran melalui suara secara terstruktur.</p>
          </Card>
        </Link>

        <Link href="/dashboard/pemindai" className="block focus:outline-none">
          <Card className="h-full border-t-4 border-t-seafair hover:border-seafair hover:-translate-y-1 transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-seafair focus-visible:ring-offset-2">
            <Camera size={28} className="mb-6 text-seafair" />
            <h3 className="mb-3 text-lg font-semibold text-zinc-900">Pemindai Gambar</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">Ubah gambar berisi teks menjadi suara menggunakan teknologi pengenalan karakter.</p>
          </Card>
        </Link>

        <Link href="/dashboard/strategi" className="block focus:outline-none">
          <Card className="h-full border-t-4 border-t-changeling hover:border-changeling hover:-translate-y-1 transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-changeling focus-visible:ring-offset-2">
            <Info size={28} className="mb-6 text-changeling" />
            <h3 className="mb-3 text-lg font-semibold text-zinc-900">Strategi Belajar</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">Panduan sistem navigasi dan fitur pencatatan suara.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
