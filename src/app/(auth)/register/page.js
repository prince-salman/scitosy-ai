"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTTS } from '@/hooks/useTTS';
import { Button, Input, Card } from '@/components/ui';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nameRef = useRef(null);
  
  const { register } = useAuth();
  const { speak } = useTTS();
  const router = useRouter();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      const msg = 'Semua kolom harus diisi.';
      setError(msg);
      speak(msg);
      return;
    }

    if (password.length < 8) {
      const msg = 'Kata sandi minimal 8 karakter.';
      setError(msg);
      speak(msg);
      return;
    }

    const result = register(name, email, password);
    if (result.ok) {
      speak('Pendaftaran berhasil.');
      router.push('/dashboard');
    } else {
      setError(result.msg);
      speak(result.msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-zinc-950">Buat Akun</h1>
        <p className="text-zinc-500 text-center mb-8 text-sm">
          Daftar untuk mengakses fitur SCITOSY AI.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md mb-6 text-sm font-medium" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            ref={nameRef}
            type="text"
            label="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => speak('Kolom nama lengkap')}
            required
          />
          <Input
            type="email"
            label="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => speak('Kolom email')}
            required
          />
          <Input
            type="password"
            label="Kata Sandi (Min. 8 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => speak('Kolom kata sandi, minimal 8 karakter')}
            required
          />
          
          <Button type="submit" className="w-full mt-2">
            Daftar
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-600">
          Sudah punya akun? <Link href="/login" className="font-semibold text-zinc-900 hover:underline">Masuk di sini</Link>
        </div>
      </Card>
    </div>
  );
}
