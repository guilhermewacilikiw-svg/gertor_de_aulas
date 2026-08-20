import Link from 'next/link';
import { Music, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { SaaSOnboardingForm } from './client-form';
import { Suspense } from 'react';

export default function CadastroPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 bg-[#0a0a0f]">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-50 pointer-events-none"></div>

      {/* Top Bar for Navigation */}
      <div className="fixed top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-50">
        <Link href="/" className="flex items-center gap-4 group hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 overflow-hidden p-[1px] border border-white/10 group-hover:shadow-[0_0_20px_rgba(162,122,232,0.4)] transition-all cyber-clip">
            <Image src="/logo.jpg" alt="Wakoda Logo" width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-2xl text-white tracking-tight drop-shadow-md uppercase">Wakoda</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C0E87A] hover:text-white transition-colors cyber-clip-btn border border-[#C0E87A]/20 bg-[#C0E87A]/5 px-4 py-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </div>

      <div className="w-full flex items-center justify-center py-12 mt-16 relative z-10">
        <Suspense fallback={<div className="animate-pulse w-full max-w-xl h-[500px] glass-card rounded-none cyber-clip border-l-4 border-[#C0E87A]"></div>}>
          <SaaSOnboardingForm />
        </Suspense>
      </div>

    </div>
  );
}
