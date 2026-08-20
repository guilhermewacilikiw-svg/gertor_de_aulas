'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle2, Clock, PlayCircle, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FinalizarAulaModal } from '@/components/teacher/FinalizarAulaModal';
import { cn } from '@/lib/utils';

export default function ProfessorDashboard() {
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [activeClassesCount, setActiveClassesCount] = useState(0);

  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: publicUser } = await supabase
          .from('users')
          .select('id, name')
          .eq('auth_user_id', user.id)
          .single();

        if (publicUser) {
          setTeacherName(publicUser.name.split(' ')[0]);
          const { data: teacherRecord } = await supabase
            .from('teachers')
            .select('id, school_id')
            .eq('user_id', publicUser.id)
            .maybeSingle();

          if (teacherRecord) {
            setTeacherId(teacherRecord.id);
            setSchoolId(teacherRecord.school_id);
            
            // Fetch Lessons only after schoolId is known
            const { data: dbLessons } = await supabase
              .from('lessons')
              .select(`
                id, scheduled_start, topic, status, completed_at,
                classes (name, courses(name))
              `)
              .eq('school_id', teacherRecord.school_id)
              .order('scheduled_start', { ascending: true });

            setLessons(dbLessons || []);

            const { count: classesCount } = await supabase
              .from('classes')
              .select('id', { count: 'exact', head: true })
              .eq('school_id', teacherRecord.school_id)
              .eq('status', 'active');
              
            setActiveClassesCount(classesCount || 0);
          }
        }
      }
      setLoading(false);
    }

    loadData();
  }, []);

  const openFinalize = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#0a0a0f] min-h-screen pb-12 w-full text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pt-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight drop-shadow-md">
              Olá, Prof. {teacherName} <span className="animate-pulse inline-block">🎸</span>
            </h1>
            <p className="text-sm text-gray-400 mt-2 font-medium">
              Gerencie suas aulas e registre o progresso dos seus alunos.
            </p>
          </div>

          {/* Quick action button */}
          {lessons.length > 0 && (
            <button
              onClick={() => openFinalize(lessons[0])}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#C0E87A] to-[#7D7AE8] hover:scale-105 text-black font-black text-sm shadow-[0_0_20px_rgba(192,232,122,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>FINALIZAR AULA ATUAL</span>
            </button>
          )}
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Aulas Agendadas" 
            value={lessons.filter(l => l.status === 'scheduled').length.toString()} 
            icon={<Calendar className="w-6 h-6" />} 
            color="from-[#7D7AE8] to-[#A27AE8]" 
            glowColor="bg-[#7D7AE8]"
          />
          <MetricCard 
            title="Aulas Concluídas" 
            value={lessons.filter(l => l.status === 'completed').length.toString()} 
            icon={<CheckCircle2 className="w-6 h-6" />} 
            color="from-[#C0E87A] to-[#E5E87A]" 
            glowColor="bg-[#C0E87A]"
            textColor="text-black"
          />
          <MetricCard 
            title="Turmas Ativas" 
            value={activeClassesCount.toString()} 
            icon={<Users className="w-6 h-6" />} 
            color="from-[#A27AE8] to-[#C77AE8]" 
            glowColor="bg-[#A27AE8]"
          />
        </div>

        {/* Lista de Aulas */}
        <div className="bg-[#12121A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7D7AE8]/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7D7AE8]/20 to-transparent flex items-center justify-center border border-[#7D7AE8]/30">
                <Clock className="w-5 h-5 text-[#7D7AE8]" />
              </div>
              <h2 className="text-xl font-bold text-white">Aulas de Hoje & Próximas</h2>
            </div>
            <span className="text-xs text-[#E5E87A] font-black uppercase tracking-widest bg-[#E5E87A]/10 px-3 py-1.5 rounded-lg">{lessons.length} Aulas</span>
          </div>

          <div className="space-y-4 relative z-10">
            {lessons.map((lesson) => {
              const isCompleted = lesson.status === 'completed';
              const courseName = lesson.classes?.courses?.name || 'Violão';
              const className = lesson.classes?.name || 'Turma A';
              const timeStr = new Date(lesson.scheduled_start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={lesson.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#7D7AE8]/20 text-[#A27AE8]">
                        {courseName} • {className}
                      </span>
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {timeStr}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-lg group-hover:text-[#C0E87A] transition-colors pt-1">{lesson.topic}</h3>
                  </div>

                  <div className="flex items-center gap-3 mt-2 md:mt-0">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C0E87A]/10 text-[#C0E87A] font-bold text-xs border border-[#C0E87A]/20">
                        <CheckCircle2 className="w-4 h-4" /> Concluída
                      </span>
                    ) : (
                      <button
                        onClick={() => openFinalize(lesson)}
                        className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-2 hover:scale-105"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#7D7AE8]" />
                        Finalizar Aula
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            
            {lessons.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Nenhuma aula encontrada para hoje.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Finalização */}
        {selectedLesson && (
          <FinalizarAulaModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            lessonId={selectedLesson.id}
            schoolId={schoolId}
            teacherId={teacherId}
            lessonTopic={selectedLesson.topic}
            className={`${selectedLesson.classes?.courses?.name || 'Violão'} - ${selectedLesson.classes?.name || 'Turma A'}`}
            onSuccess={() => {
              setLessons(prev => prev.map(l => l.id === selectedLesson.id ? { ...l, status: 'completed' } : l));
            }}
          />
        )}

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, glowColor, textColor = "text-white" }: { title: string; value: string; icon: React.ReactNode; color: string, glowColor: string, textColor?: string }) {
  return (
    <div className="bg-[#12121A]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all shadow-lg hover:-translate-y-1">
      <div className={`absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500`}>
        <div className={`w-32 h-32 ${glowColor} rounded-full blur-[50px]`}></div>
      </div>
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{title}</span>
          <div className={cn(`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300`, textColor)}>
            {icon}
          </div>
        </div>
        <div className="text-4xl font-black tracking-tight text-white">{value}</div>
      </div>
    </div>
  );
}
