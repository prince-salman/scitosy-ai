"use client";

import { useState, useRef, useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { Card } from '@/components/ui';
import { Bot, Mic, MicOff } from 'lucide-react';

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
    const sendReply = (reply) => {
      setAiResponse(reply);
      stop();
      setTimeout(() => speak(reply), 500);
    };

    // Respon lokal super cepat untuk sapaan dasar
    const lowerText = text.toLowerCase();
    if (lowerText === 'halo' || lowerText === 'hai') {
      return sendReply("Halo! Saya adalah Tutor AI pintar Anda. Ada pertanyaan pelajaran apa hari ini?");
    }

    sendReply("Sebentar, saya berpikir...");

    try {
      // Menggunakan integrasi AI Generatif (LLM) sungguhan via Pollinations API (Gratis & Tanpa Key)
      const systemPrompt = "Kamu adalah tutor pendidikan cerdas dan ramah dari aplikasi SCITOSY AI untuk pengguna tunanetra. Jawablah pertanyaan dengan ringkas, jelas, dan menggunakan kalimat maksimal 3 kalimat agar mudah didengar. Jangan gunakan simbol kompleks.";
      const url = `https://text.pollinations.ai/${encodeURIComponent(text)}?system=${encodeURIComponent(systemPrompt)}`;
      
      const res = await fetch(url);
      
      if (res.ok) {
        let finalReply = await res.text();
        
        // Membersihkan simbol markdown ganda jika ada (seperti ** atau *)
        finalReply = finalReply.replace(/[*#_`]/g, '');
        
        return sendReply(finalReply);
      } else {
        throw new Error("Gagal mengambil data dari AI");
      }
    } catch (e) {
      console.error("AI Error", e);
      return sendReply("Maaf, koneksi otak AI saya sedang terganggu internet. Coba tanyakan lagi nanti.");
    }
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
          <Bot className="text-lilac" /> Tutor Generatif AI
        </h1>
        <p className="text-zinc-500 text-lg">Dilengkapi dengan mesin kecerdasan buatan sungguhan. AI dapat menganalisis dan menjawab pertanyaan rumit secara instan.</p>
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
