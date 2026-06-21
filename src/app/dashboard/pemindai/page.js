"use client";

import { useState, useRef, useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { Card, Button } from '@/components/ui';
import { Camera, RefreshCw, Upload, Play, Square } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function Scanner() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);
  const { speak, stop } = useTTS();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setText('');
    }
  };

  const performScan = async () => {
    if (!image) return;
    setScanning(true);
    setText('');
    stop();
    
    try {
      const result = await Tesseract.recognize(image, 'ind');
      setText(result.data.text);
      setScanning(false);
    } catch (err) {
      setText('Gagal memindai gambar. Pastikan gambar jelas dan berisi teks.');
      setScanning(false);
    }
  };

  const playResult = () => speak(text);

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-48px)]">
      <div className="w-full md:w-80 border-r border-zinc-200 bg-zinc-50/50 p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-xs font-semibold pb-4 text-zinc-500 uppercase tracking-wider">
            Alat Pemindai
          </h2>
          <p className="text-sm text-zinc-600 mb-6">Pilih gambar yang mengandung teks, lalu tekan tombol pindai untuk mengekstrak tulisan.</p>
        </div>

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        
        <Button onClick={() => fileInputRef.current?.click()} className="w-full justify-start" aria-label="Pilih Gambar dari perangkat">
          <Upload size={16} className="mr-2"/> Pilih Gambar
        </Button>
        
        <Button 
          onClick={performScan} 
          disabled={!image || scanning}
          variant="primary"
          className="w-full justify-start"
          aria-label={scanning ? 'Sedang memindai gambar' : 'Pindai Teks sekarang'}
        >
          {scanning ? <RefreshCw size={16} className="mr-2 animate-spin" /> : <Camera size={16} className="mr-2" />}
          {scanning ? 'Memindai...' : 'Pindai Teks'}
        </Button>
      </div>

      <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col gap-8">
        {image && (
          <div className="max-w-md">
            <h3 className="text-sm font-medium text-zinc-900 mb-3">Pratinjau Gambar</h3>
            <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
              <img src={image} alt="Pratinjau dokumen" className="w-full h-auto object-cover max-h-64" />
            </div>
          </div>
        )}

        {text && (
          <div className="max-w-2xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-900">Hasil Pemindaian</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={playResult} aria-label="Bacakan Hasil"><Play size={16}/></Button>
                <Button variant="ghost" size="sm" onClick={stop} aria-label="Hentikan Pembacaan"><Square size={16}/></Button>
              </div>
            </div>
            <Card className="flex-1 bg-white">
              <p className="whitespace-pre-wrap text-zinc-800 leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-sm p-1" tabIndex={0}>
                {text}
              </p>
            </Card>
          </div>
        )}

        {!image && !text && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400">
            <Camera size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Pilih gambar untuk memulai pemindaian.</p>
          </div>
        )}
      </div>
    </div>
  );
}
