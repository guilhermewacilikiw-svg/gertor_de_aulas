'use client';

import { useState, useTransition } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Trash2, ArrowRightLeft, Search, GraduationCap, Play, Check, CheckSquare, Square } from 'lucide-react';
import { 
  addScheduleAction, 
  removeScheduleAction, 
  enrollStudentAction, 
  removeStudentAction, 
  transferStudentAction,
  assignStudentToScheduleAction,
  assignStudentsToScheduleAction,
  removeStudentFromScheduleAction
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
  const [isAssignStudentModalOpen, setIsAssignStudentModalOpen] = useState(false);
  
  const [transferEnrollmentId, setTransferEnrollmentId] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [assignStudentIds, setAssignStudentIds] = useState<string[]>([]);
  const [assignSearch, setAssignSearch] = useState('');

  const [scheduleDay, setScheduleDay] = useState(1);
  const [scheduleStart, setScheduleStart] = useState('14:00');
  const [scheduleEnd, setScheduleEnd] = useState('15:00');
  const [scheduleRoom, setScheduleRoom] = useState('');

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [enrollmentTime, setEnrollmentTime] = useState('');

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
        await enrollStudentAction(turma.id, turma.course_id, turma.school_id, selectedStudentId, enrollmentTime);
        setIsStudentModalOpen(false);
        setSelectedStudentId('');
        setEnrollmentTime('');
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const handleRemoveStudent = (enrollmentId: string) => {
    if (!confirm('Tem certeza que deseja desmatricular este aluno da turma?')) return;
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

  const handleAssignStudentToSchedule = () => {
    if (!selectedScheduleId || assignStudentIds.length === 0) return;
    startTransition(async () => {
      try {
        await assignStudentsToScheduleAction(selectedScheduleId, assignStudentIds, turma.id);
        setIsAssignStudentModalOpen(false);
        setSelectedScheduleId('');
        setAssignStudentIds([]);
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  const filteredStudents = availableStudents.filter(s => s.name.toLowerCase().includes(searchStudent.toLowerCase()));

  const capacity = turma.capacity || 15;
  const enrolledCount = enrollments.length;
  const occupancyPercentage = Math.min(100, Math.round((enrolledCount / capacity) * 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-white">{turma.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-md ${turma.status === 'active' ? 'bg-green-500/15 text-green-300' : 'bg-white/5 text-gray-400'}`}>
              {turma.status === 'active' ? 'Ativa' : 'Inativa'}
            </span>
            {occupancyPercentage >= 100 && (
              <span className="text-xs px-2 py-1 rounded-md bg-red-500/15 text-red-300">Turma lotada</span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="inline-flex items-center gap-2"><GraduationCap className="w-4 h-4" aria-hidden="true" />{turma.courses?.name}</span>
            <span className="inline-flex items-center gap-2"><Users className="w-4 h-4" aria-hidden="true" />Prof. {turma.teachers?.users?.name || 'não definido'}</span>
          </p>
        </div>

        <div className="rounded-xl bg-white/[0.04] p-4 md:min-w-56">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-400">Vagas ocupadas</span>
            <span className="text-white"><span className="text-2xl font-semibold">{enrolledCount}</span> / {capacity}</span>
          </div>
          <div
            className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.min(100, occupancyPercentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Ocupação da turma"
          >
            <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min(100, occupancyPercentage)}%` }} />
          </div>
        </div>
      </div>

      {/* 2. ABAS */}
      <div className="flex items-center gap-1 border-b border-white/10">
        {([['schedules', 'Horários das aulas'], ['students', 'Alunos matriculados']] as const).map(([chave, rotulo]) => (
          <button
            key={chave}
            onClick={() => setActiveTab(chave)}
            aria-pressed={activeTab === chave}
            className={`px-4 min-h-11 text-sm transition-colors -mb-px border-b-2 ${
              activeTab === chave
                ? 'border-red-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {/* 3. SCHEDULES CONTENT */}
      {activeTab === 'schedules' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div>
              <h2 className="text-2xl font-semibold text-white">Cronograma da Turma</h2>
              <p className="text-sm text-gray-400 mt-1">Defina quando os encontros ao vivo ou presenciais acontecem.</p>
            </div>
            <button 
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl text-white font-bold text-sm hover:bg-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Novo Horário
            </button>
          </div>

          {schedules.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 bg-white/[0.03] rounded-xl border border-white/5 border-dashed">
              <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sem horários definidos</h3>
              <p className="text-gray-400 max-w-md text-center">Nenhum encontro agendado para esta turma. Adicione horários para estruturar o cronograma.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="relative group bg-[#1A1A24] rounded-xl border border-white/5 overflow-hidden hover:border-red-600/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs font-bold text-white mb-1">Dia da Semana</p>
                        <h3 className="font-semibold text-white text-2xl">{DAYS_OF_WEEK[schedule.day_of_week]}</h3>
                      </div>
                      <button 
                        onClick={() => handleRemoveSchedule(schedule.id)}
                        disabled={isPending}
                        className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50"
                        title="Excluir Horário"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-red-900 flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold">Período da Aula</p>
                          <p className="font-bold text-white text-lg tracking-wide">{schedule.start_time.slice(0, 5)} <span className="text-gray-500 text-sm mx-1">até</span> {schedule.end_time.slice(0, 5)}</p>
                        </div>
                      </div>

                      {schedule.room && (
                        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                          <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-bold">Local / Sala</p>
                            <p className="font-bold text-white text-base">{schedule.room}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                              <Users className="w-4 h-4 text-red-500" />
                            </div>
                            <p className="text-xs text-gray-500 font-bold">Alunos Vinculados</p>
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedScheduleId(schedule.id);
                              const alreadyAssigned = (schedule.schedule_participants || []).map((p: any) => p.students?.id).filter(Boolean);
                              setAssignStudentIds(alreadyAssigned);
                              setIsAssignStudentModalOpen(true);
                            }}
                            className="text-xs font-semibold text-white hover:text-red-400 transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Adicionar / Gerenciar
                          </button>
                        </div>

                        {schedule.schedule_participants && schedule.schedule_participants.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {schedule.schedule_participants.map((part: any) => (
                              <div key={part.students.id} className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5 group/part">
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center shrink-0 border border-red-600/30">
                                    <span className="text-xs font-semibold text-white">{part.students.name.charAt(0)}</span>
                                  </div>
                                  <p className="font-bold text-white text-sm truncate">{part.students.name}</p>
                                </div>
                                <button 
                                  onClick={() => {
                                    if (confirm(`Remover ${part.students.name} deste horário?`)) {
                                      startTransition(async () => {
                                        await removeStudentFromScheduleAction(schedule.id, part.students.id, turma.id);
                                      });
                                    }
                                  }}
                                  disabled={isPending}
                                  className="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover/part:opacity-100 disabled:opacity-50"
                                  title="Remover aluno"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic mt-1">Nenhum aluno neste horário.</p>
                        )}
                      </div>

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div>
              <h2 className="text-2xl font-semibold text-white">Alunos Matriculados</h2>
              <p className="text-sm text-gray-400 mt-1">Gerencie quem tem acesso aos conteúdos e aulas desta turma.</p>
            </div>
            <button 
              onClick={() => setIsStudentModalOpen(true)}
              disabled={occupancyPercentage >= 100}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <Plus className="w-5 h-5" /> Adicionar Aluno
            </button>
          </div>

          {enrollments.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 bg-white/[0.03] rounded-xl border border-white/5 border-dashed">
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Turma Vazia</h3>
              <p className="text-gray-400 max-w-md text-center">Ainda não há alunos vinculados. Clique no botão acima para adicionar o primeiro aluno a esta turma.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrollments.map((enr) => (
                <div key={enr.id} className="glass-card group flex flex-col sm:flex-row items-center p-4 gap-4 overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-900 p-[2px] shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <div className="w-full h-full bg-[#0f0f0f] rounded-full flex items-center justify-center">
                      <span className="font-semibold text-xl text-white">
                        {enr.students?.name?.charAt(0) || '-'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <h3 className="font-semibold text-white text-lg truncate group-hover:text-red-500 transition-colors duration-300">{enr.students?.name}</h3>
                    <p className="text-xs text-gray-500 truncate mb-2">{enr.students?.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10">
                        <Calendar className="w-3 h-3 text-white/40" />
                        <span className="text-xs font-bold text-gray-400">
                          Desde {new Date(enr.start_date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {enr.specific_time && (
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-lg border border-white/10">
                          <Clock className="w-3 h-3 text-red-500/70" />
                          <span className="text-xs font-bold text-red-400/80">
                            {enr.specific_time}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => {
                        setTransferEnrollmentId(enr.id);
                        setIsTransferModalOpen(true);
                      }}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600/20 hover:border-red-600/40 transition-all duration-300 group-hover:scale-110"
                      title="Transferir de Turma"
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleRemoveStudent(enr.id)}
                      disabled={isPending}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300 group-hover:scale-110 disabled:opacity-50"
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
          <div className="w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 relative overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600/30 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/20 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-semibold text-white tracking-tight">Novo Horário</h3>
                <p className="text-sm text-gray-400 mt-1">Configure o dia e hora deste encontro.</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 mb-2 group-focus-within:text-red-500 transition-colors">Dia da Semana</label>
                <select 
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all appearance-none cursor-pointer"
                >
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <option key={idx} value={idx} className="bg-[#0f0f0f]">{day}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 group-focus-within:text-red-500 transition-colors">Hora Inicial</label>
                  <input 
                    type="time" 
                    value={scheduleStart}
                    onChange={(e) => setScheduleStart(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 group-focus-within:text-red-500 transition-colors">Hora Final</label>
                  <input 
                    type="time" 
                    value={scheduleEnd}
                    onChange={(e) => setScheduleEnd(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 mb-2 group-focus-within:text-red-500 transition-colors">Sala / Localização (Opcional)</label>
                <input 
                  type="text" 
                  value={scheduleRoom}
                  onChange={(e) => setScheduleRoom(e.target.value)}
                  placeholder="Ex: Laboratório 01"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-10 relative z-10">
              <button 
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddSchedule}
                disabled={isPending || !scheduleStart || !scheduleEnd}
                className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
          <div className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 relative overflow-hidden flex flex-col max-h-[90vh] transform animate-in zoom-in-95 duration-300">
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-8 shrink-0">
              <div>
                <h3 className="text-3xl font-semibold text-white tracking-tight">Vincular Novo Aluno</h3>
                <p className="text-sm text-gray-400 mt-1">Busque um aluno ativo da escola para matricular nesta turma.</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Users className="w-6 h-6 text-red-500" />
              </div>
            </div>
            
            <div className="relative mb-6 shrink-0 z-10 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 transition-colors">Horário Específico (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: 15h da tarde, Quarta às 10h..." 
                  value={enrollmentTime}
                  onChange={(e) => setEnrollmentTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Digite o nome do aluno para filtrar..." 
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-white font-bold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                />
              </div>
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
                      ? 'bg-gradient-to-r from-red-500/20 to-transparent border-red-500/50 scale-[1.02]' 
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white truncate">{student.name}</p>
                      <p className="text-xs font-bold text-gray-500 truncate mt-0.5">{student.email}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedStudentId === student.id ? 'border-red-500 bg-red-500' : 'border-white/20'
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
                  setEnrollmentTime('');
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleEnrollStudent}
                disabled={isPending || !selectedStudentId}
                className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
          <div className="w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 relative overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-semibold text-white tracking-tight">Transferir Aluno</h3>
                <p className="text-sm text-gray-400 mt-1">Mudança de turma para o mesmo curso.</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <ArrowRightLeft className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 mb-2 group-focus-within:text-white transition-colors">Selecione a Nova Turma de Destino</label>
                {otherClasses.length === 0 ? (
                  <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">!</div>
                    <p className="text-sm text-red-400 font-bold">Não há outras turmas ativas disponíveis para o curso atual.</p>
                  </div>
                ) : (
                  <select 
                    value={selectedTransferClassId}
                    onChange={(e) => setSelectedTransferClassId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-red-500/20 focus:ring-1 focus:ring-amber-400 transition-all appearance-none cursor-pointer"
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
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleTransferStudent}
                disabled={isPending || !selectedTransferClassId}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-neutral-900 text-white rounded-2xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isPending ? 'Confirmando...' : 'Confirmar Transferência'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ASSIGN STUDENT TO SCHEDULE MODAL */}
      {isAssignStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 relative overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-semibold text-white tracking-tight">Vincular Alunos ao Horário</h3>
                <p className="text-sm text-gray-400 mt-1">Marque todos os alunos que participarão deste horário.</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-500 group-focus-within:text-white transition-colors">
                    Alunos da Turma ({assignStudentIds.length} selecionado{assignStudentIds.length === 1 ? '' : 's'})
                  </label>
                  {enrollments.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (assignStudentIds.length === enrollments.length) {
                          setAssignStudentIds([]);
                        } else {
                          setAssignStudentIds(enrollments.map(e => e.student_id));
                        }
                      }}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                    >
                      {assignStudentIds.length === enrollments.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                    </button>
                  )}
                </div>

                {enrollments.length === 0 ? (
                  <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">!</div>
                    <p className="text-sm text-red-400 font-bold">Não há alunos matriculados nesta turma. Adicione alunos na aba 'Alunos Matriculados' primeiro.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Buscar aluno pelo nome..."
                        value={assignSearch}
                        onChange={(e) => setAssignSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-red-500/30 focus:ring-1 focus:ring-red-400 transition-all placeholder:text-gray-600 font-bold"
                      />
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                      {enrollments
                        .filter(enr => enr.students?.name.toLowerCase().includes(assignSearch.toLowerCase()))
                        .map((enr) => {
                          const isSelected = assignStudentIds.includes(enr.student_id);
                          return (
                            <div 
                              key={enr.student_id}
                              onClick={() => {
                                if (isSelected) {
                                  setAssignStudentIds(prev => prev.filter(id => id !== enr.student_id));
                                } else {
                                  setAssignStudentIds(prev => [...prev, enr.student_id]);
                                }
                              }}
                              className={`p-4 rounded-xl cursor-pointer transition-all border flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-red-500/15 border-red-500/60 text-white' 
                                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                  isSelected ? 'bg-red-500 border-red-400 text-white' : 'bg-white/10 border-white/10 text-gray-500'
                                }`}>
                                  <span className="text-sm font-semibold">{enr.students?.name.charAt(0)}</span>
                                </div>
                                <p className="font-bold text-base text-white">{enr.students?.name}</p>
                              </div>
                              
                              <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                                isSelected ? 'border-red-500 bg-red-500 text-black' : 'border-white/20 bg-white/5'
                              }`}>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-white stroke-[3]" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      {enrollments.filter(enr => enr.students?.name.toLowerCase().includes(assignSearch.toLowerCase())).length === 0 && (
                        <p className="text-center text-gray-500 text-sm py-4">Nenhum aluno encontrado com esse nome.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 mt-10 relative z-10">
              <button 
                onClick={() => {
                  setIsAssignStudentModalOpen(false);
                  setSelectedScheduleId('');
                  setAssignStudentIds([]);
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAssignStudentToSchedule}
                disabled={isPending || assignStudentIds.length === 0}
                className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isPending ? 'Confirmando...' : `Confirmar Vínculo (${assignStudentIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
