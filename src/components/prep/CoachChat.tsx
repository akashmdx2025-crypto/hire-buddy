// source_handbook: week11-hackathon-preparation

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Bot, User, Bookmark, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  warning?: string;
}

export default function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "SESSION_INITIALIZED: JD_LANDSCAPE_MAPPED. AWATING_INPUT_DATA."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        sources: data.sources,
        warning: data.groundingWarning
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      toast.error("COMM_FAILURE: LINK_LOST.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-12 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffffff05_2px,#ffffff05_4px)]">
      <div className="flex items-center justify-between mb-12 border-b-4 border-foreground pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center border-4 border-foreground brutal-shadow-white">
            <Bot className="w-10 h-10 stroke-[3px]" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">COACH_ARCHIVE // ALPHA</h2>
            <div className="flex items-center gap-3 mt-2">
               <div className="w-3 h-3 bg-primary animate-pulse border-2 border-foreground" />
               <p className="text-xs text-primary uppercase font-black tracking-widest">[ SECURE_LINK: ACTIVE ]</p>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-8 pr-6 space-y-10"
      >
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-12 h-12 flex items-center justify-center mt-1 shrink-0 border-4 border-foreground brutal-shadow ${
                m.role === 'assistant' ? 'bg-background text-primary' : 'bg-accent text-accent-foreground'
              }`}>
                {m.role === 'assistant' ? <Bot className="w-6 h-6 stroke-[3px]" /> : <User className="w-6 h-6 stroke-[3px]" />}
              </div>
              
              <div className={`space-y-4 max-w-[80%] ${m.role === 'user' ? 'text-right' : ''}`}>
                <div className={`p-8 border-4 border-foreground text-sm font-black uppercase italic leading-tight ${
                  m.role === 'assistant' ? 'bg-background text-foreground' : 'bg-primary text-primary-foreground brutal-shadow-white'
                }`}>
                  {m.content}
                </div>
                
                {m.warning && (
                  <div className="flex items-center gap-3 text-[10px] text-background bg-accent px-4 py-2 border-2 border-foreground w-fit font-black uppercase">
                    <AlertCircle className="w-4 h-4 stroke-[3px]" />
                    <span>SYSTEM_WARNING: {m.warning}</span>
                  </div>
                )}

                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-end">
                    {m.sources.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] text-foreground bg-background px-3 py-1.5 border-2 border-foreground font-black uppercase italic">
                        <Bookmark className="w-3 h-3 text-primary" />
                        <span>REF_SEGMENT_{i + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-background border-4 border-foreground text-primary flex items-center justify-center mt-1">
              <Bot className="w-6 h-6 stroke-[3px]" />
            </div>
            <div className="p-6 border-4 border-foreground bg-primary/10 h-16 w-28 flex items-center justify-center brutal-shadow">
              <div className="flex gap-2">
                <motion.div animate={{ scale: [1, 1.5, 1], rotate: 45 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 bg-primary" />
                <motion.div animate={{ scale: [1, 1.5, 1], rotate: -45 }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2 h-2 bg-primary" />
                <motion.div animate={{ scale: [1, 1.5, 1], rotate: 45 }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-2 h-2 bg-primary" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="TRANSMIT_DATA_STREAM..."
          className="w-full bg-background border-4 border-foreground p-6 pr-24 text-lg font-black uppercase italic focus:outline-none focus:bg-primary/5 transition-all resize-none min-h-[100px] brutal-shadow focus:translate-x-[-4px] focus:translate-y-[-4px] focus:shadow-[12px_12px_0px_0px_var(--color-primary)]"
        />
        <Button 
          size="icon" 
          className="absolute right-6 bottom-6 h-12 w-12 bg-primary text-primary-foreground border-4 border-foreground hover:bg-accent transition-all brutal-shadow-white group-hover:scale-110"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <Send className="w-6 h-6 stroke-[3px]" />
        </Button>
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-6">
        <div className="h-1 flex-1 bg-foreground" />
        <p className="text-xs text-foreground uppercase font-black italic tracking-[0.4em] flex items-center gap-3">
          [ UPLINK_STABLE ]
        </p>
        <div className="h-1 flex-1 bg-foreground" />
      </div>
    </div>
  );
}
