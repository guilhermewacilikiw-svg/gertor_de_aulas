import Link from 'next/link';
import { Home, Calendar, PlayCircle, BookOpen, User, LineChart, DollarSign } from 'lucide-react';
import { NotificationBell } from '@/components/ui/notification-bell';

export function AlunoSidebar() {
  return (
    <aside className="w-64 bg-sidebar-background text-sidebar-foreground flex flex-col h-full border-r border-sidebar-background/20 relative">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center font-bold text-xl">
            W
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Wackoda</h1>
            <span className="text-[10px] text-primary-foreground/70 uppercase tracking-wider">Experience</span>
          </div>
        </div>
        <NotificationBell />
      </div>

      <div className="px-6 pb-4">
        <h2 className="text-xl font-bold mt-2">Olá, João!</h2>
        <p className="text-sm text-sidebar-foreground/70">Continue sua jornada musical.</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto mt-4">
        <Link href="/aluno/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20">
          <Home className="w-5 h-5" />
          <span>Início</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-white transition-colors">
          <Calendar className="w-5 h-5" />
          <span>Cronograma</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-white transition-colors">
          <PlayCircle className="w-5 h-5" />
          <span>Minhas aulas</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-white transition-colors">
          <BookOpen className="w-5 h-5" />
          <span>Materiais</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-white transition-colors">
          <LineChart className="w-5 h-5" />
          <span>Progresso</span>
        </Link>
        <Link href="/aluno/financeiro" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-white transition-colors">
          <DollarSign className="w-5 h-5" />
          <span>Financeiro</span>
        </Link>
        <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-white/5 hover:text-white transition-colors mt-auto">
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </Link>
      </nav>
      
      {/* Mini Progress Card in Sidebar matching mobile view */}
      <div className="p-4 mb-4">
        <div className="bg-white/5 rounded-2xl p-5 backdrop-blur-sm border border-white/10">
           <h3 className="text-sm font-semibold mb-3">Seu progresso</h3>
           <div className="w-full bg-sidebar-background/50 rounded-full h-2 mb-2 border border-white/5">
             <div className="bg-gradient-brand h-2 rounded-full" style={{ width: '82%' }}></div>
           </div>
           <div className="flex items-center justify-between text-xs font-medium">
             <span className="text-sidebar-foreground/70">18 aulas realizadas</span>
             <span className="text-white font-bold">82%</span>
           </div>
        </div>
      </div>
    </aside>
  );
}
