"use client"

import { useActionState, useState } from 'react'
import { login } from './actions'
import { ArrowRight, Lock, Users, GraduationCap, Building2, AlertCircle, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#0a0a0a] font-sans">
      
      {/* Global CSS for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .cyber-grid {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
        . { clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
        . { clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
      `}} />

      {/* Background Cyber Grid & Scanline */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
      </div>

      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-white transition-colors border border-red-500/20 bg-red-500/5 px-4 py-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-[90px] h-[90px] overflow-hidden rounded-2xl p-[1px] border border-white/10 group-hover:shadow-[0_0_20px_rgba(229,9,20,0.35)] transition-all">
              <Image src="/logo-rock.jpg" alt="Wakoda Logo" width={90} height={90} className="w-full h-full object-cover" />
            </div>
            <span className="font-bebas tracking-tight text-3xl text-white">Wakoda</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Acesso ao Sistema
        </h2>
        <p className="mt-2 text-center text-sm text-white/70">
          Selecione seu perfil para entrar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Tabs de Seleção */}
        <div role="tablist" aria-label="Tipo de acesso" className="flex bg-black/50 border border-white/10 p-1 mb-6 rounded-lg">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'escola'}
            onClick={() => setActiveTab('escola')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold transition-all ${
              activeTab === 'escola' 
                ? 'bg-red-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" /> Escola
          </button>
          
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'professor'}
            onClick={() => setActiveTab('professor')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold transition-all ${
              activeTab === 'professor' 
                ? 'bg-white text-black' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Professor
          </button>
          
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'aluno'}
            onClick={() => setActiveTab('aluno')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold transition-all ${
              activeTab === 'aluno' 
                ? 'bg-red-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" /> Aluno
          </button>
        </div>

        <div className="bg-black/80 border-t-4 border-red-500 rounded-lg py-8 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:px-10 relative">
          
          {/* Corner tech details */}
          <div className="absolute top-0 right-0 p-2 border-b border-l border-white/10 bg-white/5 text-xs font-black font-mono text-gray-400 tracking-widest">
            Acesso seguro
          </div>

          <form className="space-y-6" action={formAction}>
            
            <input type="hidden" name="loginType" value={activeTab} />

            {state?.error && (
              <div className="p-4 border-l-4 border-red-500 bg-red-500/10 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{state.error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-white/80">
                E-mail
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full py-3 px-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono text-sm rounded-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-white/80">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-red-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full py-3 pl-10 pr-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono text-sm rounded-none"
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
                  className="h-4 w-4 border-white/10 bg-white/5 text-red-500 focus:ring-red-500 focus:ring-offset-[#0a0a0a] rounded-none"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-red-400 hover:text-white transition-colors">
                  Esqueci minha senha
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center items-center gap-3 py-3.5 px-4 text-base font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="flex items-center gap-2">
                  {isPending ? 'Entrando...' : 'Entrar'}
                  {!isPending && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-sm text-white/70">
          Não tem uma conta? <Link href="/cadastro" className="text-red-400 font-semibold hover:text-white transition-colors">Cadastre sua escola</Link>
        </p>
        <p className="mt-4 text-center text-sm text-white/70">
          Precisa de ajuda? <a href="mailto:suporte@wakoda.com.br" className="text-white/80 hover:text-red-500 transition-colors">Fale com o suporte</a>
        </p>
      </div>
    </div>
  )
}
