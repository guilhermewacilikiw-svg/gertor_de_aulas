import Link from 'next/link';
import Image from 'next/image';
import { Music } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="max-w-6xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-3 px-6 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all hover:bg-black/60">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-16 h-16 overflow-hidden rounded-2xl p-[1px] border border-white/10 shadow-[0_0_15px_rgba(162,122,232,0.4)] group-hover:shadow-[0_0_20px_rgba(192,232,122,0.5)] transition-all">
            <Image src="/logo.jpg" alt="Wakoda Logo" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-white text-2xl tracking-tight">Wakoda</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#recursos" className="text-sm font-bold text-gray-400 hover:text-white hover:-translate-y-0.5 transition-all">Recursos</Link>
          <Link href="/#metodologia" className="text-sm font-bold text-gray-400 hover:text-white hover:-translate-y-0.5 transition-all">Metodologia</Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-white hover:text-[#7D7AE8] transition-colors hidden sm:block">
            Entrar
          </Link>
          <Link href="/cadastro" className="px-5 py-2.5 rounded-xl bg-[#7D7AE8] hover:bg-[#A27AE8] text-white text-sm font-black transition-all shadow-[0_0_20px_rgba(125,122,232,0.3)] hover:shadow-[0_0_40px_rgba(125,122,232,0.6)] hover:-translate-y-1 hover:scale-105 active:scale-95">
            Criar Conta Grátis
          </Link>
        </div>
      </div>
    </nav>
  );
}
