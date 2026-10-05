'use client';

import { useState } from 'react';
import { Check, Copy, KeyRound } from 'lucide-react';

interface TempPasswordNoticeProps {
  name?: string;
  email: string;
  password: string;
  onDone: () => void;
  doneLabel?: string;
}

export function TempPasswordNotice({ name, email, password, onDone, doneLabel = 'Concluir' }: TempPasswordNoticeProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`E-mail: ${email}\nSenha temporária: ${password}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissão de área de transferência: o usuário pode copiar manualmente.
    }
  };

  return (
    <div className="space-y-5 p-6" role="status">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-400">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Acesso criado{name ? ` para ${name}` : ''}</h3>
          <p className="text-sm text-gray-300">Entregue estes dados à pessoa. A senha só aparece agora.</p>
        </div>
      </div>

      <dl className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 text-sm">
        <div>
          <dt className="text-gray-400">E-mail</dt>
          <dd className="font-mono text-white break-all">{email}</dd>
        </div>
        <div>
          <dt className="text-gray-400">Senha temporária</dt>
          <dd className="font-mono text-lg text-red-300 select-all">{password}</dd>
        </div>
      </dl>
      <p className="text-xs text-gray-400">Ela será obrigada a trocar a senha no primeiro acesso.</p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={copy}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado' : 'Copiar dados'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white transition-colors"
        >
          {doneLabel}
        </button>
      </div>
    </div>
  );
}
