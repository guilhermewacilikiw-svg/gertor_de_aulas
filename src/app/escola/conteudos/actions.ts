'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadMaterial(formData: FormData) {
  const title = formData.get('title') as string;
  const target = formData.get('target') as string;
  const file = formData.get('file') as File;

  if (!title || !target || !file || file.size === 0) {
    return { error: 'Preencha todos os campos e anexe um arquivo válido.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Não autorizado.' };
  }

  try {
    // 1. Obter usuário e escola
    const { data: publicUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!publicUser) return { error: 'Usuário não encontrado.' };

    const { data: membership } = await supabase
      .from('school_memberships')
      .select('school_id')
      .eq('user_id', publicUser.id)
      .single();

    if (!membership) return { error: 'Escola não encontrada.' };

    // 2. Determinar tipo de conteúdo pelo mime-type
    let type = 'document';
    if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.startsWith('audio/')) type = 'audio';
    else if (file.type === 'application/pdf') type = 'pdf';
    else if (file.type.includes('image/')) type = 'image';

    // 3. Upload para o Supabase Storage
    // Criar um nome de arquivo único seguro
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const storagePath = `${membership.school_id}/${safeFileName}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('materials')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) {
      console.error('Erro de Storage:', storageError);
      return { error: 'Erro ao fazer upload do arquivo. O bucket "materials" existe no Supabase?' };
    }

    // Gerar URL pública (supondo que o bucket seja público, senão criamos signed url na hora do acesso)
    const { data: publicUrlData } = supabase.storage.from('materials').getPublicUrl(storagePath);

    // 4. Inserir no Banco de Dados
    const { error: dbError } = await supabase
      .from('contents')
      .insert({
        school_id: membership.school_id,
        created_by: publicUser.id,
        title: title,
        description: `Público Alvo: ${target}`,
        type: type,
        url: publicUrlData.publicUrl,
        status: 'published'
      });

    if (dbError) {
      console.error('Erro de BD:', dbError);
      return { error: 'Arquivo enviado, mas falha ao registrar no banco de dados.' };
    }

    revalidatePath('/escola/conteudos');
    return { success: true };

  } catch (err: any) {
    console.error('Upload falhou:', err);
    return { error: 'Ocorreu um erro interno durante o upload.' };
  }
}
