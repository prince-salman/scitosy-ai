"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Camera, Mic } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTTS } from '@/hooks/useTTS';
import { Button, Card } from '@/components/ui';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const { speak } = useTTS();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-bunny/50 to-white">
      <header className="px-8 py-6 border-b border-white flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="font-bold text-xl tracking-tight text-zinc-950" tabIndex={0} onFocus={() => speak('Logo SCITOSY AI')}>SCITOSY AI</div>
        <div className="flex gap-3">
          <Link href="/login" aria-label="Masuk">
            <Button variant="ghost" onFocus={() => speak('Tombol Masuk')}>Masuk</Button>
          </Link>
          <Link href="/register" aria-label="Daftar">
            <Button variant="primary" onFocus={() => speak('Tombol Daftar')}>Daftar</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <div className="max-w-3xl text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 mb-6 leading-tight">
            Aksesibilitas Tanpa Batas
          </h1>
          <p className="text-lg text-zinc-600 mb-10 max-w-2xl mx-auto">
            Platform pembelajaran khusus yang dirancang dengan navigasi yang ramah untuk tunanetra. Fokus pada suara, teks, dan kesederhanaan.
          </p>
          <Link href="/register" aria-label="Mulai Sekarang">
            <Button variant="primary" size="lg" onFocus={() => speak('Tombol Mulai Sekarang')}>Mulai Sekarang</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <Card className="hover:border-lilac hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-lilac focus-visible:outline-none" tabIndex={0} onFocus={() => speak('Fitur Audio Pembelajaran')}>
            <BookOpen size={32} className="mb-4 text-lilac" />
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">Audio Pembelajaran</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">Dengarkan materi pembelajaran yang terstruktur tanpa antarmuka visual yang rumit.</p>
          </Card>
          <Card className="hover:border-seafair hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-seafair focus-visible:outline-none" tabIndex={0} onFocus={() => speak('Fitur Pemindai Gambar')}>
            <Camera size={32} className="mb-4 text-seafair" />
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">Pemindai Gambar</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">Pindai teks dari buku atau objek fisik menggunakan kamera dan dengarkan isinya.</p>
          </Card>
          <Card className="hover:border-changeling hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-changeling focus-visible:outline-none" tabIndex={0} onFocus={() => speak('Fitur Catatan Suara')}>
            <Mic size={32} className="mb-4 text-changeling" />
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">Catatan Suara</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">Rekam catatan dan gagasan langsung menggunakan suara secara efisien.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
