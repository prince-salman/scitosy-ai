"use client";

import { useTTS } from '@/hooks/useTTS';
import { Card, Button } from '@/components/ui';
import { Heart, Play } from 'lucide-react';

const MOTIVATIONS = [
  {
    id: 1,
    title: "Tidak Ada Batasan",
    content: "Kehilangan penglihatan bukanlah akhir dari segalanya. Ia hanyalah cara baru untuk melihat dunia dengan hati dan pikiran. Teruslah belajar, karena ilmu adalah cahaya yang tak pernah padam."
  },
  {
    id: 2,
    title: "Setiap Langkah Berarti",
    content: "Mungkin kamu butuh waktu lebih lama untuk memahami sesuatu, tapi ingatlah bahwa kura-kura memenangkan perlombaan karena ia tak pernah berhenti melangkah."
  },
  {
    id: 3,
    title: "Suara Adalah Kekuatan",
    content: "Dengarkan baik-baik, karena di setiap suara ada makna. Kamu memiliki kepekaan yang luar biasa. Gunakan itu untuk menangkap ilmu pengetahuan yang bertebaran di sekitarmu."
  }
];

export default function MotivasiHarian() {
  const { speak, stop } = useTTS();

  const handlePlay = (item) => {
    stop();
    speak(`Motivasi: ${item.title}. ${item.content}`);
  };

  return (
    <div className="p-8 md:p-12 lg:p-16">
      <header className="mb-12" tabIndex={0} onFocus={() => speak('Halaman Motivasi Harian. Temukan semangat belajarmu di sini.')}>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-3 flex items-center gap-3">
          <Heart className="text-changeling" /> Motivasi Harian
        </h1>
        <p className="text-zinc-500 text-lg">Pilih dan dengarkan pesan semangat untuk harimu.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOTIVATIONS.map((item) => (
          <Card 
            key={item.id} 
            className="hover:border-changeling focus-visible:ring-2 focus-visible:ring-changeling focus-visible:outline-none transition-all cursor-pointer"
            tabIndex={0}
            onFocus={() => speak(`Kutipan: ${item.title}. Tekan enter untuk mendengarkan selengkapnya.`)}
            onClick={() => handlePlay(item)}
            onKeyDown={(e) => e.key === 'Enter' && handlePlay(item)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-zinc-900">{item.title}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                aria-label="Putar Motivasi"
                tabIndex={-1}
              >
                <Play size={16} />
              </Button>
            </div>
            <p className="text-zinc-600 leading-relaxed text-sm">
              {item.content}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
