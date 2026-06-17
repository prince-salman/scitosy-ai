"use client";

import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { useTTS } from '@/hooks/useTTS';
import { Button, Card } from '@/components/ui';
import { Upload, FileText, Copy, Play } from 'lucide-react';

export default function ImageScanner() {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultText, setResultText] = useState('');
  
  const fileInputRef = useRef(null);
  const { speak } = useTTS();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setResultText('');
        speak(`Gambar ${file.name} dipilih. Tekan tab untuk menemukan tombol pindai.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!imageSrc) return;
    
    setLoading(true);
    speak('Memproses gambar, harap tunggu.');
    
    try {
      const result = await Tesseract.recognize(imageSrc, 'eng+ind', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      const validLines = result.data.lines
        .filter(line => line.confidence > 60)
        .map(line => line.text.replace(/[^\w\s.,!?()[\]{}"':;/-]/g, '').trim())
        .filter(line => line.length > 1);
        
      const text = validLines.join('\n').trim();
      setResultText(text || 'Tidak ada teks yang jelas terdeteksi.');
      speak(text || 'Tidak ada teks yang jelas terdeteksi.');
    } catch {
      speak('Terjadi kesalahan saat memproses gambar.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText).then(() => speak('Teks disalin.'));
  };

  return (
    <div className="p-8 md:p-12 lg:p-16">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-3">Pemindai Gambar</h1>
        <p className="text-zinc-500 text-lg">Pindai gambar berisi teks untuk dibacakan secara otomatis.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Card 
            className="mb-8 text-center cursor-pointer hover:bg-seafair/20 hover:border-seafair transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seafair focus-visible:ring-offset-2" 
            onClick={() => fileInputRef.current?.click()} 
            onFocus={() => speak('Area unggah gambar. Tekan enter untuk memilih.')} 
            tabIndex={0} 
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto mb-4 text-zinc-400" />
            <h3 className="text-base font-medium text-zinc-900 mb-2">Pilih Gambar</h3>
            <p className="text-sm text-zinc-500">JPG, PNG, WebP</p>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="sr-only" />
          </Card>

          {imageSrc && (
            <div className="mb-8 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 flex justify-center">
              <img src={imageSrc} alt="Pratinjau" className="max-h-[300px] w-auto object-contain" />
            </div>
          )}

          <Button onClick={handleScan} disabled={!imageSrc || loading} className="w-full" onFocus={() => speak('Tombol pindai teks')}>
            <FileText size={16} /> {loading ? `Memproses ${progress}%` : 'Pindai Teks'}
          </Button>
        </div>

        <div>
          {resultText && (
            <Card className="h-full">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-900">Hasil Pemindaian</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => speak(resultText)} onFocus={() => speak('Bacakan ulang')}><Play size={16} /></Button>
                  <Button variant="ghost" size="sm" onClick={handleCopy} onFocus={() => speak('Salin teks')}><Copy size={16} /></Button>
                </div>
              </div>
              <div className="text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-sm p-1" tabIndex={0} onFocus={() => speak('Area teks hasil pemindaian')}>
                {resultText}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
