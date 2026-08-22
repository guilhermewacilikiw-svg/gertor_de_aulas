'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadMaterial(formData: FormData) {
  const title = formData.get('title') as string;
  const target = formData.get('target') as string;
  const lesson_id = formData.get('lesson_id') as string;
  const url = formData.get('url') as string;

  if (!title || !target || !url) {
    return { error: 'Preencha todos os campos obrigatórios e insira um link válido.' };
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

    // 2. Determinar tipo de conteúdo com base na URL
    let type = 'link';
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) type = 'video';
    else if (url.includes('drive.google.com') && url.includes('pdf')) type = 'pdf';

    // 3. Inserir no Banco de Dados
    const insertData: any = {
      school_id: membership.school_id,
      created_by: publicUser.id,
      title: title,
      description: target,
      type: type,
      url: url,
      status: 'published'
    };

    const { data: contentData, error: dbError } = await supabase
      .from('contents')
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error('Erro de BD:', dbError);
      return { error: 'Falha ao registrar link no banco de dados.' };
    }

    // If target is student or module, or lesson, we insert it into content_targets
    if (target.startsWith('module_')) {
        await supabase.from('content_targets').insert({
            school_id: membership.school_id,
            content_id: contentData.id,
            target_type: 'course',
            target_id: target.replace('module_', '')
        });
    } else if (target.startsWith('student_')) {
        await supabase.from('content_targets').insert({
            school_id: membership.school_id,
            content_id: contentData.id,
            target_type: 'student',
            target_id: target.replace('student_', '')
        });
    } else {
         await supabase.from('content_targets').insert({
            school_id: membership.school_id,
            content_id: contentData.id,
            target_type: 'school',
            target_id: membership.school_id
        });
    }

    if (lesson_id) {
       await supabase.from('videos').insert({
            school_id: membership.school_id,
            lesson_id: lesson_id,
            content_id: contentData.id,
            title: title,
            storage_path: url,
            processing_status: 'ready',
            visibility: 'private'
       });
    }

    revalidatePath('/escola/conteudos');
    return { success: true };

  } catch (err: any) {
    console.error('Upload falhou:', err);
    return { error: 'Ocorreu um erro interno durante o upload.' };
  }
}
