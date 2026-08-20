'use client';

import { useState } from 'react';
import { Plus, X, Loader2, BookOpen, AlignLeft } from 'lucide-react';
import { createCourseAction } from './actions';
import confetti from 'canvas-confetti';

export function CreateCourseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await createCourseAction(formData);
    
    if (res.success) {
      setIsOpen(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setError(res.error || 'Erro desconhecido');
    }
    
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        Novo Curso
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl">Novo Curso</h3>
                <p className="text-sm text-muted-foreground">Cadastre um novo curso para a grade curricular da escola.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground ml-1">Nome do Curso</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-muted/30 border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    placeholder="Ex: Inglês Intermediário"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground ml-1">Descrição</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <textarea
                    name="description"
                    className="w-full bg-muted/30 border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow min-h-[100px] resize-none"
                    placeholder="Descrição opcional..."
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-muted/80 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-brand text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
