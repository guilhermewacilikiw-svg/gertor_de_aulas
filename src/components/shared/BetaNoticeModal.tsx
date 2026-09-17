'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, MessageCircle, Mail, AlertTriangle } from 'lucide-react';

export function BetaNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se já foi dispensado nesta sessão do navegador
    const isDismissed = sessionStorage.getItem('wakoda_beta_notice_dismissed');
    if (!isDismissed) {
      // Pequeno delay suave para abrir após a renderização da página
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('wakoda_beta_notice_dismissed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const whatsappUrl = "https://wa.me/5511992030711?text=Ol%C3%A1!%20Estou%20na%20plataforma%20Wakoda%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20ou%20relatar%20um%20bug.";
  const emailUrl = "mailto:comercial@wakoda.com.br?subject=Feedback%20%2F%20Relato%20de%20Bug%20-%20Wakoda";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Click outside to dismiss */}
      <div className="absolute inset-0" onClick={handleDismiss} />

      <div className="relative w-full max-w-lg bg-[#0f1017] border border-white/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 animate-in zoom-in-95 duration-300">
        
        {/* Linha Neon Superior */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

        {/* Botão Fechar */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          title="Fechar aviso"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Versão Beta &bull; Período Gratuito</span>
          </div>

          {/* Título */}
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 uppercase">
            Aplicativo em Testes
          </h2>

          {/* Mensagem */}
          <div className="space-y-3 text-sm leading-relaxed text-gray-300 mb-6">
            <p>
              Você está utilizando a versão de testes da plataforma <strong className="text-white">Wakoda</strong>. O sistema encontra-se atualmente em <strong className="text-red-400">período 100% gratuito</strong> para você explorar e utilizar todas as funcionalidades!
            </p>
            <p className="text-gray-400 text-xs bg-white/5 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Por ser uma versão em constante evolução, caso você encontre qualquer erro, instabilidade ou tenha dúvidas e sugestões, contate nossa equipe imediatamente:
              </span>
            </p>
          </div>

          {/* Botões de Contato Rápido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold text-sm transition-all hover:scale-[1.02] shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>(11) 99203-0711</span>
            </a>

            <a
              href={emailUrl}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 font-bold text-sm transition-all hover:scale-[1.02]"
            >
              <Mail className="w-4 h-4 text-red-400" />
              <span>comercial@wakoda.com.br</span>
            </a>
          </div>

          {/* Botão de Fechar / Continuar */}
          <button
            onClick={handleDismiss}
            className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-600/25 hover:shadow-red-600/40"
          >
            Entendi, Acessar Plataforma &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}
