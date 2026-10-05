import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Somente POST: um GET permitiria deslogar o usuário a partir de qualquer link ou imagem.
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}
