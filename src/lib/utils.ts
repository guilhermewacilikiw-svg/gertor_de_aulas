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
  if (msg.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
  if (msg.includes('password should contain at least one character of each')) return 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.';
  if (msg.includes('email rate limit exceeded')) return 'Muitas tentativas. Aguarde um momento e tente novamente.';
  if (msg.includes('invalid email')) return 'O formato do e-mail é inválido.';
  
  return 'Ocorreu um erro no servidor. Tente novamente mais tarde.';
}
