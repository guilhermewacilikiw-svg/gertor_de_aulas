'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="max-w-6xl mx-auto bg-black/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-3 px-6 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all hover:bg-black/60">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-[90px] h-[90px] overflow-hidden rounded-2xl p-[1px] border border-white/10 shadow-[0_0_15px_rgba(162,122,232,0.4)] group-hover:shadow-[0_0_20px_rgba(192,232,122,0.5)] transition-all">
            <Image src="/logo-rock.jpg" alt="Wakoda Logo" width={90} height={90} priority={true} className="w-full h-full object-cover" />
          </div>
          <span className="font-bebas text-white text-2xl tracking-tight">Wakoda</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-white hover:-translate-y-0.5 transition-all">Início</Link>
          <Link href="/#recursos" className="text-sm font-bold text-gray-400 hover:text-white hover:-translate-y-0.5 transition-all">Recursos</Link>
          <Link href="/#beneficios" className="text-sm font-bold text-gray-400 hover:text-white hover:-translate-y-0.5 transition-all">Benefícios</Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-white hover:text-red-500 transition-colors hidden md:block">
            Entrar
          </Link>
          <Link href="/cadastro" className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-black transition-all shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/40 hidden sm:block">
            Criar Conta
          </Link>
          <button 
            className="md:hidden p-2 text-white/60 hover:text-white ml-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 p-4 animate-in fade-in slide-in-from-top-2">
          <div className="bg-[#12121A] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-bold text-gray-300 hover:text-white p-2">Início</Link>
            <Link href="/#recursos" onClick={() => setIsOpen(false)} className="text-sm font-bold text-gray-300 hover:text-white p-2">Recursos</Link>
            <Link href="/#beneficios" onClick={() => setIsOpen(false)} className="text-sm font-bold text-gray-300 hover:text-white p-2 border-b border-white/10 pb-4">Benefícios</Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-sm font-bold text-gray-300 hover:text-white p-2">Entrar na minha conta</Link>
            <Link href="/cadastro" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-xl bg-red-600 text-white text-sm font-black mt-2">
              Criar Conta
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
