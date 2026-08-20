"use client"

import { useActionState, useState } from 'react'
import { login } from './actions'
import { ArrowRight, Lock, Users, GraduationCap, Building2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Estado inicial para o form (usado pelo useActionState)
const initialState = {
  error: null as string | null,
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'aluno' | 'professor' | 'escola'>('escola')
  
  // useActionState do React 19 / Next.js 15+
  const [state, formAction, isPending] = useActionState(login as any, initialState)

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#0a0a0f] font-sans">
      
      {/* Global CSS for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .cyber-grid {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
        .cyber-clip { clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
        .cyber-clip-btn { clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
      `}} />

      {/* Background Cyber Grid & Scanline */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]"></div>
        <div className="absolute top-0 w-full h-[5px] bg-[#A27AE8]/30 blur-sm animate-[scanline_8s_linear_infinite]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-16 h-16 overflow-hidden rounded-2xl p-[1px] border border-white/10 group-hover:shadow-[0_0_20px_rgba(162,122,232,0.4)] transition-all">
              <Image src="/logo.jpg" alt="Wakoda Logo" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <span className="font-black tracking-tight text-3xl text-white">Wakoda</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-white uppercase drop-shadow-md">
          Acesso ao Sistema
        </h2>
        <p className="mt-2 text-center text-xs font-mono text-white/50 uppercase tracking-widest">
          SYS.LOGIN // SELECIONE O NÍVEL DE PERMISSÃO
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Tabs de Seleção */}
        <div className="flex bg-black/50 border border-white/10 p-1 mb-6 cyber-clip">
          <button
            onClick={() => setActiveTab('escola')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-black uppercase tracking-widest transition-all cyber-clip-btn ${
              activeTab === 'escola' 
                ? 'bg-[#A27AE8] text-black shadow-[0_0_15px_rgba(162,122,232,0.4)]' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" /> Escola
          </button>
          
          <button
            onClick={() => setActiveTab('professor')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-black uppercase tracking-widest transition-all cyber-clip-btn ${
              activeTab === 'professor' 
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Prof
          </button>
          
          <button
            onClick={() => setActiveTab('aluno')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-black uppercase tracking-widest transition-all cyber-clip-btn ${
              activeTab === 'aluno' 
                ? 'bg-[#C0E87A] text-black shadow-[0_0_15px_rgba(192,232,122,0.4)]' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" /> Aluno
          </button>
        </div>

        <div className="bg-black/80 border-t-4 border-[#A27AE8] py-8 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:px-10 relative">
          
          {/* Corner tech details */}
          <div className="absolute top-0 right-0 p-2 border-b border-l border-white/10 bg-white/5 text-[10px] font-black font-mono text-gray-500 tracking-widest">
            SECURE_LOGIN
          </div>

          <form className="space-y-6" action={formAction}>
            
            <input type="hidden" name="loginType" value={activeTab} />

            {state?.error && (
              <div className="p-4 border-l-4 border-red-500 bg-red-500/10 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-red-400 uppercase">{state.error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-white/80">
                Identificação (E-mail)
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full py-3 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all font-mono text-sm rounded-none"
                  placeholder="USER@DOMAIN.COM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-white/80">
                Credencial (Senha)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#A27AE8]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full py-3 pl-10 pr-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all font-mono text-sm rounded-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-white/10 bg-white/5 text-[#A27AE8] focus:ring-[#A27AE8] focus:ring-offset-[#0a0a0f] rounded-none"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-mono uppercase text-white/60">
                  Manter Sessão
                </label>
              </div>

              <div className="text-xs font-mono uppercase">
                <a href="#" className="font-bold text-[#A27AE8] hover:text-[#C0E87A] transition-colors">
                  Recuperar Acesso
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center items-center gap-3 py-4 px-4 text-sm font-black uppercase tracking-widest text-black bg-[#C0E87A] hover:bg-black hover:text-[#C0E87A] border border-[#C0E87A] shadow-[0_0_20px_rgba(192,232,122,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed skew-x-[-10deg] group"
              >
                <span className="skew-x-[10deg] flex items-center gap-2">
                  {isPending ? 'AUTENTICANDO...' : 'INICIAR SESSÃO'}
                  {!isPending && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs font-mono uppercase text-white/50">
          Sem acesso? <Link href="/cadastro" className="text-[#C0E87A] font-bold hover:text-white transition-colors">Solicitar Nova Instância</Link>
        </p>
        <p className="mt-4 text-center text-xs font-mono uppercase text-white/50">
          Falha no sistema? <a href="mailto:suporte@wakoda.com.br" className="text-white/80 hover:text-[#A27AE8] transition-colors">Contatar Engenharia</a>
        </p>
      </div>
    </div>
  )
}
