'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit, Trash, Lock, MoreVertical } from 'lucide-react';

interface ActionMenuProps {
  itemId: string;
  type?: 'horizontal' | 'vertical';
  onEdit?: () => void;
  onDelete?: () => void;
  onResetPassword?: () => void;
}

export function ActionMenu({ itemId, type = 'horizontal', onEdit, onDelete, onResetPassword }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none"
      >
        {type === 'horizontal' ? (
          <MoreHorizontal className="w-5 h-5" />
        ) : (
          <MoreVertical className="w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-neutral-900 ring-1 ring-black ring-opacity-5 z-50 border border-neutral-800 animate-in fade-in zoom-in duration-150">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => { setIsOpen(false); onEdit?.(); alert('A funcionalidade de Edição será implementada em breve!'); }}
              className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4" /> Editar Perfil
            </button>
            <button
              onClick={() => { setIsOpen(false); onResetPassword?.(); alert('Redefinição de senha será implementada em breve!'); }}
              className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Lock className="w-4 h-4" /> Redefinir Senha
            </button>
            <div className="border-t border-neutral-800 my-1"></div>
            <button
              onClick={() => { setIsOpen(false); onDelete?.(); alert('A funcionalidade de Remover Usuário será implementada em breve!'); }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors"
            >
              <Trash className="w-4 h-4" /> Remover Acesso
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
