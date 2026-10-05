import { randomInt } from 'node:crypto';

const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const NUMEROS = '23456789';
const SIMBOLOS = '@#$%&*!?';

function pick(chars: string) {
  return chars[randomInt(chars.length)];
}

/** Senha temporária aleatória (12 caracteres), sem caracteres ambíguos como 0/O e 1/l. */
export function generateTempPassword(): string {
  const chars = [pick(LETRAS.toUpperCase()), pick(LETRAS.toLowerCase()), pick(NUMEROS), pick(SIMBOLOS)];
  const all = LETRAS + NUMEROS + SIMBOLOS;
  while (chars.length < 12) chars.push(pick(all));
  // Embaralha (Fisher-Yates) com fonte criptográfica
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
