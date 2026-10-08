'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Grid3X3, List, Users, PartyPopper } from 'lucide-react';
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
  const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

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

  const tituloMes = `${monthNames[month]} ${year}`;
  const diasComAulas = [0, 1, 2, 3, 4, 5, 6].filter(d => schedules.some(s => s.dayOfWeek === d));

  const detalhesEvento = (event: CalendarEvent) => {
    if (event.type === 'holiday') {
      return (
        <li key={event.id} className="py-3">
          <p className="text-xs text-yellow-300">Feriado nacional</p>
          <p className="text-sm text-white mt-0.5 flex items-center gap-2">
            <PartyPopper className="w-4 h-4 text-yellow-300 shrink-0" aria-hidden="true" />
            {event.title}
          </p>
        </li>
      );
    }
    return (
      <li key={event.id} className="py-3 space-y-2">
        <div>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-md",
            event.type === 'lesson' ? "bg-red-600/15 text-red-300" : "bg-blue-500/15 text-blue-300"
          )}>
            {event.type === 'lesson' ? 'Aula regular' : 'Evento'}
          </span>
          <p className="text-sm text-white mt-2">{event.title}</p>
          {event.subtitle && <p className="text-sm text-gray-400">{event.subtitle}</p>}
        </div>
        <div className="text-sm text-gray-400 space-y-1">
          {(event.startTime || event.endTime) && (
            <p className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" aria-hidden="true" />{event.startTime}{event.endTime ? ` às ${event.endTime}` : ''}</p>
          )}
          {event.location && (
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />{event.location}</p>
          )}
        </div>
        {event.participants && event.participants.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 flex items-center gap-2"><Users className="w-4 h-4" aria-hidden="true" />Alunos nesta aula ({event.participants.length})</p>
            <ul className="mt-1 max-h-32 overflow-y-auto text-sm text-white space-y-0.5">
              {event.participants.map((p, idx) => <li key={p.id || idx} className="truncate">{p.name}</li>)}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-in fade-in duration-500">

      {/* ÁREA PRINCIPAL DO CALENDÁRIO */}
      <div className="flex-1 min-w-0 rounded-xl border border-white/10 overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {viewMode === 'month' ? tituloMes : 'Grade semanal'}
            </h2>
            <p className="text-sm text-gray-400">
              {viewMode === 'month' ? 'Aulas e eventos do mês' : 'Horários que se repetem toda semana'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 rounded-lg bg-white/[0.04]" role="group" aria-label="Modo de visualização">
              <button
                onClick={() => setViewMode('week')}
                aria-pressed={viewMode === 'week'}
                className={cn("inline-flex items-center gap-2 px-3 min-h-9 rounded-md text-sm transition-colors", viewMode === 'week' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white")}
              >
                <Grid3X3 className="w-4 h-4" aria-hidden="true" /> Semana
              </button>
              <button
                onClick={() => setViewMode('month')}
                aria-pressed={viewMode === 'month'}
                className={cn("inline-flex items-center gap-2 px-3 min-h-9 rounded-md text-sm transition-colors", viewMode === 'month' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white")}
              >
                <List className="w-4 h-4" aria-hidden="true" /> Mês
              </button>
            </div>

            {viewMode === 'month' && (
              <div className="inline-flex items-center gap-1">
                <button onClick={today} className="px-3 min-h-11 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors">Hoje</button>
                <button onClick={prevMonth} aria-label="Mês anterior" className="min-h-11 min-w-11 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={nextMonth} aria-label="Próximo mês" className="min-h-11 min-w-11 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </div>
        </div>

        {/* VISÃO MENSAL */}
        {viewMode === 'month' && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="grid grid-cols-7 border-b border-white/10 sticky top-0 bg-[#0a0a0f] z-20">
              {weekDays.map(day => (
                <div key={day} className="py-3 text-center text-sm text-gray-400">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 min-h-min">
              {days.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} className="min-h-[72px] md:min-h-[100px] border-r border-b border-white/5" />;

                const dayEvents = getEventsForDate(date);

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectDate(date)}
                    aria-label={`${date.getDate()} de ${monthNames[month]}, ${dayEvents.length} ${dayEvents.length === 1 ? 'item' : 'itens'}`}
                    className={cn(
                      "min-h-[72px] md:min-h-[100px] border-r border-b border-white/5 p-1.5 md:p-2 flex flex-col items-start gap-1 transition-colors hover:bg-white/[0.04] text-left",
                      isSelected(date) && "bg-red-600/10"
                    )}
                  >
                    <span className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0",
                      isToday(date) ? "bg-red-600 text-white font-medium" : "text-gray-300"
                    )}>
                      {date.getDate()}
                    </span>

                    <div className="w-full flex-1 overflow-hidden space-y-1 hidden sm:block">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <div key={idx} className={cn(
                          "text-xs px-1.5 py-0.5 rounded truncate flex items-center gap-1",
                          e.type === 'holiday'
                            ? "bg-yellow-500/15 text-yellow-300"
                            : e.type === 'lesson'
                            ? "bg-red-600/15 text-red-300"
                            : "bg-blue-500/15 text-blue-300"
                        )}>
                          {e.type !== 'holiday' && e.startTime && <span className="shrink-0">{e.startTime}</span>}
                          <span className="truncate">{e.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-400 pl-1">+ {dayEvents.length - 3} mais</div>
                      )}
                    </div>

                    <div className="sm:hidden flex flex-wrap gap-1 mt-auto pb-1">
                      {dayEvents.map((e, idx) => (
                        <span
                          key={idx}
                          className={cn("w-1.5 h-1.5 rounded-full", e.type === 'holiday' ? "bg-yellow-400" : e.type === 'lesson' ? "bg-red-500" : "bg-blue-400")}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* VISÃO SEMANAL */}
        {viewMode === 'week' && (
          <>
            {/* Celular: lista por dia da semana */}
            <div className="md:hidden">
              {diasComAulas.length === 0 ? (
                <p className="p-6 text-sm text-gray-400 text-center">Nenhum horário cadastrado ainda.</p>
              ) : (
                <ul className="divide-y divide-white/5">
                  {diasComAulas.map(dayIndex => (
                    <li key={dayIndex} className="p-4">
                      <p className="text-sm text-gray-400 mb-2">{dayNames[dayIndex]}</p>
                      <ul className="space-y-2">
                        {schedules
                          .filter(s => s.dayOfWeek === dayIndex)
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map(schedule => (
                            <li key={schedule.id}>
                              <button
                                onClick={() => handleSelectSchedule(schedule)}
                                aria-pressed={selectedSchedule?.id === schedule.id}
                                className={cn(
                                  "w-full text-left rounded-lg px-3 py-2 min-h-11 border transition-colors",
                                  selectedSchedule?.id === schedule.id ? "border-red-500 bg-red-600/10" : "border-white/10 hover:bg-white/[0.04]"
                                )}
                              >
                                <span className="text-sm text-white block truncate">{schedule.title}</span>
                                <span className="text-sm text-gray-400 block truncate">
                                  {schedule.startTime} às {schedule.endTime}{schedule.subtitle ? ` · ${schedule.subtitle}` : ''}
                                </span>
                              </button>
                            </li>
                          ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Tablet e computador: grade por horário */}
            <div className="hidden md:block flex-1 overflow-auto max-h-[800px]">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/10 sticky top-0 bg-[#0a0a0f] z-30">
                  <div className="py-3 border-r border-white/5"></div>
                  {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-sm text-gray-400 border-r border-white/5">{day}</div>
                  ))}
                </div>

                <div className="relative">
                  {hours.map(hour => (
                    <div key={hour} className="grid grid-cols-[60px_1fr] border-b border-white/5 h-[60px]">
                      <div className="text-xs text-gray-400 text-right pr-3 -translate-y-2">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      <div className="grid grid-cols-7 h-full">
                        {[0, 1, 2, 3, 4, 5, 6].map(d => (
                          <div key={d} className="border-r border-white/5 h-full"></div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="absolute top-0 left-[60px] right-0 bottom-0 grid grid-cols-7 pointer-events-none">
                    {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
                      <div key={dayIndex} className="relative h-full">
                        {schedules.filter(s => s.dayOfWeek === dayIndex).map(schedule => (
                          <button
                            key={schedule.id}
                            onClick={() => handleSelectSchedule(schedule)}
                            style={getBlockStyle(schedule.startTime, schedule.endTime)}
                            aria-pressed={selectedSchedule?.id === schedule.id}
                            className={cn(
                              "rounded-md p-2 text-left pointer-events-auto overflow-hidden border transition-colors",
                              selectedSchedule?.id === schedule.id
                                ? "bg-red-600 border-red-500 text-white z-20"
                                : "bg-[#1a1a22] border-white/10 text-gray-300 hover:border-red-500/60 z-10"
                            )}
                          >
                            <span className="block text-xs opacity-80">{schedule.startTime} - {schedule.endTime}</span>
                            <span className="block text-xs leading-tight truncate text-white">{schedule.title}</span>
                            {schedule.subtitle && <span className="block text-xs truncate opacity-70">{schedule.subtitle}</span>}
                            {schedule.participants && schedule.participants.length > 0 && (
                              <span className="mt-1 flex items-center gap-1 text-xs truncate opacity-80">
                                <Users className="w-3 h-3 shrink-0" aria-hidden="true" />
                                <span className="truncate">{schedule.participants.map(p => p.name).join(', ')}</span>
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PAINEL DE DETALHES */}
      <aside className="w-full xl:w-96 shrink-0 rounded-xl border border-white/10 overflow-hidden h-fit xl:min-h-[400px]" aria-live="polite">
        {viewMode === 'month' && selectedDate ? (
          <div>
            <div className="p-4 sm:p-5 border-b border-white/10">
              <h3 className="text-base font-medium text-white first-letter:uppercase">
                {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{selectedEvents.length} {selectedEvents.length === 1 ? 'item' : 'itens'}</p>
            </div>
            {selectedEvents.length === 0 ? (
              <p className="p-6 text-sm text-gray-400 text-center">Nada marcado para este dia.</p>
            ) : (
              <ul className="px-4 sm:px-5 divide-y divide-white/5">
                {selectedEvents.map(detalhesEvento)}
              </ul>
            )}
          </div>
        ) : viewMode === 'week' && selectedSchedule ? (
          <div>
            <div className="p-4 sm:p-5 border-b border-white/10">
              <h3 className="text-base font-medium text-white">{selectedSchedule.title}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {dayNames[selectedSchedule.dayOfWeek]}, {selectedSchedule.startTime} às {selectedSchedule.endTime}
              </p>
            </div>
            <dl className="px-4 sm:px-5 divide-y divide-white/5 text-sm">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-gray-400 flex items-center gap-2"><Clock className="w-4 h-4" aria-hidden="true" />Horário</dt>
                <dd className="text-white text-right">{selectedSchedule.startTime} - {selectedSchedule.endTime}<span className="block text-gray-400">Toda {dayNames[selectedSchedule.dayOfWeek].toLowerCase()}</span></dd>
              </div>
              {selectedSchedule.location && (
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4" aria-hidden="true" />Local</dt>
                  <dd className="text-white text-right">{selectedSchedule.location}</dd>
                </div>
              )}
              {selectedSchedule.subtitle && (
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-gray-400 flex items-center gap-2"><Users className="w-4 h-4" aria-hidden="true" />Professor</dt>
                  <dd className="text-white text-right">{selectedSchedule.subtitle}</dd>
                </div>
              )}
            </dl>
            <div className="p-4 sm:p-5 border-t border-white/10">
              <p className="text-sm text-gray-400">
                Alunos nesta aula ({selectedSchedule.participants?.length || 0})
              </p>
              {selectedSchedule.participants && selectedSchedule.participants.length > 0 ? (
                <ul className="mt-2 max-h-48 overflow-y-auto space-y-2">
                  {selectedSchedule.participants.map((p, pIdx) => (
                    <li key={p.id || pIdx} className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-red-600/20 text-red-300 flex items-center justify-center text-xs shrink-0">{p.name.charAt(0).toUpperCase()}</span>
                      <span className="min-w-0">
                        <span className="block text-sm text-white truncate">{p.name}</span>
                        {p.email && <span className="block text-sm text-gray-400 truncate">{p.email}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-400">Nenhum aluno vinculado a este horário ainda.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 text-gray-400 min-h-[200px]">
            <CalendarIcon className="w-8 h-8 mb-3 opacity-50" aria-hidden="true" />
            <p className="text-sm">
              {viewMode === 'month'
                ? 'Toque em um dia para ver as aulas e eventos.'
                : 'Toque em uma turma para ver os detalhes.'}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
