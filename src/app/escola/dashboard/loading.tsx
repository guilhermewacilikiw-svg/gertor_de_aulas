import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen p-8 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(125,122,232,0.2)]">
          <Loader2 className="w-8 h-8 text-[#7D7AE8] animate-spin" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold text-white tracking-tight">Carregando painel...</h2>
          <p className="text-sm text-gray-400">Sincronizando dados da escola</p>
        </div>
        
        {/* Simple skeleton grid to show structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 h-32 flex flex-col justify-between animate-pulse bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex justify-between items-center">
                <div className="w-16 h-3 bg-white/10 rounded-full"></div>
                <div className="w-10 h-10 rounded-xl bg-white/10"></div>
              </div>
              <div className="w-24 h-8 bg-white/10 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
