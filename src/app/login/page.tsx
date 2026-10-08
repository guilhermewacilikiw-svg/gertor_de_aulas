"use client"

import { useActionState, useState } from 'react'
import { login } from './actions'
import { ArrowLeft, Building2, GraduationCap, Users, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Estado inicial para o form (usado pelo useActionState)
const initialState = {
  error: null as string | null,
}

type Perfil = 'escola' | 'professor' | 'aluno'

const PERFIS: { id: Perfil; rotulo: string; icone: typeof Building2 }[] = [
  { id: 'escola', rotulo: 'Escola', icone: Building2 },
  { id: 'professor', rotulo: 'Professor', icone: GraduationCap },
  { id: 'aluno', rotulo: 'Aluno', icone: Users },
]

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Perfil>('escola')

  // useActionState do React 19 / Next.js 15+
  const [state, formAction, isPending] = useActionState(login as any, initialState)

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] font-sans">
      <header className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2 min-h-11 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Voltar para o início
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <span className="w-12 h-12 overflow-hidden rounded-xl border border-white/10">
                <Image src="/logo-rock.jpg" alt="" width={48} height={48} className="w-full h-full object-cover" />
              </span>
              <span className="font-bebas text-3xl text-white">Wakoda</span>
            </Link>
            <h1 className="text-2xl font-semibold text-white">Entrar na sua conta</h1>
            <p className="text-sm text-gray-400 mt-1">Escolha como você usa o sistema.</p>
          </div>

          <div className="inline-flex w-full p-1 rounded-lg bg-white/[0.04] mb-6" role="group" aria-label="Tipo de conta">
            {PERFIS.map(({ id, rotulo, icone: Icone }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-pressed={activeTab === id}
                className={`flex-1 inline-flex items-center justify-center gap-2 min-h-11 rounded-md text-sm transition-colors ${
                  activeTab === id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icone className="w-4 h-4" aria-hidden="true" /> {rotulo}
              </button>
            ))}
          </div>

          <form className="space-y-5" action={formAction}>
            <input type="hidden" name="loginType" value={activeTab} />

            {state?.error && (
              <div role="alert" className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
                <p className="text-sm text-red-300">{state.error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-300">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full min-h-11 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 transition-colors text-sm"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-gray-300">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full min-h-11 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 transition-colors text-sm"
                placeholder="Sua senha"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label htmlFor="remember-me" className="inline-flex items-center gap-2 min-h-11 text-gray-300">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-red-600"
                />
                Lembrar de mim
              </label>
              <a
                href="mailto:suporte@wakoda.com.br?subject=Esqueci%20minha%20senha"
                className="inline-flex items-center min-h-11 text-gray-300 hover:text-white underline-offset-4 hover:underline"
              >
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex justify-center items-center gap-2 min-h-12 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (<><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Entrando…</>) : 'Entrar'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="text-white underline underline-offset-4 hover:text-red-400">Cadastre sua escola</Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            Precisa de ajuda?{' '}
            <a href="mailto:suporte@wakoda.com.br" className="text-white underline underline-offset-4 hover:text-red-400">Fale com o suporte</a>
          </p>
        </div>
      </main>
    </div>
  )
}
