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
        // Bunyikan beep kecil bisa dilakukan, tapi kita gunakan TTS
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

  const handleAIResponse = (text) => {
    const lowerText = text.toLowerCase();
    let reply = "Maaf, saya tidak menemukan materi tersebut di database. Coba tanyakan tentang Sejarah Proklamasi, Matematika Bilangan Bulat, atau IPA Tata Surya.";
    
    if (lowerText.includes('proklamasi') || lowerText.includes('kemerdekaan') || lowerText.includes('soekarno')) {
      reply = "Tentu! Proklamasi kemerdekaan Indonesia dibacakan pada tanggal 17 Agustus 1945 oleh Soekarno dan Hatta. Apakah Anda ingin berlatih soal sejarah ini?";
    } else if (lowerText.includes('bilangan') || lowerText.includes('matematika')) {
      reply = "Baik. Bilangan bulat terdiri dari bilangan positif, nol, dan negatif. Jika kamu menjumlahkan dua bilangan dengan tanda yang sama, hasilnya akan mempertahankan tanda tersebut. Mau coba satu soal hitungan?";
    } else if (lowerText.includes('tata surya') || lowerText.includes('planet') || lowerText.includes('bumi')) {
      reply = "Tata surya kita berpusat pada Matahari. Bumi adalah planet ketiga, satu-satunya yang diketahui memiliki suhu ideal untuk menopang kehidupan.";
    } else if (lowerText.includes('halo') || lowerText.includes('hai')) {
      reply = "Halo! Saya adalah Tutor cerdas Anda. Hari ini kita mau belajar apa?";
    } else if (lowerText.includes('siapa namamu') || lowerText.includes('kamu siapa')) {
      reply = "Saya adalah asisten AI dari SCITOSY. Saya di sini untuk menemani Anda belajar.";
    }

    setAiResponse(reply);
    stop();
    setTimeout(() => speak(reply), 500);
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      speak('Perekaman dihentikan.');
    } else {
      stop();
      // Speak first, then start listening after a delay
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
          <Bot className="text-lilac" /> Tutor AI Suara
        </h1>
        <p className="text-zinc-500 text-lg">Ngobrol langsung dengan AI untuk membahas materi pelajaran secara lisan.</p>
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
                <p className="text-xs font-semibold text-zinc-500 mb-1">Anda berkata:</p>
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
