'use client';

import { useState } from 'react';
import { Bot, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { askStudentAIAssistant } from '@/lib/ai/ai-service';

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export function StudentAIAssistantWidget({ studentName = 'João', schoolId = '11111111-1111-1111-1111-111111111111' }) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: `Olá, ${studentName}! Sou seu assistente de estudos Wackoda AI. Como posso te ajudar com a sua aula de hoje?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const responseText = await askStudentAIAssistant(schoolId, studentName, userText);
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Desculpe, ocorreu um erro ao consultar o assistente de IA.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              Wackoda AI <Sparkles className="w-3 h-3 text-cyan-400" />
            </h3>
            <p className="text-[10px] text-gray-400">Assistente de Aprendizagem Isolado por Tenant</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Online
        </span>
      </div>

      {/* Chat Messages */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                m.sender === 'user'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                m.sender === 'user'
                  ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-100 rounded-tr-none'
                  : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>AI analisando sua dúvida...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre pestanas, ritmos, exercícios..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
