'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Save, Loader2, Star, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LancarAvaliacaoClient() {
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [assessmentName, setAssessmentName] = useState('Avaliação de Progresso - Mês Atual');
  
  // scores map: studentId -> number (0-100)
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadData() {
      if (!classId) return;
      const supabase = createClient();
      
      const { data: cls } = await supabase.from('classes').select('name, courses(name)').eq('id', classId).single();
      if (cls) setClassInfo(cls);

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('students(id, name, student_code)')
        .eq('class_id', classId)
        .eq('status', 'active');

      if (enrollments) {
        const studs = enrollments.map((e: any) => Array.isArray(e.students) ? e.students[0] : e.students).filter(Boolean);
        setStudents(studs);
        
        // Initialize scores with 0
        const initialScores: Record<string, number> = {};
        studs.forEach(s => initialScores[s.id] = 0);
        setScores(initialScores);
      }
      setLoading(false);
    }
    loadData();
  }, [classId]);

  const handleScoreChange = (studentId: string, val: string) => {
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;
    if (num > 100) num = 100;
    if (num < 0) num = 0;
    setScores(prev => ({ ...prev, [studentId]: num }));
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && classId) {
      const { data: publicUser } = await supabase.from('users').select('id').eq('auth_user_id', user.id).single();
      
      if (publicUser) {
        const { data: teacherRecord } = await supabase.from('teachers').select('id, school_id').eq('user_id', publicUser.id).single();
        const schoolId = teacherRecord?.school_id;

        if (schoolId) {
          // 1. Criar "Assessment" generalista
          const { data: assessment } = await supabase
            .from('assessments')
            .insert({
              school_id: schoolId,
              title: assessmentName,
              description: `Lançado via painel do professor para a turma ${classInfo?.name}`,
              category: 'progress'
            })
            .select()
            .single();

          if (assessment) {
            // 2. Lançar as notas para cada aluno
            const inserts = students.map(student => ({
              school_id: schoolId,
              assessment_id: assessment.id,
              student_id: student.id,
              evaluator_id: publicUser.id,
              scores_json: { progress: scores[student.id] }
            }));

            await supabase.from('student_assessments').insert(inserts);

            setSuccess(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            
            setTimeout(() => {
              router.push('/professor/avaliacoes');
              router.refresh();
            }, 2000);
          }
        } else {
          alert("Erro: ID da Escola não encontrado.");
        }
      }
    }
    setSaving(false);
  };

  if (!classId) return <div className="text-center text-gray-400 py-12">Turma não especificada.</div>;
  if (loading) return <div className="text-center text-gray-400 py-12">Carregando lista de alunos...</div>;
  if (success) return (
    <div className="bg-[#C0E87A]/10 border border-[#C0E87A]/30 rounded-3xl p-12 text-center flex flex-col items-center">
      <CheckCircle2 className="w-16 h-16 text-[#C0E87A] mb-4" />
      <h2 className="text-2xl font-bold text-[#C0E87A]">Avaliações Salvas com Sucesso!</h2>
      <p className="text-gray-400 mt-2">Redirecionando...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      
      <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 shadow-lg flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#E5E87A]/10 flex items-center justify-center">
          <Star className="w-6 h-6 text-[#E5E87A]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{classInfo?.name}</h2>
          <p className="text-sm text-gray-500">{classInfo?.courses?.name}</p>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 shadow-lg space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-1">Título da Avaliação</label>
          <input 
            type="text" 
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E5E87A] transition-all"
          />
        </div>

        <div className="pt-4 space-y-4">
          <div className="grid grid-cols-12 gap-4 pb-2 border-b border-white/5 text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
            <div className="col-span-8 md:col-span-9">Aluno</div>
            <div className="col-span-4 md:col-span-3 text-right">Evolução (%)</div>
          </div>
          
          {students.map(student => (
            <div key={student.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="col-span-8 md:col-span-9 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5E87A]/20 flex items-center justify-center text-[#E5E87A] font-bold text-sm shrink-0">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="font-bold text-white truncate">{student.name}</p>
                  <p className="text-xs text-gray-500 font-mono">ID: {student.student_code || '---'}</p>
                </div>
              </div>
              <div className="col-span-4 md:col-span-3 flex justify-end">
                <div className="relative w-24">
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={scores[student.id]}
                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                    className="w-full pl-4 pr-8 py-2 bg-black border border-white/10 rounded-lg text-white font-bold text-right focus:outline-none focus:border-[#E5E87A] transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={saving || students.length === 0}
          className="bg-[#E5E87A] hover:bg-[#E5E87A]/90 text-black px-8 py-3.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar Avaliações
        </button>
      </div>

    </div>
  );
}
