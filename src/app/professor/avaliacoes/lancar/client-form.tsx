'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Save, 
  Loader2, 
  Star, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sparkles, 
  Award, 
  ArrowLeft,
  ChevronDown,
  MessageSquare,
  Music,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  name: string;
  isHighlighted: boolean;
}

const PRESET_ACTIVITIES = [
  'Repertório & Solos',
  'Ritmo & Andamento',
  'Técnica & Digitação',
  'Teoria Musical',
  'Percepção Auditiva',
  'Postura & Palhetada'
];

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

  // Activities defined by the teacher
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: 'act-1', name: 'Técnica & Digitação', isHighlighted: false },
    { id: 'act-2', name: 'Ritmo & Compasso', isHighlighted: false },
    { id: 'act-3', name: 'Repertório Musical', isHighlighted: true },
  ]);
  const [newActivityName, setNewActivityName] = useState('');
  const [highlightNew, setHighlightNew] = useState(false);

  // Scores map: studentId -> activityId -> number (0.0 to 10.0)
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  // Notes per student: studentId -> string
  const [notes, setNotes] = useState<Record<string, string>>({});
  // Open notes accordion state
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      if (!classId) return;
      const supabase = createClient();
      
      const { data: cls } = await supabase
        .from('classes')
        .select('name, courses(name)')
        .eq('id', classId)
        .single();
      if (cls) setClassInfo(cls);

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('students(id, name, student_code)')
        .eq('class_id', classId)
        .eq('status', 'active');

      if (enrollments) {
        const studs = enrollments
          .map((e: any) => Array.isArray(e.students) ? e.students[0] : e.students)
          .filter(Boolean);
        setStudents(studs);
        
        // Initialize scores with default 8.0 for all students & default activities
        const initialScores: Record<string, Record<string, number>> = {};
        studs.forEach(s => {
          initialScores[s.id] = {
            'act-1': 8.0,
            'act-2': 8.0,
            'act-3': 8.5
          };
        });
        setScores(initialScores);
      }
      setLoading(false);
    }
    loadData();
  }, [classId]);

  // Score change handler (0 to 10)
  const handleScoreChange = (studentId: string, actId: string, val: string) => {
    let num = parseFloat(val);
    if (isNaN(num)) num = 0;
    if (num > 10) num = 10;
    if (num < 0) num = 0;
    
    // Round to 1 decimal place max
    num = Math.round(num * 10) / 10;

    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [actId]: num
      }
    }));
  };

  // Add new activity
  const handleAddActivity = (nameToAdd?: string) => {
    const name = (nameToAdd || newActivityName).trim();
    if (!name) return;

    const newId = `act-${Date.now()}`;
    const newAct: ActivityItem = {
      id: newId,
      name,
      isHighlighted: highlightNew
    };

    setActivities(prev => [...prev, newAct]);
    setNewActivityName('');
    setHighlightNew(false);

    // Initialize score for new activity for all students
    setScores(prev => {
      const updated = { ...prev };
      students.forEach(s => {
        updated[s.id] = {
          ...(updated[s.id] || {}),
          [newId]: 8.0
        };
      });
      return updated;
    });
  };

  // Remove activity
  const handleRemoveActivity = (actId: string) => {
    if (activities.length <= 1) {
      alert('A avaliação deve conter pelo menos uma atividade.');
      return;
    }
    setActivities(prev => prev.filter(a => a.id !== actId));
  };

  // Toggle Highlight for an activity
  const handleToggleHighlight = (actId: string) => {
    setActivities(prev =>
      prev.map(a =>
        a.id === actId ? { ...a, isHighlighted: !a.isHighlighted } : a
      )
    );
  };

  // Calculate average score for a student (0 - 10)
  const calculateStudentAverage = (studentId: string): number => {
    if (activities.length === 0) return 0;
    const studentActScores = scores[studentId] || {};
    const sum = activities.reduce((acc, act) => acc + (studentActScores[act.id] ?? 0), 0);
    return Math.round((sum / activities.length) * 10) / 10;
  };

  // Badge color helper based on score (0 - 10)
  const getScoreBadge = (score: number) => {
    if (score >= 9.0) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        label: 'Excelente'
      };
    }
    if (score >= 7.0) {
      return {
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        label: 'Bom'
      };
    }
    if (score >= 5.0) {
      return {
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        label: 'Regular'
      };
    }
    return {
      bg: 'bg-red-500/10 text-red-400 border-red-500/30',
      label: 'Atenção'
    };
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && classId) {
      const { data: publicUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();
      
      if (publicUser) {
        const { data: teacherRecord } = await supabase
          .from('teachers')
          .select('id, school_id')
          .eq('user_id', publicUser.id)
          .single();
        const schoolId = teacherRecord?.school_id;

        if (schoolId) {
          // 1. Criar o registro principal em "assessments"
          const { data: assessment, error: assessError } = await supabase
            .from('assessments')
            .insert({
              school_id: schoolId,
              title: assessmentName,
              description: `Lançado via painel do professor para a turma ${classInfo?.name}`,
              category: 'progress'
            })
            .select()
            .single();

          if (assessError) {
            console.error('Error creating assessment:', assessError);
            alert('Erro ao salvar avaliação: ' + assessError.message);
            setSaving(false);
            return;
          }

          if (assessment) {
            // 2. Inserir os critérios/atividades em "assessment_items" com destaque
            const itemsToInsert = activities.map(act => ({
              school_id: schoolId,
              assessment_id: assessment.id,
              name: act.name,
              max_score: 10.00,
              weight: act.isHighlighted ? 1.5 : 1.0,
              is_highlighted: act.isHighlighted
            }));

            const { error: itemsError } = await supabase
              .from('assessment_items')
              .insert(itemsToInsert);

            if (itemsError) {
              console.warn('Warning on assessment_items insert:', itemsError);
            }

            // 3. Inserir as avaliações individuais por aluno em "student_assessments"
            const highlightedActivities = activities.filter(a => a.isHighlighted).map(a => a.name);

            const inserts = students.map(student => {
              const studentActScores = scores[student.id] || {};
              const studentActivitiesData = activities.map(act => ({
                id: act.id,
                name: act.name,
                score: studentActScores[act.id] ?? 0,
                is_highlighted: act.isHighlighted
              }));

              const avg = calculateStudentAverage(student.id);

              const scoresJson: Record<string, any> = {
                activities: studentActivitiesData,
                final_grade: avg,
                progress: Math.round(avg * 10), // Compatibilidade 0-100%
                highlighted_activities: highlightedActivities,
                highlighted_activity: highlightedActivities[0] || null
              };

              // Adiciona as chaves de atividades diretamente para compatibilidade
              studentActivitiesData.forEach(a => {
                scoresJson[a.name] = a.score;
              });

              return {
                school_id: schoolId,
                assessment_id: assessment.id,
                student_id: student.id,
                evaluator_id: publicUser.id,
                scores_json: scoresJson,
                notes: notes[student.id] || null,
                evaluated_at: new Date().toISOString()
              };
            });

            const { error: assessInsertError } = await supabase
              .from('student_assessments')
              .insert(inserts);

            if (assessInsertError) {
              console.error('Error inserting student assessments:', assessInsertError);
              alert('Erro ao gravar notas: ' + assessInsertError.message);
              setSaving(false);
              return;
            }

            // 4. Disparar notificações para cada aluno
            for (const student of students) {
              const avg = calculateStudentAverage(student.id);
              const { data: stdRecord } = await supabase
                .from('students')
                .select('user_id')
                .eq('id', student.id)
                .single();

              if (stdRecord?.user_id) {
                const hlText = highlightedActivities.length > 0 
                  ? ` Destaque: ${highlightedActivities.join(', ')}.`
                  : '';
                await supabase.from('notifications').insert({
                  school_id: schoolId,
                  user_id: stdRecord.user_id,
                  type: 'assessment_published',
                  title: 'Nova Avaliação Lançada! ⭐',
                  message: `Sua nota geral foi ${avg.toFixed(1)}/10 na avaliação "${assessmentName}".${hlText}`,
                  data: {
                    assessment_id: assessment.id,
                    final_grade: avg
                  }
                });
              }
            }

            setSuccess(true);
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            
            setTimeout(() => {
              router.push('/professor/avaliacoes');
              router.refresh();
            }, 2000);
          }
        } else {
          alert('Erro: ID da Escola não encontrado.');
        }
      }
    }
    setSaving(false);
  };

  if (!classId) return <div className="text-center text-gray-400 py-12">Turma não especificada.</div>;
  if (loading) return <div className="text-center text-gray-400 py-12">Carregando lista de alunos...</div>;
  if (success) return (
    <div className="bg-[#0e0e14] border border-red-500/30 rounded-3xl p-12 text-center flex flex-col items-center max-w-xl mx-auto my-12 shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-black text-white">Avaliações Salvas com Sucesso!</h2>
      <p className="text-gray-400 mt-2 text-sm max-w-md">
        As notas de 0 a 10 e atividades destacadas foram salvas e enviadas aos alunos da turma.
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest">
        <Loader2 className="w-4 h-4 animate-spin" />
        Redirecionando...
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/professor/avaliacoes"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Turmas
        </Link>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          Escala de Notas: 0 a 10.0
        </span>
      </div>

      {/* Class Header Banner */}
      <div className="bg-[#0e0e14] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-600/20 shrink-0">
            <Star className="w-7 h-7 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-red-500">
                {classInfo?.courses?.name || 'Curso'}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400">{students.length} Alunos Matriculados</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">{classInfo?.name}</h1>
          </div>
        </div>
      </div>

      {/* Configuration Section: Title & Activities */}
      <div className="bg-[#0e0e14] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Assessment Title */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Título da Avaliação
          </label>
          <input 
            type="text" 
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            placeholder="Ex: Avaliação de Progresso - Mês Atual"
            className="w-full md:w-2/3 px-4 py-3 bg-black/60 border border-white/10 rounded-2xl text-white font-semibold focus:outline-none focus:border-red-500/50 transition-all text-base shadow-inner"
          />
        </div>

        {/* Activities & Criteria Management */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Atividades & Critérios Avaliados (Notas de 0 a 10)
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Adicione atividades personalizadas e clique na estrela para <strong className="text-amber-400">destacar</strong> a atividade principal.
              </p>
            </div>
            <span className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5 self-start sm:self-auto">
              {activities.length} {activities.length === 1 ? 'atividade' : 'atividades'}
            </span>
          </div>

          {/* Activity Cards/Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activities.map((act) => (
              <div 
                key={act.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  act.isHighlighted
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="min-w-0 flex-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleHighlight(act.id)}
                    title={act.isHighlighted ? 'Remover destaque' : 'Destacar esta atividade'}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      act.isHighlighted
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105'
                        : 'bg-white/5 text-gray-400 hover:text-amber-400 hover:bg-white/10'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${act.isHighlighted ? 'fill-black' : ''}`} />
                  </button>
                  <div className="truncate">
                    <p className={`font-bold text-sm truncate ${act.isHighlighted ? 'text-amber-300' : 'text-white'}`}>
                      {act.name}
                    </p>
                    {act.isHighlighted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400">
                        ⭐ Em Destaque
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveActivity(act.id)}
                  title="Remover atividade"
                  className="w-7 h-7 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Activity Input */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input 
              type="text"
              value={newActivityName}
              onChange={(e) => setNewActivityName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddActivity(); }}
              placeholder="Digite o nome da atividade (ex: Palhetada Alternada, Solo, Escalas...)"
              className="flex-1 px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-red-500 transition-all"
            />
            
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none px-2">
              <input
                type="checkbox"
                checked={highlightNew}
                onChange={(e) => setHighlightNew(e.target.checked)}
                className="rounded accent-amber-500 cursor-pointer"
              />
              <span>Destacar ⭐</span>
            </label>

            <button
              type="button"
              onClick={() => handleAddActivity()}
              disabled={!newActivityName.trim()}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Adicionar Atividade
            </button>
          </div>

          {/* Quick presets tags */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-gray-500 font-medium">Sugestões rápidas:</span>
            {PRESET_ACTIVITIES.map((preset) => {
              const alreadyAdded = activities.some(a => a.name.toLowerCase() === preset.toLowerCase());
              if (alreadyAdded) return null;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAddActivity(preset)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-red-500" />
                  {preset}
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Student Grades Entry Table */}
      <div className="bg-[#0e0e14] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-red-500" />
              Lançamento de Notas dos Alunos
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Atribua a nota de cada aluno de <strong>0.0 a 10.0</strong> para cada atividade definida.
            </p>
          </div>
          <div className="text-xs text-gray-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            Média ponderada calculada automaticamente
          </div>
        </div>

        {students.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Nenhum aluno ativo nesta turma.</div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => {
              const average = calculateStudentAverage(student.id);
              const badge = getScoreBadge(average);
              const isNotesOpen = expandedNotes[student.id];

              return (
                <div 
                  key={student.id} 
                  className="bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all p-5 space-y-4"
                >
                  {/* Student Top Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Student Info */}
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white font-black text-base shrink-0 shadow-md">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="font-black text-white text-base truncate">{student.name}</p>
                        <p className="text-xs text-gray-500 font-mono">ID: {student.student_code || '---'}</p>
                      </div>
                    </div>

                    {/* Activity Scores Input Grid */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {activities.map((act) => {
                        const actScore = scores[student.id]?.[act.id] ?? 0;
                        return (
                          <div 
                            key={act.id}
                            className={`p-3 rounded-xl border transition-all ${
                              act.isHighlighted
                                ? 'bg-amber-500/5 border-amber-500/30'
                                : 'bg-white/5 border-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-xs font-bold truncate ${act.isHighlighted ? 'text-amber-300' : 'text-gray-300'}`}>
                                {act.isHighlighted ? '⭐ ' : ''}{act.name}
                              </span>
                              {act.isHighlighted && (
                                <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                                  Destaque
                                </span>
                              )}
                            </div>

                            <div className="relative">
                              <input 
                                type="number" 
                                min="0" 
                                max="10" 
                                step="0.1" 
                                value={actScore}
                                onChange={(e) => handleScoreChange(student.id, act.id, e.target.value)}
                                className={`w-full pl-3 pr-10 py-1.5 bg-black border rounded-lg text-white font-black text-right focus:outline-none transition-colors text-base ${
                                  act.isHighlighted
                                    ? 'border-amber-500/50 focus:border-amber-400 text-amber-300'
                                    : 'border-white/10 focus:border-red-500'
                                }`}
                              />
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs pointer-events-none">
                                /10
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Student Average Pill */}
                    <div className="flex items-center lg:flex-col items-end justify-between lg:justify-center border-t lg:border-t-0 pt-3 lg:pt-0 border-white/5 lg:pl-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 lg:mb-1">
                        Média Final
                      </span>
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1.5 rounded-xl border text-sm font-black flex items-center gap-1.5 ${badge.bg}`}>
                          <span>{average.toFixed(1)}</span>
                          <span className="text-[10px] opacity-75">/ 10</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Feedback / Note Accordion */}
                  <div className="pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setExpandedNotes(prev => ({ ...prev, [student.id]: !prev[student.id] }))}
                      className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isNotesOpen ? 'Ocultar feedback pedagógico' : 'Adicionar observação / feedback individual'}</span>
                      {notes[student.id] && <span className="w-2 h-2 rounded-full bg-red-500" />}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isNotesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isNotesOpen && (
                      <div className="mt-2 animate-in fade-in duration-200">
                        <textarea
                          rows={2}
                          value={notes[student.id] || ''}
                          onChange={(e) => setNotes(prev => ({ ...prev, [student.id]: e.target.value }))}
                          placeholder={`Observações pedagógicas para ${student.name} (ex: excelente evolução no solo, focar no ritmo)...`}
                          className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500 transition-all placeholder:text-gray-600"
                        />
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Save Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e0e14] border border-white/5 rounded-3xl p-6 shadow-xl">
        <div className="text-xs text-gray-400">
          Certifique-se de preencher as notas de todos os alunos antes de publicar.
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link
            href="/professor/avaliacoes"
            className="px-6 py-3.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold text-sm transition-all text-center flex-1 sm:flex-initial"
          >
            Cancelar
          </Link>

          <button 
            type="button"
            onClick={handleSave}
            disabled={saving || students.length === 0}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-8 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gravando Avaliações...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Salvar Avaliações</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
