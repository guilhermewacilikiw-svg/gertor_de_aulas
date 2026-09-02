'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Grid3X3, List, Users, Sparkles, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isBrazilianHoliday } from '@/lib/holidays';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: 'lesson' | 'event' | 'holiday';
  status?: string; 
  subtitle?: string; 
  location?: string;
  participants?: { id: string; name: string; email?: string }[];
}

export interface ClassSchedule {
  id: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday...
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  title: string;
  subtitle?: string;
  location?: string;
  type: 'schedule';
  participants?: { id: string; name: string; email?: string }[];
}

interface SchoolCalendarProps {
  events: CalendarEvent[];
  schedules?: ClassSchedule[];
  role: 'escola' | 'professor' | 'aluno';
}

type ViewMode = 'month' | 'week';

export function SchoolCalendar({ events, schedules = [], role }: SchoolCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedSchedule, setSelectedSchedule] = useState<ClassSchedule | null>(null);

  // Month View Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const today = () => setCurrentDate(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const isToday = (date: Date) => {
    const t = new Date();
    return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
  };

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getEventsForDate = (date: Date) => {
    const combined: CalendarEvent[] = [];

    // 1. Feriados Nacionais do Brasil
    const holiday = isBrazilianHoliday(date);
    if (holiday) {
      combined.push({
        id: `holiday-${holiday.date}`,
        title: holiday.name,
        date: date,
        type: 'holiday',
        subtitle: 'Feriado Nacional'
      });
    }

    // 2. Aulas Recorrentes da Grade Semanal correspondentes a este dia da semana
    const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Segunda...
    const daySchedules = schedules.filter(s => s.dayOfWeek === dayOfWeek);

    daySchedules.forEach(s => {
      combined.push({
        id: `sched-${s.id}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        title: s.title,
        date: date,
        startTime: s.startTime,
        endTime: s.endTime,
        type: 'lesson',
        subtitle: s.subtitle,
        location: s.location,
        participants: s.participants
      });
    });

    // 3. Eventos pontuais e aulas específicas registradas no banco
    const specificEvents = events.filter(e => 
      e.date.getDate() === date.getDate() && 
      e.date.getMonth() === date.getMonth() && 
      e.date.getFullYear() === date.getFullYear()
    );

    combined.push(...specificEvents);

    return combined.sort((a, b) => {
      if (a.type === 'holiday') return -1;
      if (b.type === 'holiday') return 1;
      return (a.startTime || '').localeCompare(b.startTime || '');
    });
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Week Grid Helpers (08:00 to 22:00)
  const HOURS_START = 8;
  const HOURS_END = 22;
  const hours = Array.from({ length: HOURS_END - HOURS_START + 1 }, (_, i) => i + HOURS_START);
  
  // Helpers for placing blocks on the grid
  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const getBlockStyle = (startTime: string, endTime: string) => {
    const startMins = timeToMinutes(startTime);
    const endMins = timeToMinutes(endTime);
    const gridStartMins = HOURS_START * 60;
    
    // Relative to the grid start
    const offsetMins = startMins - gridStartMins;
    const durationMins = endMins - startMins;

    // We assume each hour is 60px height
    const topPx = offsetMins;
    const heightPx = durationMins;

    return {
      top: `${topPx}px`,
      height: `${heightPx}px`,
      position: 'absolute' as const,
      left: '4px',
      right: '4px'
    };
  };

  const handleSelectSchedule = (s: ClassSchedule) => {
    setSelectedSchedule(s);
    setSelectedDate(null);
  };

  const handleSelectDate = (d: Date) => {
    setSelectedDate(d);
    setSelectedSchedule(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* MAIN CALENDAR AREA */}
      <div className="flex-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 p-0.5 shadow-lg">
               <div className="w-full h-full bg-[#12121A] rounded-[10px] flex items-center justify-center">
                 <CalendarIcon className="w-5 h-5 text-white" />
               </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white capitalize">
                {viewMode === 'month' ? `${monthNames[month]} ${year}` : 'Grade Semanal Fixa'}
              </h2>
              <p className="text-sm text-gray-400 font-medium">
                {viewMode === 'month' ? 'Agenda de Aulas e Eventos Pontuais' : 'Horários recorrentes das turmas'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-[#12121A] rounded-xl border border-white/10 p-1 shadow-inner">
              <button 
                onClick={() => setViewMode('week')}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all", viewMode === 'week' ? "bg-white/10 text-white shadow-md" : "text-gray-500 hover:text-gray-300")}
              >
                <Grid3X3 className="w-4 h-4" /> Semana
              </button>
              <button 
                onClick={() => setViewMode('month')}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all", viewMode === 'month' ? "bg-white/10 text-white shadow-md" : "text-gray-500 hover:text-gray-300")}
              >
                <List className="w-4 h-4" /> Mês
              </button>
            </div>

            {viewMode === 'month' && (
              <div className="flex items-center bg-[#12121A] rounded-xl border border-white/10 p-1">
                <button onClick={today} className="hidden sm:block px-4 py-2 rounded-lg hover:bg-white/5 text-sm font-bold text-gray-300 transition-colors">Hoje</button>
                <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block"></div>
                <button onClick={prevMonth} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={nextMonth} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT - MONTH VIEW */}
        {viewMode === 'month' && (
          <div className="flex-1 flex flex-col relative z-10 bg-[#0a0a0f]/50 overflow-y-auto styled-scrollbar">
            <div className="grid grid-cols-7 border-b border-white/5 sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-md z-20">
              {weekDays.map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-red-600">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 min-h-min">
              {days.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} className="min-h-[90px] md:min-h-[100px] border-r border-b border-white/5 bg-[#12121A]/30" />;
                
                const dayEvents = getEventsForDate(date);
                
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectDate(date)}
                    className={cn(
                      "min-h-[90px] md:min-h-[100px] border-r border-b border-white/5 p-2 flex flex-col items-start gap-1 transition-all hover:bg-white/5 group relative text-left",
                      isSelected(date) && "bg-red-600/10 border-red-600/30 ring-1 ring-inset ring-red-600/50"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 shrink-0 transition-all",
                      isToday(date) ? "bg-gradient-to-r from-red-600 to-red-500 text-black shadow-[0_0_20px_rgba(192,232,122,0.4)]" : "text-gray-400 group-hover:text-white"
                    )}>
                      {date.getDate()}
                    </div>
                    
                    <div className="w-full flex-1 overflow-hidden space-y-1 hidden sm:block">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <div key={idx} className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded border truncate font-bold flex items-center gap-1",
                          e.type === 'holiday' 
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30" 
                            : e.type === 'lesson' 
                            ? "bg-red-600/15 text-red-300 border-red-500/30" 
                            : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                        )}>
                          {e.type === 'holiday' ? (
                            <span className="truncate">🎉 {e.title}</span>
                          ) : (
                            <>
                              {e.startTime && <span className="opacity-80 font-mono text-[9px] shrink-0">{e.startTime}</span>}
                              <span className="truncate">{e.title}</span>
                            </>
                          )}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[9px] text-gray-400 font-bold pl-1 uppercase tracking-wider">
                          + {dayEvents.length - 3} mais
                        </div>
                      )}
                    </div>

                    <div className="sm:hidden flex flex-wrap gap-1 mt-auto pb-1">
                      {dayEvents.map((e, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "w-1.5 h-1.5 rounded-full", 
                            e.type === 'holiday' ? "bg-amber-400" : e.type === 'lesson' ? "bg-red-500" : "bg-blue-500"
                          )} 
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTENT - WEEK VIEW */}
        {viewMode === 'week' && (
          <div className="flex-1 flex flex-col relative z-10 bg-[#0a0a0f]/50 overflow-auto max-h-[800px] styled-scrollbar">
            <div className="min-w-[800px]">
              {/* Week Header */}
              <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/5 sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-md z-30">
                <div className="py-4 border-r border-white/5"></div>
                {weekDays.map((day, i) => (
                  <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-red-600 border-r border-white/5">
                    {day}
                  </div>
                ))}
              </div>

            {/* Timetable Grid */}
            <div className="relative">
              {/* Background horizontal lines for hours */}
              {hours.map(hour => (
                <div key={hour} className="grid grid-cols-[60px_1fr] border-b border-white/5 h-[60px]">
                  <div className="text-[10px] font-bold text-gray-500 text-right pr-3 -translate-y-2">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="grid grid-cols-7 h-full">
                    {[0,1,2,3,4,5,6].map(d => (
                      <div key={d} className="border-r border-white/5 h-full opacity-30"></div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Schedules Overlay */}
              <div className="absolute top-0 left-[60px] right-0 bottom-0 grid grid-cols-7 pointer-events-none">
                {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                  const daySchedules = schedules.filter(s => s.dayOfWeek === dayIndex);
                  return (
                    <div key={dayIndex} className="relative h-full border-r border-transparent">
                      {daySchedules.map(schedule => {
                        const style = getBlockStyle(schedule.startTime, schedule.endTime);
                        return (
                          <button
                            key={schedule.id}
                            onClick={() => handleSelectSchedule(schedule)}
                            style={style}
                            className={cn(
                              "rounded-lg p-2 text-left pointer-events-auto transition-all shadow-lg overflow-hidden group border border-white/10",
                              selectedSchedule?.id === schedule.id 
                                ? "bg-gradient-to-br from-red-600 to-red-500 text-white z-20 scale-[1.02] shadow-[0_10px_30px_rgba(125,122,232,0.5)] border-white/30"
                                : "bg-[#12121A]/80 backdrop-blur-md text-gray-300 hover:bg-red-600/20 hover:border-red-600/50 z-10"
                            )}
                          >
                            <div className="text-[10px] font-black tracking-widest uppercase mb-0.5 opacity-80">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            <div className={cn("text-xs font-bold leading-tight truncate", selectedSchedule?.id === schedule.id ? "text-white" : "text-red-400")}>
                              {schedule.title}
                            </div>
                            <div className="text-[10px] truncate opacity-70">{schedule.subtitle}</div>
                            
                            {/* Alunos participantes do horário */}
                            {schedule.participants && schedule.participants.length > 0 && (
                              <div className="mt-1 pt-1 border-t border-white/10 flex items-center gap-1 text-[10px] font-bold text-gray-300 truncate">
                                <Users className="w-3 h-3 text-red-400 shrink-0" />
                                <span className="truncate">
                                  {schedule.participants.map(p => p.name).join(', ')}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
          </div>
        )}
      </div>

      {/* SIDE PANEL: DETAILS */}
      <div className="w-full lg:w-96 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] shrink-0 h-fit lg:h-auto lg:min-h-[600px] relative">
         <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-red-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

        {/* Content based on view mode and selection */}
        {viewMode === 'month' && selectedDate ? (
          <div className="relative z-10 flex flex-col h-full">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-black text-white">
                {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              <p className="text-sm text-red-600 font-bold uppercase tracking-widest mt-1">{selectedEvents.length} eventos</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 styled-scrollbar">
              {selectedEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">Nenhum evento ou aula para este dia.</p>
                </div>
              ) : (
                selectedEvents.map(event => {
                  if (event.type === 'holiday') {
                    return (
                      <div key={event.id} className="bg-amber-950/40 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-lg animate-in fade-in duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 border border-amber-500/30 shrink-0">
                            <PartyPopper className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Feriado Nacional</span>
                            <h4 className="text-base font-black text-white mt-0.5">{event.title}</h4>
                            <p className="text-xs text-amber-200/70 mt-0.5">Sem expediente / data comemorativa oficial</p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={event.id} className="bg-[#12121A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all shadow-lg hover:-translate-y-1 space-y-3">
                      <div>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                          event.type === 'lesson' ? "bg-red-600/20 text-red-400 border border-red-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        )}>
                          {event.type === 'lesson' ? 'Aula Regular' : 'Evento'}
                        </span>
                        <h4 className="text-base font-bold text-white pt-2">{event.title}</h4>
                        {event.subtitle && <p className="text-xs text-gray-400 font-medium">{event.subtitle}</p>}
                      </div>

                      <div className="pt-3 border-t border-white/10 space-y-2 text-xs font-bold text-gray-400">
                        {(event.startTime || event.endTime) && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-500" />
                            <span>{event.startTime} {event.endTime ? `às ${event.endTime}` : ''}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-400" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Lista de Alunos Participantes da Aula */}
                      {event.participants && event.participants.length > 0 && (
                        <div className="pt-3 border-t border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-300">
                            <span className="flex items-center gap-1.5 text-red-400">
                              <Users className="w-3.5 h-3.5" /> Alunos nesta aula:
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {event.participants.length}
                            </span>
                          </div>
                          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 styled-scrollbar">
                            {event.participants.map((p, idx) => (
                              <div key={p.id || idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 text-xs text-white">
                                <div className="w-5 h-5 rounded-full bg-red-600/30 flex items-center justify-center text-[10px] font-bold text-red-300 shrink-0">
                                  {p.name.charAt(0)}
                                </div>
                                <span className="truncate font-medium">{p.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : viewMode === 'week' && selectedSchedule ? (
          <div className="relative z-10 flex flex-col h-full">
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-red-600/20 to-transparent">
              <h3 className="text-xl font-black text-white leading-tight">
                {selectedSchedule.title}
              </h3>
              <p className="text-sm text-red-500 font-bold uppercase tracking-widest mt-2">
                {weekDays[selectedSchedule.dayOfWeek]} • {selectedSchedule.startTime} às {selectedSchedule.endTime}
              </p>
            </div>

            <div className="flex-1 p-6 space-y-6">
              <div className="bg-[#12121A]/80 rounded-2xl p-5 border border-white/5 space-y-4 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Horário</p>
                    <p className="text-sm font-bold text-white mt-1">{selectedSchedule.startTime} - {selectedSchedule.endTime}</p>
                    <p className="text-xs text-gray-400">Toda {weekDays[selectedSchedule.dayOfWeek]}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Local</p>
                    <p className="text-sm font-bold text-white mt-1">{selectedSchedule.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Professor</p>
                    <p className="text-sm font-bold text-white mt-1">{selectedSchedule.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Lista de Alunos Participantes da Aula */}
              <div className="bg-[#12121A]/80 rounded-2xl p-5 border border-white/5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">Alunos Nesta Aula</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                    {selectedSchedule.participants?.length || 0} {selectedSchedule.participants?.length === 1 ? 'aluno' : 'alunos'}
                  </span>
                </div>

                {selectedSchedule.participants && selectedSchedule.participants.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 styled-scrollbar">
                    {selectedSchedule.participants.map((p, pIdx) => (
                      <div key={p.id || pIdx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-300 text-xs font-black shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{p.name}</p>
                          {p.email && <p className="text-[10px] text-gray-500 truncate">{p.email}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic py-2 text-center">
                    Nenhum aluno vinculado a este horário ainda.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 shadow-inner">
              {viewMode === 'month' ? (
                <CalendarIcon className="w-10 h-10 opacity-30 text-red-600" />
              ) : (
                <Grid3X3 className="w-10 h-10 opacity-30 text-red-500" />
              )}
            </div>
            <h3 className="text-xl font-black text-white mb-2">Detalhes</h3>
            <p className="text-sm font-medium">
              {viewMode === 'month' 
                ? 'Selecione um dia no calendário para ver os eventos.'
                : 'Selecione uma turma na grade para ver os detalhes.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
