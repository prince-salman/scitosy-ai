"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTTS } from '@/hooks/useTTS';
import { Button, Input, Card } from '@/components/ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const emailRef = useRef(null);
  
  const { login } = useAuth();
  const { speak } = useTTS();
  const router = useRouter();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      const msg = 'Email dan kata sandi harus diisi.';
      setError(msg);
      speak(msg);
      return;
    }

    const result = login(email, password);
    if (result.ok) {
      speak('Berhasil masuk.');
      router.push('/dashboard');
    } else {
      setError(result.msg);
      speak(result.msg);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@scitosy.com');
    setPassword('password123');
    speak('Akun demo dipilih. Tekan tombol Masuk.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-zinc-950">Masuk</h1>
        <p className="text-zinc-500 text-center mb-8 text-sm">
          Lanjutkan sesi belajar Anda.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md mb-6 text-sm font-medium" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            ref={emailRef}
            type="email"
            label="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => speak('Kolom email')}
            required
          />
          <Input
            type="password"
            label="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => speak('Kolom kata sandi')}
            required
          />
          
          <Button type="submit" className="w-full mt-2" onFocus={() => speak('Tombol Masuk')}>
            Masuk
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-600">
          <button 
            type="button" 
            onClick={handleDemoLogin} 
            className="font-semibold text-zinc-900 hover:underline mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-sm"
            onFocus={() => speak('Gunakan Akun Demo untuk Juri')}
          >
            Gunakan Akun Demo (Juri)
          </button>
          <div className="mt-2">
            Belum punya akun? <Link href="/register" className="font-semibold text-zinc-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-sm">Daftar di sini</Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
