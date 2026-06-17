"use client";

import { useState } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { Card, Button } from '@/components/ui';
import { Play, Square, Repeat } from 'lucide-react';

const LESSONS = [
  { id: 1, title: 'Proklamasi Kemerdekaan', subject: 'IPS', content: 'Indonesia memproklamasikan kemerdekaannya pada 17 Agustus 1945 di Jalan Pegangsaan Timur nomor 56. Teks dibacakan oleh Soekarno dan Hatta.' },
  { id: 2, title: 'Bilangan Bulat', subject: 'Matematika', content: 'Bilangan bulat mencakup negatif, nol, dan positif. Penjumlahan dua bilangan bertanda sama akan menghasilkan tanda yang sama.' },
  { id: 3, title: 'Tata Surya', subject: 'IPA', content: 'Matahari adalah pusat tata surya. Bumi adalah planet ketiga dan satu-satunya yang diketahui memiliki kehidupan karena suhu yang mendukung.' }
];

export default function AudioPlayer() {
  const [activeLesson, setActiveLesson] = useState(null);
  const { speak, stop } = useTTS();

  const handleSelect = (lesson) => {
    stop();
    setActiveLesson(lesson);
    speak(`${lesson.title}. Siap diputar. Tekan tab ke tombol Putar.`);
  };

  const handlePlay = () => activeLesson && speak(activeLesson.content);
  const handleStop = () => stop();
  const handleRepeat = () => {
    stop();
    setTimeout(() => activeLesson && speak(activeLesson.content), 100);
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-48px)]">
      <div className="w-full md:w-80 border-r border-zinc-200 bg-zinc-50/50 py-8">
        <h2 className="text-xs font-semibold px-8 pb-4 text-zinc-500 uppercase tracking-wider">
          Daftar Materi
        </h2>
        <div className="flex flex-col">
          {LESSONS.map(lesson => {
            const isActive = activeLesson?.id === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => handleSelect(lesson)}
                className={`px-8 py-4 text-left transition-colors border-l-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lilac ${isActive ? 'bg-bunny/60 border-l-lilac' : 'border-l-transparent hover:bg-bunny/30'}`}
                onFocus={() => speak(`${lesson.title}, mata pelajaran ${lesson.subject}`)}
              >
                <div className="font-medium text-sm text-zinc-900">{lesson.title}</div>
                <div className="text-xs text-zinc-500 mt-1">{lesson.subject}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-8 md:p-12 lg:p-16">
        {!activeLesson ? (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
            Pilih materi dari daftar untuk memulai.
          </div>
        ) : (
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-zinc-950 mb-2 tracking-tight">{activeLesson.title}</h1>
            <p className="text-zinc-500 mb-10">{activeLesson.subject}</p>
            
            <div className="flex gap-3 mb-12">
              <Button onClick={handlePlay} onFocus={() => speak('Putar')}><Play size={16}/> Putar</Button>
              <Button variant="secondary" onClick={handleStop} onFocus={() => speak('Henti')}><Square size={16}/> Henti</Button>
              <Button variant="ghost" onClick={handleRepeat} onFocus={() => speak('Ulangi')}><Repeat size={16}/> Ulangi</Button>
            </div>

            <Card>
              <h3 className="text-xs font-semibold text-zinc-500 mb-4 uppercase tracking-wider">Transkrip</h3>
              <p className="leading-relaxed text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-sm p-1" tabIndex={0} onFocus={() => speak('Area transkrip teks')}>
                {activeLesson.content}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
