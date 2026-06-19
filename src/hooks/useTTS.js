"use client";

import { useEffect, useCallback, useRef, useState } from 'react';

export const useTTS = () => {
  const utterancesRef = useRef([]);
  const [indonesianVoice, setIndonesianVoice] = useState(null);

  // Memuat daftar suara dari sistem
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Mencari profil suara Indonesia (seperti 'Google Bahasa Indonesia')
      const idVoice = voices.find(v => v.lang === 'id-ID' || v.lang === 'id_ID' || v.lang === 'id' || v.name.includes('Indonesia'));
      if (idVoice) {
        setIndonesianVoice(idVoice);
      }
    };

    // Chrome memuat suara secara asinkronus, jadi kita harus menangkap event ini
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text, interrupt = true) => {
    if (!text?.trim() || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (interrupt) window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'id-ID';
    utterance.rate = 1.1; // Kecepatan nyaman

    // Memaksa browser menggunakan profil suara Indonesia agar tidak berubah jadi aksen Inggris
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }
    
    utterancesRef.current.push(utterance);

    utterance.onend = () => {
      utterancesRef.current = utterancesRef.current.filter(u => u !== utterance);
    };

    utterance.onerror = () => {
      utterancesRef.current = utterancesRef.current.filter(u => u !== utterance);
    };

    window.speechSynthesis.speak(utterance);
  }, [indonesianVoice]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      utterancesRef.current = [];
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stop();
    };
  }, [stop]);

  return { speak, stop };
};
