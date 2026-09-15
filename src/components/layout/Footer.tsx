import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0a0a0f] pt-20 pb-10 text-gray-200 overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="col-span-1 md:col-span-5">
            <div className="flex items-center gap-4 mb-6 group cursor-pointer w-max">
               <div className="w-[90px] h-[90px] overflow-hidden rounded-2xl p-[1px] border border-white/10 group-hover:shadow-[0_0_15px_rgba(162,122,232,0.4)] transition-all">
                 <Image src="/logo-rock.jpg" alt="Wakoda Logo" width={90} height={90} className="w-full h-full object-cover" />
               </div>
               <span className="font-bebas text-3xl text-white tracking-tight">Wakoda</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8 font-medium">
              A plataforma definitiva que conecta aulas presenciais, ensino EAD e engajamento para escolas de música modernas.
            </p>
            <Link 
              href="/cadastro" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:border-red-600/50"
            >
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4 text-red-500" />
            </Link>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 text-red-500">Produto</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li><Link href="/#recursos" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-red-600 opacity-0 transition-opacity"></span>Recursos</Link></li>
              <li><Link href="/planos" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-red-600 opacity-0 transition-opacity"></span>Preços</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-red-600 opacity-0 transition-opacity"></span>Entrar</Link></li>
            </ul>
          </div>


          <div className="col-span-1 md:col-span-3">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 text-red-500">Legal & Contato</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li><Link href="/legal/termos" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 transition-opacity"></span>Termos de Uso</Link></li>
              <li><Link href="/legal/privacidade" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 transition-opacity"></span>Privacidade</Link></li>
              <li><Link href="mailto:comercial@wakoda.com.br" className="hover:text-red-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-red-500 opacity-0 transition-opacity"></span>comercial@wakoda.com.br</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-gray-600 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Wakoda. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="https://twitter.com/Wakoda" target="_blank" className="hover:text-red-500 transition-colors">Twitter</Link>
            <Link href="https://instagram.com/Wakoda" target="_blank" className="hover:text-red-500 transition-colors">Instagram</Link>
            <Link href="https://linkedin.com/company/Wakoda" target="_blank" className="hover:text-red-500 transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
