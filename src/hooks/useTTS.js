"use client";

import { useEffect, useCallback, useRef } from 'react';

export const useTTS = () => {
  const utterancesRef = useRef([]);

  const speak = useCallback((text, interrupt = true) => {
    if (!text?.trim() || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (interrupt) window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'id-ID';
    utterance.rate = 1.6;
    
    utterancesRef.current.push(utterance);

    utterance.onend = () => {
      utterancesRef.current = utterancesRef.current.filter(u => u !== utterance);
    };

    utterance.onerror = () => {
      utterancesRef.current = utterancesRef.current.filter(u => u !== utterance);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

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
