'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonVideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  title: string;
  progress?: number;
}

export function LessonVideoPlayer({ videoUrl, thumbnailUrl, title, progress = 0 }: LessonVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // If no video URL is provided, we just show an empty/disabled state
  if (!videoUrl) {
    return (
      <div className="relative w-full h-48 sm:h-56 rounded-2xl bg-gradient-to-br from-[#12121A] to-[#0a0a0f] border border-white/5 overflow-hidden flex flex-col items-center justify-center mb-6 group">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <Play className="w-5 h-5 text-white/20 ml-1 fill-current" />
        </div>
        <p className="text-sm font-bold text-white/40">Gravação não disponível</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-48 sm:h-56 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-white/10 overflow-hidden flex items-center justify-center mb-6 group transition-all shadow-lg cursor-pointer hover:border-cyan-400/30" onClick={() => setIsPlaying(true)}>
        
        {/* Dynamic Thumbnail or Gradient */}
        {thumbnailUrl ? (
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${thumbnailUrl})` }}></div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#7D7AE8]/30 to-[#C0E87A]/30 opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
        )}
        
        {/* 3D decorative shapes */}
        <div className="absolute top-4 left-4 w-12 h-12 rounded bg-amber-400/40 rotate-12 blur-md transition-all group-hover:scale-150"></div>
        <div className="absolute bottom-4 right-8 w-8 h-8 rounded-full bg-cyan-400/40 blur-md transition-all group-hover:scale-150"></div>
        
        {/* Play Button */}
        <button className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
          <Play className="w-6 h-6 text-white ml-1 fill-white drop-shadow-md" />
        </button>

        {/* Progress Bar Override inside thumbnail */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50">
            <div className="h-full bg-gradient-to-r from-amber-400 to-cyan-400" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>

      {/* Video Modal Overlay */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl bg-[#12121A] rounded-2xl border border-white/10 shadow-[0_0_100px_rgba(125,122,232,0.3)] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
              <h3 className="text-lg font-black text-white">{title}</h3>
              <button 
                onClick={() => setIsPlaying(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actual Video Element */}
            <div className="w-full aspect-video bg-black relative flex items-center justify-center">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full outline-none"
                controlsList="nodownload"
              >
                Seu navegador não suporta a reprodução deste vídeo.
              </video>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
