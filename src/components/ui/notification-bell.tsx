'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Check, Gift } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:bg-white/10 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-background flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-card border shadow-xl rounded-2xl z-50 overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
              <h3 className="font-bold">Notificações</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Ler todas
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Nenhuma notificação nova.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer flex gap-3 ${!notif.is_read ? 'bg-primary/5' : ''}`}
                      onClick={() => {
                         if (!notif.is_read) markAsRead(notif.id);
                      }}
                    >
                      <div className="shrink-0 mt-1">
                        {notif.type === 'lesson_completed' ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : notif.type === 'achievement' ? (
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                            <Gift className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Bell className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                         {notif.link ? (
                            <Link href={notif.link} className="block" onClick={() => setIsOpen(false)}>
                               <p className={`text-sm ${!notif.is_read ? 'font-bold' : 'font-medium'} truncate`}>{notif.title}</p>
                            </Link>
                         ) : (
                            <p className={`text-sm ${!notif.is_read ? 'font-bold' : 'font-medium'} truncate`}>{notif.title}</p>
                         )}
                         <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.content}</p>
                         <p className="text-[10px] text-muted-foreground/60 mt-2">
                           {new Date(notif.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </div>
                      {!notif.is_read && (
                         <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-3 border-t bg-muted/10 text-center">
               <button className="text-xs text-muted-foreground font-medium hover:text-foreground">Ver histórico</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
