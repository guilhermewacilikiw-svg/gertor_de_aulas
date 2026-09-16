import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function translateSupabaseError(errorMsg: string): string {
  if (!errorMsg) return 'Ocorreu um erro inesperado.';
  
  const msg = errorMsg.toLowerCase();
  if (msg.includes('user already registered')) return 'Este e-mail já está cadastrado em nosso sistema.';
  if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (msg.includes('gateway timeout') || msg.includes('504')) return 'O servidor de envio de e-mails demorou para responder. Verifique as configurações de SMTP no Supabase.';
  if (msg.includes('weak_password') || msg.includes('password should contain at least one character of each')) return 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um símbolo (ex: @, #, !).';
  if (msg.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
  if (msg.includes('email rate limit exceeded')) return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.';
  if (msg.includes('invalid email')) return 'O formato do e-mail é inválido.';
  
  return errorMsg;
}
