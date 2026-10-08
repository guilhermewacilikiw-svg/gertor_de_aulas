import { randomInt } from 'crypto';

// Sem caracteres parecidos (0/O, 1/l/I) para facilitar a leitura e o ditado da senha.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export function generateTempPassword(length = 10): string {
  let senha = '';
  for (let i = 0; i < length; i++) {
    senha += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `${senha}@1`;
}
