'use client';

import { createLessonAction } from './actions';
import { Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function CreateLessonButton({ classId }: { classId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('class_id', classId);
    await createLessonAction(formData);
    // Em caso de erro, removemos o loading (redirecionamento será feito na action em caso de sucesso)
    setLoading(false);
  };

  return (
    <button 
      onClick={handleCreate}
      disabled={loading}
      className="bg-[#7D7AE8] hover:bg-[#7D7AE8]/90 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
      Nova Aula
    </button>
  );
}
