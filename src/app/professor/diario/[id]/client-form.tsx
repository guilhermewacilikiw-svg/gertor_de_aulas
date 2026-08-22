'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2, Save } from 'lucide-react';
import { finishLesson } from './actions';
import confetti from 'canvas-confetti';

interface Student {
  id: string;
  name: string;
  avatar_url?: string;
  student_code?: string;
}

interface ClientFormProps {
  lessonId: string;
  students: Student[];
  isCompleted: boolean;
  initialSummary: string;
  modules: any[];
  currentModuleId: string;
}

export function ClassDiaryForm({ lessonId, students, isCompleted, initialSummary, modules, currentModuleId }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(initialSummary);
  const [moduleId, setModuleId] = useState(currentModuleId);
  
  // Default all to present initially
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    students.forEach(s => state[s.id] = true);
    return state;
  });

  const handleToggle = (studentId: string, present: boolean) => {
    if (isCompleted) return;
    setAttendance(prev => ({ ...prev, [studentId]: present }));
  };

  const handleFinish = async () => {
    if (isCompleted) return;
    if (!summary.trim()) {
      alert("Por favor, preencha o resumo da aula.");
      return;
    }

    setLoading(true);
    const res = await finishLesson(lessonId, attendance, summary, moduleId);
    if (res.success) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Lista de Chamada */}
      <div className="bg-[#0f0f0f] rounded-3xl border border-white/5 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white text-lg">Lista de Presença</h3>
            <p className="text-sm text-gray-400">Registre a frequência dos alunos matriculados.</p>
          </div>
          <div className="text-sm font-bold bg-[#A27AE8]/20 text-[#A27AE8] px-4 py-1.5 rounded-full border border-[#A27AE8]/30">
            {Object.values(attendance).filter(v => v).length} / {students.length} Presentes
          </div>
        </div>
        
        <div className="divide-y divide-white/5">
          {students.map(student => {
            const isPresent = attendance[student.id];
            
            return (
              <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-white/5 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#7D7AE8]/20 border border-[#7D7AE8]/30 flex items-center justify-center text-[#7D7AE8] font-black text-lg">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">{student.name}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {student.student_code || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    disabled={isCompleted}
                    onClick={() => handleToggle(student.id, true)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isPresent ? 'bg-[#C0E87A] text-black shadow-lg shadow-[#C0E87A]/20 scale-105' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'} ${isCompleted ? 'opacity-75 cursor-not-allowed' : 'active:scale-95'}`}
                  >
                    <Check className="w-4 h-4" /> Presente
                  </button>
                  <button 
                    disabled={isCompleted}
                    onClick={() => handleToggle(student.id, false)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${!isPresent ? 'bg-[#C77AE8] text-white shadow-lg shadow-[#C77AE8]/20 scale-105' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'} ${isCompleted ? 'opacity-75 cursor-not-allowed' : 'active:scale-95'}`}
                  >
                    <X className="w-4 h-4" /> Falta
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Módulo Relacionado */}
      <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5 shadow-lg space-y-4">
        <div>
          <h3 className="font-bold text-white text-lg">Módulo da Aula</h3>
          <p className="text-sm text-gray-400">Qual módulo do curso foi ministrado hoje?</p>
        </div>
        <select
          disabled={isCompleted}
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all appearance-none"
        >
          <option value="">Selecione um módulo (Opcional)...</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
      </div>

      {/* Resumo da Aula */}
      <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5 shadow-lg space-y-4">
        <div>
          <h3 className="font-bold text-white text-lg">Diário e Assunto da Aula</h3>
          <p className="text-sm text-gray-400">O que foi ensinado hoje? Como foi o desempenho geral da turma?</p>
        </div>
        <textarea 
          disabled={isCompleted}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Ex: Hoje revisamos a escala pentatônica. O João teve um pouco de dificuldade com a pestana..."
          className="w-full min-h-[150px] p-5 rounded-2xl border border-white/10 bg-black text-white focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] resize-y transition-colors placeholder:text-gray-600"
        />
      </div>

      {/* Botão Finalizar */}
      {!isCompleted && (
        <div className="flex justify-end">
          <button 
            disabled={loading}
            onClick={handleFinish}
            className="bg-[#7D7AE8] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#7D7AE8]/90 transition-all shadow-lg active:scale-95 flex items-center gap-2 text-lg disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Salvar Diário e Finalizar Aula
          </button>
        </div>
      )}
      
      {isCompleted && (
        <div className="bg-[#C0E87A]/10 text-[#C0E87A] border border-[#C0E87A]/30 p-5 rounded-2xl font-bold text-center flex items-center justify-center gap-3">
          <Check className="w-6 h-6" />
          Esta aula foi finalizada com sucesso!
        </div>
      )}
    </div>
  );
}
