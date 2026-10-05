"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BetaNoticeModal } from '@/components/shared/BetaNoticeModal';

export interface DashboardLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  portalName: string;
  userName: string;
  links: DashboardLink[];
  headerActions?: React.ReactNode; // e.g. NotificationCenter
}

export function DashboardLayout({ children, portalName, userName, links, headerActions }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#050505] font-sans">
      <BetaNoticeModal />
      
      {/* Main Glass Panel Container */}
      <div className="relative z-10 w-full min-h-[100dvh] lg:min-h-0 lg:h-screen flex overflow-hidden bg-[#0a0a0a]">
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#060606]/95 backdrop-blur-md border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out shrink-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Sidebar Header */}
          <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0 bg-black/40">
            <Link href="/" className="flex items-center gap-3.5 group w-full">
              <div className="w-12 h-12 rounded-xl overflow-hidden p-0.5 border border-white/10 group-hover:border-red-500/50 transition-all shadow-md">
                <Image src="/logo-rock.jpg" alt="Wakoda Logo" width={48} height={48} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white block leading-tight">Wakoda</span>
                <span className="text-xs font-semibold text-red-400 block">{portalName}</span>
              </div>
            </Link>
            <button 
              className="lg:hidden p-2 text-white/70 hover:text-white bg-white/5 rounded-lg border border-white/10 ml-auto"
              aria-label="Fechar menu"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
            <div className="px-3 mb-3 text-xs font-semibold text-gray-400">
              Módulos
            </div>
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 relative group",
                    isActive 
                      ? "bg-red-600 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={cn(
                                        isActive ? "text-white" : "text-gray-400 group-hover:text-red-500"
                  )}>
                    {link.icon}
                  </div>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer (User Info & Logout) */}
          <div className="p-5 border-t border-white/10 bg-black/50 relative">
            <div className="flex items-center justify-between mb-3.5">
              <div className="overflow-hidden">
                <p className="text-gray-400 text-xs mb-0.5">Conectado como</p>
                <p className="font-semibold text-white text-sm truncate max-w-[170px]">{userName}</p>
              </div>
            </div>
            <form action="/auth/signout" method="post" className="w-full">
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-600 border border-red-500/30 hover:border-red-600 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair da Conta
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Header */}
          <header className="h-16 lg:h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/10 shrink-0 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-white/70 hover:text-white bg-white/5 rounded-lg border border-white/10"
                aria-label="Abrir menu"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1"></div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {headerActions}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10 scroll-smooth">
            <div className="max-w-[1400px] mx-auto relative z-10">
              {children}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
