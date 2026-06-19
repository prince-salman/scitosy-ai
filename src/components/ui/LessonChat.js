"use client";

import { useState, useRef, useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { Button } from '@/components/ui';
import { Mic, MicOff, Bot } from 'lucide-react';

export default function LessonChat({ lessonContext }) {
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = useRef(null);
  const { speak, stop } = useTTS();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'id-ID';
      
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        speak('Maaf, saya tidak menangkap suara Anda.');
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleAIResponse(transcript);
      };
    }
  }, []);

  const handleAIResponse = async (text) => {
    stop();
    speak("Sebentar, memproses pertanyaan Anda...");
    
    try {
      const systemPrompt = `Kamu adalah tutor pendidikan SCITOSY AI untuk pengguna tunanetra. Konteks pelajaran saat ini yang baru saja dibaca siswa adalah: "${lessonContext}". Jawab pertanyaan siswa berikut ini dengan ringkas, sangat ramah, dan maksimal 2 kalimat saja. Gunakan sapaan akrab.`;
      const url = `https://text.pollinations.ai/${encodeURIComponent(text)}?system=${encodeURIComponent(systemPrompt)}`;
      
      const res = await fetch(url);
      if (res.ok) {
        let finalReply = await res.text();
        finalReply = finalReply.replace(/[*#_`]/g, '');
        setAiResponse(finalReply);
        speak(finalReply);
      } else {
        throw new Error("API Error");
      }
    } catch (e) {
      speak("Maaf, koneksi otak AI saya sedang terganggu. Coba tanyakan lagi nanti.");
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      stop();
      speak('Apa ada yang masih kamu kurang pahami? Silakan bertanya.');
      setTimeout(() => {
        try { recognitionRef.current?.start(); } catch(e) {}
      }, 3500); // Wait for the prompt to finish speaking
    }
  };

  return (
    <div className="mt-8 border-t border-zinc-200 pt-8">
      <div className="bg-lilac/10 rounded-2xl p-6 border border-lilac/20 flex flex-col items-center text-center">
        <Bot size={32} className="text-lilac mb-3" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-1" tabIndex={0} onFocus={() => speak('Bagian Tanya Tutor')}>Ada yang masih kurang dipahami?</h3>
        <p className="text-zinc-600 text-sm mb-6" tabIndex={0} onFocus={() => speak('Tekan tombol mikrofon di bawah untuk menanyakan materi ini secara lisan.')}>Tanya langsung ke AI Tutor mengenai materi ini.</p>
        
        <Button 
          onClick={toggleListen}
          size="lg"
          className={`rounded-full w-16 h-16 flex items-center justify-center transition-all ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-200' : 'bg-lilac hover:bg-lilac/90'}`}
          onFocus={() => speak(isListening ? 'Sedang merekam, tekan enter untuk berhenti' : 'Tekan enter untuk mulai bertanya')}
          aria-label="Tanya AI"
        >
          {isListening ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
        </Button>

        {aiResponse && (
          <div className="mt-6 bg-white rounded-xl p-4 w-full text-left border border-zinc-200 shadow-sm" tabIndex={0} onFocus={() => speak(`Tutor menjawab: ${aiResponse}`)}>
            <p className="text-xs font-semibold text-lilac mb-1">Jawaban AI:</p>
            <p className="text-zinc-800 text-sm leading-relaxed">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}
