"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen relative overflow-hidden flex flex-col p-0 lg:p-4 bg-[#0a0a0f] font-sans">
      
      {/* Main Glass Panel Container */}
      <div className="relative z-10 w-full min-h-[100dvh] lg:min-h-0 lg:h-[calc(100vh-2rem)] rounded-none glass-panel flex overflow-hidden border-0 lg:border lg:border-white/10 lg:ring-1 lg:ring-white/5 bg-[#0a0a0f] lg:bg-transparent cyber-clip">
        
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
            "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#050508]/90 backdrop-blur-md border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out shrink-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Sidebar Header */}
          <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0 bg-black/40">
            <Link href="/" className="flex items-center gap-4 group w-full">
              <div className="w-12 h-12 overflow-hidden p-[1px] border border-white/10 group-hover:shadow-[0_0_20px_rgba(162,122,232,0.4)] transition-all cyber-clip">
                <Image src="/logo.jpg" alt="Wakoda Logo" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white uppercase">{portalName}</span>
            </Link>
            <button 
              className="lg:hidden p-2 text-white/50 hover:text-white bg-white/5 rounded-none border border-white/10 ml-auto cyber-clip-btn"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
            <div className="px-4 mb-4 text-[10px] font-black text-gray-500 font-mono tracking-widest uppercase">
              // Módulos do Sistema
            </div>
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3.5 rounded-none text-xs font-black uppercase tracking-widest transition-all duration-300 relative group overflow-hidden cyber-clip-btn",
                    isActive 
                      ? "bg-[#C0E87A] text-black shadow-[0_0_15px_rgba(192,232,122,0.3)] border-l-4 border-black" 
                      : "text-white/60 hover:text-white hover:bg-white/5 border-l-4 border-transparent hover:border-[#A27AE8]"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {/* Icon & Label */}
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={cn(
                      "transition-transform group-hover:scale-110",
                      isActive ? "text-black" : "text-white/40 group-hover:text-[#A27AE8]"
                    )}>
                      {link.icon}
                    </div>
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer (User Info & Logout) */}
          <div className="p-6 border-t border-[#A27AE8]/30 bg-black/60 relative">
            <div className="absolute top-0 right-0 p-1 border-b border-l border-[#A27AE8]/30 bg-[#A27AE8]/10 text-[8px] font-black font-mono text-[#A27AE8] tracking-widest">
              ACTIVE_USER
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-1">Operador Logado</p>
                <p className="font-black text-white text-sm uppercase truncate max-w-[160px]">{userName}</p>
              </div>
            </div>
            <form action="/auth/signout" method="post" className="w-full">
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-none text-xs font-black uppercase tracking-widest text-[#A27AE8] hover:text-black hover:bg-[#A27AE8] border border-[#A27AE8] transition-all shadow-[0_0_15px_rgba(162,122,232,0)] hover:shadow-[0_0_20px_rgba(162,122,232,0.4)] cyber-clip-btn"
              >
                <LogOut className="w-4 h-4" />
                Desconectar
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Header */}
          <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 shrink-0 bg-black/80 backdrop-blur-lg sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-white/60 hover:text-white bg-white/5 border border-white/10 cyber-clip-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Header Title / Breadcrumb Placeholder */}
              <div className="hidden lg:block">
                <div className="flex items-center gap-2 text-xs font-mono font-black text-white/40 uppercase tracking-widest">
                  <span className="text-[#C0E87A] animate-pulse">●</span> SYS.ONLINE
                </div>
              </div>
            </div>
            
            <div className="flex-1"></div>

            {/* Header Actions (e.g. Notifications) */}
            <div className="flex items-center gap-4">
              {headerActions}
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10 scroll-smooth">
            {/* Overlay grid specific to content area for depth */}
            <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>
            
            <div className="max-w-[1400px] mx-auto relative z-10">
              {children}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
