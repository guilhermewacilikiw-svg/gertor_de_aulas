'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy } from 'lucide-react';

interface TempPasswordNoticeProps {
  nome: string;
  email: string;
  senha: string;
  tipo: 'aluno' | 'professor';
  voltarHref: string;
}

export function TempPasswordNotice({ nome, email, senha, tipo, voltarHref }: TempPasswordNoticeProps) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`E-mail: ${email}\nSenha temporária: ${senha}`);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="rounded-xl bg-white/[0.03] p-6 md:p-8 space-y-5" role="status">
      <div>
        <h2 className="text-lg font-semibold text-white">{tipo === 'aluno' ? 'Aluno cadastrado' : 'Professor cadastrado'}</h2>
        <p className="text-sm text-gray-400 mt-1">
          Envie estes dados para {nome}. A senha aparece só agora, e será preciso trocá-la no primeiro acesso.
        </p>
      </div>

      <dl className="rounded-lg border border-white/10 divide-y divide-white/10 text-sm">
        <div className="flex justify-between gap-4 p-3">
          <dt className="text-gray-400">E-mail</dt>
          <dd className="text-white break-all text-right">{email}</dd>
        </div>
        <div className="flex justify-between gap-4 p-3">
          <dt className="text-gray-400">Senha temporária</dt>
          <dd className="text-white font-mono select-all">{senha}</dd>
        </div>
      </dl>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={copiar}
          className="inline-flex items-center justify-center gap-2 px-4 min-h-11 rounded-lg border border-white/10 text-white text-sm hover:bg-white/5 transition-colors"
        >
          {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copiado ? 'Dados copiados' : 'Copiar dados'}
        </button>
        <Link
          href={voltarHref}
          className="inline-flex items-center justify-center px-4 min-h-11 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
        >
          Concluir
        </Link>
      </div>
    </div>
  );
}
