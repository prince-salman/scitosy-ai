"use client";

import { useState, useRef, useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { Card, Button } from '@/components/ui';
import { Bot, Mic, MicOff, MessageSquare } from 'lucide-react';

export default function AITutor() {
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = useRef(null);
  const { speak, stop } = useTTS();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'id-ID';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserTranscript(transcript);
        handleAIResponse(transcript);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        speak('Maaf, saya tidak menangkap suara Anda. Silakan coba lagi.');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleAIResponse = async (text) => {
    const lowerText = text.toLowerCase();
    
    const sendReply = (reply) => {
      setAiResponse(reply);
      stop();
      setTimeout(() => speak(reply), 500);
    };

    // 1. Percakapan Kasual & Sapaan
    if (lowerText === 'halo' || lowerText === 'hai' || lowerText.includes('halo tutor')) {
      return sendReply("Halo! Saya adalah Tutor AI pintar Anda. Ada pertanyaan seputar pelajaran hari ini?");
    } 
    
    if (lowerText.includes('siapa namamu') || lowerText.includes('kamu siapa') || lowerText.includes('dibuat oleh')) {
      return sendReply("Saya adalah asisten AI dari SCITOSY. Saya dirancang khusus untuk mempermudah Anda belajar dengan cepat.");
    }

    // 2. Ekstrak subjek untuk pencarian API Ensiklopedia Real-Time
    // Menghapus kata tanya umum agar tersisa kata kuncinya saja
    let keyword = text.replace(/(apa itu|siapa itu|jelaskan tentang|pengertian dari|yang dimaksud dengan|bagaimana|ceritakan tentang|apa yang dimaksud|tolong jelaskan|apa arti|siapakah|apa|itu)/gi, '').trim();
    
    if (!keyword) {
      return sendReply("Coba tanyakan sesuatu yang spesifik, misalnya 'Apa itu matahari?' atau 'Siapa Soekarno?'");
    }

    sendReply("Sebentar, saya cari informasinya...");

    // Format kata kunci (huruf kapital di awal kata) untuk Wikipedia
    const searchTopic = encodeURIComponent(keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_'));

    try {
      // Mengambil data dari Wikipedia Bahasa Indonesia secara gratis & instan
      const res = await fetch(`https://id.wikipedia.org/api/rest_v1/page/summary/${searchTopic}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.extract) {
          // Ambil maksimal 2-3 kalimat pertama agar tidak terlalu panjang dibacakan
          const sentences = data.extract.split('. ');
          let finalReply = sentences.slice(0, 2).join('. ');
          if (!finalReply.endsWith('.')) finalReply += '.';
          
          return sendReply(finalReply);
        }
      } else {
        // Coba pencarian sekunder jika format judul Wikipedia tidak pas persis
        const searchRes = await fetch(`https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keyword)}&utf8=&format=json&origin=*`);
        const searchData = await searchRes.json();
        
        if (searchData.query && searchData.query.search.length > 0) {
          const firstHitTitle = searchData.query.search[0].title;
          const detailRes = await fetch(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstHitTitle.replace(/ /g, '_'))}`);
          const detailData = await detailRes.json();
          
          if (detailData.extract) {
            const sentences = detailData.extract.split('. ');
            let finalReply = sentences.slice(0, 2).join('. ');
            if (!finalReply.endsWith('.')) finalReply += '.';
            return sendReply(finalReply);
          }
        }
      }
    } catch (e) {
      console.error("API Error", e);
    }

    // 3. Fallback jika gagal mencari di internet
    return sendReply(`Maaf, saya tidak dapat menemukan informasi akurat mengenai ${keyword} saat ini. Coba tanyakan topik lain.`);
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      speak('Perekaman dihentikan.');
    } else {
      stop();
      speak('Silakan bertanya.');
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch(e) {}
      }, 1500);
    }
  };

  return (
    <div className="p-8 md:p-12 lg:p-16 flex flex-col h-full min-h-[calc(100vh-48px)]">
      <header className="mb-8" tabIndex={0} onFocus={() => speak('Halaman Tutor AI. Gunakan mikrofon untuk berdiskusi soal materi.')}>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-3 flex items-center gap-3">
          <Bot className="text-lilac" /> Tutor AI Pintar
        </h1>
        <p className="text-zinc-500 text-lg">Ngobrol langsung dan tanyakan materi apapun, AI akan mencari jawabannya secara seketika.</p>
      </header>

      <div className="flex-1 flex flex-col gap-6 max-w-3xl">
        <Card 
          className={`flex-1 flex flex-col items-center justify-center p-12 text-center cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lilac ${isListening ? 'border-lilac bg-lilac/10' : 'hover:bg-zinc-50'}`}
          onClick={toggleListen}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleListen()}
          onFocus={() => speak(isListening ? 'Sedang merekam, tekan enter untuk berhenti.' : 'Tekan enter untuk mulai bertanya pada AI.')}
        >
          <div className={`p-6 rounded-full mb-6 ${isListening ? 'bg-lilac text-white animate-pulse' : 'bg-zinc-100 text-zinc-500'}`}>
            {isListening ? <Mic size={48} /> : <MicOff size={48} />}
          </div>
          <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
            {isListening ? 'Mendengarkan...' : 'Tekan untuk Bertanya'}
          </h2>
          <p className="text-zinc-500">
            {isListening ? 'Silakan bicara sekarang.' : 'Pastikan mikrofon Anda aktif.'}
          </p>
        </Card>

        {(userTranscript || aiResponse) && (
          <div className="flex flex-col gap-4 mt-4">
            {userTranscript && (
              <div className="bg-zinc-100 rounded-2xl rounded-tl-none p-4 w-3/4 self-start border border-zinc-200" tabIndex={0} onFocus={() => speak(`Anda berkata: ${userTranscript}`)}>
                <p className="text-xs font-semibold text-zinc-500 mb-1">Anda bertanya:</p>
                <p className="text-zinc-800">{userTranscript}</p>
              </div>
            )}
            
            {aiResponse && (
              <div className="bg-bunny/40 rounded-2xl rounded-tr-none p-4 w-3/4 self-end border border-bunny" tabIndex={0} onFocus={() => speak(`Tutor menjawab: ${aiResponse}`)}>
                <p className="text-xs font-semibold text-lilac mb-1 flex items-center gap-1"><Bot size={14} /> Tutor AI:</p>
                <p className="text-zinc-800 leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
