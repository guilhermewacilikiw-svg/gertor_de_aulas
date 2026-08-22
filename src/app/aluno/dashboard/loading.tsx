import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen p-8 flex flex-col items-center justify-center animate-in fade-in duration-500 bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(192,232,122,0.2)]">
          <Loader2 className="w-8 h-8 text-[#C0E87A] animate-spin" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold text-white tracking-tight">Preparando sua experiência...</h2>
          <p className="text-sm text-gray-400">Carregando aulas e progresso</p>
        </div>
        
        {/* Simple skeleton grid to show structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mt-8 max-w-5xl">
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl h-64 animate-pulse"></div>
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-3xl h-64 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
