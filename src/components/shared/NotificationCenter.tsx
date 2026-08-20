'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Sparkles, BookOpen, Clock, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { NotificationItem } from '@/types/database';

export function NotificationCenter({ userId, schoolId }: { userId?: string; schoolId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadNotifications() {
      const supabase = createClient();
      
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (schoolId) {
        query = query.eq('school_id', schoolId);
      }

      const { data } = await query;

      const fallbackNotifications: NotificationItem[] = [
        {
          id: 'n1',
          school_id: schoolId || '11111111-1111-1111-1111-111111111111',
          user_id: userId || 'user1',
          type: 'lesson_completed',
          title: 'Nova Aula Concluída! 🎸',
          message: 'O resumo e as orientações da aula de Violão A já estão no seu painel.',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'n2',
          school_id: schoolId || '11111111-1111-1111-1111-111111111111',
          user_id: userId || 'user1',
          type: 'announcement',
          title: 'Comunicado da Escola 📢',
          message: 'Lembrete: Apresentação de alunos no próximo fim de semana.',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      const list = (data && data.length > 0) ? data : fallbackNotifications;
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.read_at).length);
    }

    loadNotifications();
  }, [userId, schoolId]);

  const markAllAsRead = async () => {
    const supabase = createClient();
    const now = new Date().toISOString();

    setNotifications(prev => prev.map(n => ({ ...n, read_at: now })));
    setUnreadCount(0);

    if (userId) {
      await supabase
        .from('notifications')
        .update({ read_at: now })
        .eq('user_id', userId);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95"
        aria-label="Central de Notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-neutral-900 border border-slate-800 p-4 shadow-2xl z-50 text-white space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-extrabold text-sm text-white">Notificações</h3>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Marcar lidas
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Nenhuma notificação por enquanto.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    !n.read_at ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {new Date(n.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-snug">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
