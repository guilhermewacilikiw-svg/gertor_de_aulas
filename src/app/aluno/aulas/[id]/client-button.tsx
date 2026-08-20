'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';
import { completeLesson } from './actions';

interface CompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
}

export function CompleteLessonButton({ lessonId, isCompleted }: CompleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);

  const handleComplete = async () => {
    if (completed) return;
    
    setLoading(true);
    const result = await completeLesson(lessonId);
    
    if (result.success) {
      setCompleted(true);
      
      // Mágica da Recompensa Visual! 🎉
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    } else {
      alert("Erro ao concluir: " + result.error);
    }
    setLoading(false);
  };

  if (completed) {
    return (
      <button 
        disabled
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-green-500/10 text-green-600 font-bold border border-green-500/20 flex items-center justify-center gap-2 cursor-default"
      >
        <CheckCircle2 className="w-5 h-5" />
        Aula Concluída
      </button>
    );
  }

  return (
    <button 
      onClick={handleComplete}
      disabled={loading}
      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-brand text-white font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Registrando...
        </>
      ) : (
        <>
          <CheckCircle2 className="w-5 h-5" />
          Marcar como Concluída
        </>
      )}
    </button>
  );
}
