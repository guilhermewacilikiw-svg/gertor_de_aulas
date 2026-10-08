'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/', rotulo: 'Início' },
  { href: '/#recursos', rotulo: 'Recursos' },
  { href: '/#beneficios', rotulo: 'Benefícios' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur border-b border-white/10" aria-label="Principal">
      <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="w-10 h-10 overflow-hidden rounded-lg border border-white/10">
            <Image src="/logo-rock.jpg" alt="" width={40} height={40} priority={true} className="w-full h-full object-cover" />
          </span>
          <span className="font-bebas text-white text-2xl">Wakoda</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center min-h-11 text-sm text-gray-300 hover:text-white transition-colors">
              {l.rotulo}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden md:inline-flex items-center min-h-11 px-3 text-sm text-gray-200 hover:text-white transition-colors">
            Entrar
          </Link>
          <Link href="/cadastro" className="hidden sm:inline-flex items-center justify-center min-h-11 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors">
            Criar conta
          </Link>
          <button
            className="md:hidden min-h-11 min-w-11 inline-flex items-center justify-center text-white/70 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0f] px-4 py-3 flex flex-col">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)} className="min-h-11 flex items-center text-gray-200 hover:text-white">
              {l.rotulo}
            </Link>
          ))}
          <Link href="/login" onClick={() => setIsOpen(false)} className="min-h-11 flex items-center text-gray-200 hover:text-white border-t border-white/10 mt-1 pt-1">
            Entrar na minha conta
          </Link>
          <Link href="/cadastro" onClick={() => setIsOpen(false)} className="mt-2 min-h-11 flex items-center justify-center rounded-lg bg-red-600 text-white text-sm font-medium">
            Criar conta
          </Link>
        </div>
      )}
    </nav>
  );
}
