'use client';

import { useState, useTransition } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Trash2, ArrowRightLeft, Search, GraduationCap, Play } from 'lucide-react';
import { 
  addScheduleAction, 
  removeScheduleAction, 
  enrollStudentAction, 
  removeStudentAction, 
  transferStudentAction 
} from '@/app/escola/turmas/[id]/actions';

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export function ClassManagementView({ 
  turma, 
  schedules, 
  enrollments, 
  availableStudents, 
  otherClasses 
}: { 
  turma: any, 
  schedules: any[], 
  enrollments: any[], 
  availableStudents: any[], 
  otherClasses: any[] 
}) {
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<'schedules' | 'students'>('schedules');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  
  const [transferEnrollmentId, setTransferEnrollmentId] = useState<string | null>(null);

  const [scheduleDay, setScheduleDay] = useState(1);
  const [scheduleStart, setScheduleStart] = useState('14:00');
  const [scheduleEnd, setScheduleEnd] = useState('15:00');
  const [scheduleRoom, setScheduleRoom] = useState('');

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [searchStudent, setSearchStudent] = useState('');

  const [selectedTransferClassId, setSelectedTransferClassId] = useState('');

  const handleAddSchedule = () => {
    if (!scheduleStart || !scheduleEnd) return;
    startTransition(async () => {
      try {
        await addScheduleAction(turma.id, turma.school_id, scheduleDay, scheduleStart, scheduleEnd, scheduleRoom);
        setIsScheduleModalOpen(false);
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const handleRemoveSchedule = (id: string) => {
    if (!confirm('Remover este horário?')) return;
    startTransition(async () => {
      try {
        await removeScheduleAction(id, turma.id);
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const handleEnrollStudent = () => {
    if (!selectedStudentId) return;
    startTransition(async () => {
      try {
        await enrollStudentAction(turma.id, turma.course_id, turma.school_id, selectedStudentId);
        setIsStudentModalOpen(false);
        setSelectedStudentId('');
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const handleRemoveStudent = (enrollmentId: string) => {
    if (!confirm('Remover o aluno desta turma?')) return;
    startTransition(async () => {
      try {
        await removeStudentAction(enrollmentId, turma.id);
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const handleTransferStudent = () => {
    if (!transferEnrollmentId || !selectedTransferClassId) return;
    startTransition(async () => {
      try {
        await transferStudentAction(transferEnrollmentId, selectedTransferClassId, turma.id);
        setIsTransferModalOpen(false);
        setTransferEnrollmentId(null);
        setSelectedTransferClassId('');
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const filteredStudents = availableStudents.filter(s => s.name.toLowerCase().includes(searchStudent.toLowerCase()));

  const capacity = turma.capacity || 15;
  const enrolledCount = enrollments.length;
  const occupancyPercentage = Math.min(100, Math.round((enrolledCount / capacity) * 100));
  const strokeDasharray = `${occupancyPercentage} 100`;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. HERO HEADER */}
      <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-[#12121A] to-[#0A0A0F] border border-white/5 overflow-hidden shadow-2xl p-8 md:p-12">
        {/* Animated Background Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7D7AE8]/20 rounded-full blur-[100px] animate-pulse mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C0E87A]/10 rounded-full blur-[80px] animate-pulse mix-blend-screen -translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#A27AE8]/10 rounded-full blur-[60px] animate-pulse mix-blend-screen -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '4s' }}></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10">
          
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_20px_rgba(125,122,232,0.15)] mb-6">
              <span className={`w-2 h-2 rounded-full animate-ping ${turma.status === 'active' ? 'bg-[#C0E87A]' : 'bg-red-400'}`}></span>
              <span className="text-xs font-black uppercase tracking-widest text-white/80">
                {turma.status === 'active' ? 'Turma Ativa' : 'Turma Inativa'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 tracking-tight drop-shadow-xl mb-6">
              {turma.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-[#7D7AE8]/20 flex items-center justify-center border border-[#7D7AE8]/30">
                  <GraduationCap className="w-4 h-4 text-[#C77AE8]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Curso Vinculado</p>
                  <p className="text-sm font-bold text-white">{turma.courses?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C0E87A]/20 to-[#E5E87A]/20 flex items-center justify-center border border-[#C0E87A]/30">
                  <Users className="w-4 h-4 text-[#C0E87A]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Professor Resp.</p>
                  <p className="text-sm font-bold text-white">Prof. {turma.teachers?.users?.name || 'Indefinido'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center relative">
            <div className="relative w-48 h-48 drop-shadow-[0_0_30px_rgba(125,122,232,0.3)]">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <path
                  className="text-white/5"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Progress Ring */}
                <path
                  className={`${occupancyPercentage >= 100 ? 'text-red-400' : 'text-[#7D7AE8]'} transition-all duration-1000 ease-out`}
                  strokeDasharray={strokeDasharray}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="url(#occupancy-gradient)"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <defs>
                  <linearGradient id="occupancy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={occupancyPercentage >= 100 ? "#F87171" : "#7D7AE8"} />
                    <stop offset="100%" stopColor={occupancyPercentage >= 100 ? "#DC2626" : "#A27AE8"} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black ${occupancyPercentage >= 100 ? 'text-red-400' : 'text-white'} drop-shadow-md`}>
                  {enrolledCount}
                </span>
                <span className="text-xs text-white/50 font-bold mt-1">/ {capacity} Vagas</span>
              </div>
            </div>
            {occupancyPercentage >= 100 && (
              <div className="absolute -bottom-2 bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-red-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-bounce">
                Turma Lotada
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MODERN TABS */}
      <div className="flex items-center justify-center md:justify-start gap-4">
        <button 
          onClick={() => setActiveTab('schedules')}
          className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
            activeTab === 'schedules'
            ? 'bg-gradient-to-r from-[#7D7AE8] to-[#A27AE8] text-white shadow-[0_10px_30px_rgba(125,122,232,0.4)] scale-105'
            : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white hover:scale-105 border border-white/5'
          }`}
        >
          Horários das Aulas
        </button>
        <button 
          onClick={() => setActiveTab('students')}
          className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
            activeTab === 'students'
            ? 'bg-gradient-to-r from-[#7D7AE8] to-[#A27AE8] text-white shadow-[0_10px_30px_rgba(125,122,232,0.4)] scale-105'
            : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white hover:scale-105 border border-white/5'
          }`}
        >
          Alunos Matriculados
        </button>
      </div>

      {/* 3. SCHEDULES CONTENT */}
      {activeTab === 'schedules' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
            <div>
              <h2 className="text-2xl font-black text-white">Cronograma da Turma</h2>
              <p className="text-sm text-gray-400 mt-1">Defina quando os encontros ao vivo ou presenciais acontecem.</p>
            </div>
            <button 
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl text-white font-bold text-sm hover:bg-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" /> Novo Horário
            </button>
          </div>

          {schedules.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 border-dashed">
              <div className="w-24 h-24 bg-[#7D7AE8]/20 rounded-full flex items-center justify-center mb-6 animate-float shadow-[0_0_30px_rgba(125,122,232,0.3)]">
                <Calendar className="w-10 h-10 text-[#A27AE8]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sem horários definidos</h3>
              <p className="text-gray-400 max-w-md text-center">Nenhum encontro agendado para esta turma. Adicione horários para estruturar o cronograma.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="relative group bg-[#1A1A24] rounded-3xl border border-white/5 overflow-hidden hover:border-[#7D7AE8]/50 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(125,122,232,0.15)] hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7D7AE8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs font-bold text-[#E5E87A] uppercase tracking-widest mb-1">Dia da Semana</p>
                        <h3 className="font-black text-white text-2xl drop-shadow-md">{DAYS_OF_WEEK[schedule.day_of_week]}</h3>
                      </div>
                      <button 
                        onClick={() => handleRemoveSchedule(schedule.id)}
                        disabled={isPending}
                        className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] rounded-xl transition-all duration-300 disabled:opacity-50"
                        title="Excluir Horário"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7D7AE8] to-[#C77AE8] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(125,122,232,0.4)]">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Período da Aula</p>
                          <p className="font-bold text-white text-lg tracking-wide">{schedule.start_time.slice(0, 5)} <span className="text-gray-500 text-sm mx-1">até</span> {schedule.end_time.slice(0, 5)}</p>
                        </div>
                      </div>

                      {schedule.room && (
                        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                          <div className="w-10 h-10 rounded-full bg-[#C0E87A]/20 border border-[#C0E87A]/30 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-[#C0E87A]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Local / Sala</p>
                            <p className="font-bold text-white text-base">{schedule.room}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. STUDENTS CONTENT */}
      {activeTab === 'students' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
            <div>
              <h2 className="text-2xl font-black text-white">Alunos Matriculados</h2>
              <p className="text-sm text-gray-400 mt-1">Gerencie quem tem acesso aos conteúdos e aulas desta turma.</p>
            </div>
            <button 
              onClick={() => setIsStudentModalOpen(true)}
              disabled={occupancyPercentage >= 100}
              className="px-6 py-3 bg-gradient-to-r from-[#C0E87A] to-[#E5E87A] rounded-2xl text-black font-black text-sm hover:shadow-[0_10px_30px_rgba(192,232,122,0.4)] transition-all flex items-center justify-center gap-2 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <Plus className="w-5 h-5" /> Adicionar Aluno
            </button>
          </div>

          {enrollments.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5 border-dashed">
              <div className="w-24 h-24 bg-[#C0E87A]/20 rounded-full flex items-center justify-center mb-6 animate-float shadow-[0_0_30px_rgba(192,232,122,0.3)]">
                <Users className="w-10 h-10 text-[#C0E87A]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Turma Vazia</h3>
              <p className="text-gray-400 max-w-md text-center">Ainda não há alunos vinculados. Clique no botão acima para adicionar o primeiro aluno a esta turma.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrollments.map((enr) => (
                <div key={enr.id} className="glass-card group flex flex-col sm:flex-row items-center p-4 gap-4 overflow-hidden border border-white/5 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7D7AE8] to-[#C77AE8] p-[2px] shrink-0 shadow-[0_0_15px_rgba(125,122,232,0.3)] group-hover:scale-110 transition-transform duration-500">
                    <div className="w-full h-full bg-[#0f0f0f] rounded-full flex items-center justify-center">
                      <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-br from-[#C0E87A] to-white">
                        {enr.students?.name?.charAt(0) || '-'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <h3 className="font-black text-white text-lg truncate group-hover:text-[#C0E87A] transition-colors duration-300">{enr.students?.name}</h3>
                    <p className="text-xs text-gray-500 truncate mb-2">{enr.students?.email}</p>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10">
                      <Calendar className="w-3 h-3 text-white/40" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Desde {new Date(enr.start_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => {
                        setTransferEnrollmentId(enr.id);
                        setIsTransferModalOpen(true);
                      }}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#7D7AE8]/20 hover:border-[#7D7AE8]/40 hover:shadow-[0_0_15px_rgba(125,122,232,0.3)] transition-all duration-300 group-hover:scale-110"
                      title="Transferir de Turma"
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleRemoveStudent(enr.id)}
                      disabled={isPending}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 group-hover:scale-110 disabled:opacity-50"
                      title="Desvincular Aluno"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      
      {/* 1. SCHEDULE MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#7D7AE8]/30 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#C0E87A]/20 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">Novo Horário</h3>
                <p className="text-sm text-gray-400 mt-1">Configure o dia e hora deste encontro.</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Clock className="w-6 h-6 text-[#E5E87A]" />
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-[#7D7AE8] transition-colors">Dia da Semana</label>
                <select 
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all appearance-none cursor-pointer"
                >
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <option key={idx} value={idx} className="bg-[#0f0f0f]">{day}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-[#7D7AE8] transition-colors">Hora Inicial</label>
                  <input 
                    type="time" 
                    value={scheduleStart}
                    onChange={(e) => setScheduleStart(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-[#7D7AE8] transition-colors">Hora Final</label>
                  <input 
                    type="time" 
                    value={scheduleEnd}
                    onChange={(e) => setScheduleEnd(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-[#7D7AE8] transition-colors">Sala / Localização (Opcional)</label>
                <input 
                  type="text" 
                  value={scheduleRoom}
                  onChange={(e) => setScheduleRoom(e.target.value)}
                  placeholder="Ex: Laboratório 01"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-10 relative z-10">
              <button 
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddSchedule}
                disabled={isPending || !scheduleStart || !scheduleEnd}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#7D7AE8] to-[#A27AE8] text-white rounded-2xl font-black text-sm hover:shadow-[0_10px_30px_rgba(125,122,232,0.5)] transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isPending ? 'Salvando...' : 'Adicionar Horário'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ENROLL STUDENT MODAL */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] transform animate-in zoom-in-95 duration-300">
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#C0E87A]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-8 shrink-0">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">Vincular Novo Aluno</h3>
                <p className="text-sm text-gray-400 mt-1">Busque um aluno ativo da escola para matricular nesta turma.</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Users className="w-6 h-6 text-[#C0E87A]" />
              </div>
            </div>
            
            <div className="relative mb-6 shrink-0 z-10">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Digite o nome do aluno para filtrar..." 
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-white font-bold focus:outline-none focus:border-[#C0E87A] focus:ring-1 focus:ring-[#C0E87A] transition-all shadow-inner"
              />
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar space-y-3 z-10">
              {filteredStudents.length === 0 ? (
                <div className="h-40 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                  <p className="text-center text-sm font-bold text-gray-500">Nenhum aluno encontrado correspondente à busca.</p>
                </div>
              ) : (
                filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                      selectedStudentId === student.id 
                      ? 'bg-gradient-to-r from-[#C0E87A]/20 to-transparent border-[#C0E87A]/50 shadow-[0_0_20px_rgba(192,232,122,0.15)] scale-[1.02]' 
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-black shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-black text-white truncate">{student.name}</p>
                      <p className="text-xs font-bold text-gray-500 truncate mt-0.5">{student.email}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedStudentId === student.id ? 'border-[#C0E87A] bg-[#C0E87A]' : 'border-white/20'
                    }`}>
                      {selectedStudentId === student.id && <div className="w-2 h-2 rounded-full bg-black"></div>}
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-8 pt-6 border-t border-white/10 shrink-0 z-10">
              <button 
                onClick={() => {
                  setIsStudentModalOpen(false);
                  setSelectedStudentId('');
                  setSearchStudent('');
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleEnrollStudent}
                disabled={isPending || !selectedStudentId}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C0E87A] to-[#E5E87A] text-black rounded-2xl font-black text-sm hover:shadow-[0_10px_30px_rgba(192,232,122,0.4)] transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isPending ? 'Vinculando...' : 'Matricular Aluno Selecionado'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRANSFER STUDENT MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">Transferir Aluno</h3>
                <p className="text-sm text-gray-400 mt-1">Mudança de turma para o mesmo curso.</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <ArrowRightLeft className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-amber-400 transition-colors">Selecione a Nova Turma de Destino</label>
                {otherClasses.length === 0 ? (
                  <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">!</div>
                    <p className="text-sm text-red-400 font-bold">Não há outras turmas ativas disponíveis para o curso atual.</p>
                  </div>
                ) : (
                  <select 
                    value={selectedTransferClassId}
                    onChange={(e) => setSelectedTransferClassId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0f0f0f]">-- Escolha na lista abaixo --</option>
                    {otherClasses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0f0f0f]">
                        {c.name} (Capacidade total: {c.capacity})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-10 relative z-10">
              <button 
                onClick={() => {
                  setIsTransferModalOpen(false);
                  setTransferEnrollmentId(null);
                  setSelectedTransferClassId('');
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleTransferStudent}
                disabled={isPending || !selectedTransferClassId}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-black text-sm hover:shadow-[0_10px_30px_rgba(251,191,36,0.4)] transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isPending ? 'Confirmando...' : 'Confirmar Transferência'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
