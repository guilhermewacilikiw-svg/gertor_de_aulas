'use client';

import { useState } from 'react';
import { Sparkles, Send, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { createTrialLead } from '@/lib/db/actions';

export function LeadCaptureForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: 'Noite (18h às 21h)',
    courseInterest: 'Violão / Guitarra'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTrialLead({
        schoolId: '11111111-1111-1111-1111-111111111111', // Escola Harmonia
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: `Horário: ${formData.preferredTime} | Curso: ${formData.courseInterest}`
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredTime: 'Noite (18h às 21h)',
        courseInterest: 'Violão / Guitarra'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#12121A] to-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#7D7AE8]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C0E87A]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>

      {/* Header */}
      <div className="text-center space-y-4 relative z-10">
        <div className="w-16 h-16 bg-[#1A1A24] rounded-2xl border border-white/5 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(125,122,232,0.15)] mb-6">
          <Sparkles className="w-8 h-8 text-[#E5E87A]" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tight drop-shadow-sm">
          Agende sua Imersão
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto leading-relaxed font-medium">
          Experimente a metodologia híbrida (presencial + digital) da Wakoda de forma gratuita. Sujeito à disponibilidade de vagas.
        </p>
      </div>

      {success && (
        <div className="relative z-10 p-5 rounded-2xl bg-[#C0E87A]/10 border border-[#C0E87A]/30 text-[#C0E87A] text-sm font-bold text-center flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(192,232,122,0.1)]">
          <CheckCircle2 className="w-6 h-6" />
          <span>Vaga pré-agendada com sucesso! Logo entraremos em contato.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Seu Nome Completo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Gabriel Santos"
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">E-mail Principal</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="seu.melhor@email.com"
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">WhatsApp</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(11) 99999-9999"
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Curso Desejado</label>
            <select
              value={formData.courseInterest}
              onChange={(e) => setFormData(prev => ({ ...prev, courseInterest: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all appearance-none"
            >
              <option value="Violão / Guitarra">Violão / Guitarra</option>
              <option value="Piano / Teclado">Piano / Teclado</option>
              <option value="Canto & Técnica Vocal">Canto & Técnica Vocal</option>
              <option value="Dança & Expressão">Dança & Expressão</option>
              <option value="Idiomas & Conversação">Idiomas & Conversação</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Disponibilidade</label>
            <select
              value={formData.preferredTime}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#7D7AE8] focus:ring-1 focus:ring-[#7D7AE8] transition-all appearance-none"
            >
              <option value="Manhã (8h às 12h)">Manhã (8h às 12h)</option>
              <option value="Tarde (13h às 17h)">Tarde (13h às 17h)</option>
              <option value="Noite (18h às 21h)">Noite (18h às 21h)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-[#7D7AE8] to-[#A27AE8] text-white font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-3 mt-4 shadow-[0_10px_30px_rgba(125,122,232,0.3)] hover:shadow-[0_15px_40px_rgba(125,122,232,0.5)] hover:-translate-y-1"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <span>Confirmar Agendamento</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

    </div>
  );
}
