"use client";

import { useEffect, useCallback } from 'react';

export const useTTS = () => {
  const speak = useCallback((text, interrupt = true) => {
    if (!text?.trim() || !window.speechSynthesis) return;
    if (interrupt) window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
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
