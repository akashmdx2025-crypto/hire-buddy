// source_handbook: week11-hackathon-preparation

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, EvaluationResult } from '@/lib/types.ts';
import { Loader2, Plus, ArrowRight, BrainCircuit, Star, BarChart4, MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import AnswerEvaluator from './AnswerEvaluator';
import { toast } from 'sonner';

export default function QuestionPanel() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState('mid');
  const [category, setCategory] = useState('');

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, count: 5 })
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      toast.error("Failed to generate questions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b-4 border-foreground pb-12 gap-8">
        <div>
          <span className="text-xs font-black uppercase text-primary mb-4 block underline decoration-2 underline-offset-4">Protocol Synthesis</span>
          <h2 className="text-6xl font-black uppercase italic tracking-tighter">Diagnostic Matrix</h2>
          <div className="flex items-center gap-4 mt-6">
            <div className="px-3 py-1 bg-accent text-accent-foreground border-2 border-foreground text-[10px] font-black uppercase">STATUS: EXTRAPOLATING</div>
            <p className="text-xs font-black uppercase italic opacity-40">Mapping {questions.length} semantic vectors.</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative group">
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="appearance-none bg-background border-4 border-foreground text-xs font-black uppercase tracking-widest pl-6 pr-12 py-4 outline-none focus:bg-primary focus:text-primary-foreground transition-all cursor-pointer brutal-shadow"
            >
              <option value="entry">NODE: JUNIOR</option>
              <option value="mid">NODE: PROFESSIONAL</option>
              <option value="senior">NODE: STRATEGIC</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-125 transition-transform">
              <BarChart4 className="w-5 h-5" />
            </div>
          </div>
          <Button 
            className="brutal-btn bg-primary text-primary-foreground h-[60px] px-10 text-sm italic" 
            onClick={generateQuestions} 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 mr-1 stroke-[4px]" />}
            RE_SYNC
          </Button>
        </div>
      </div>

      <div className="space-y-6 pb-32">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-muted/50 border-4 border-foreground animate-pulse" />
          ))
        ) : (
          questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background border-4 border-foreground p-10 flex flex-col md:flex-row gap-10 relative group hover:bg-primary/5 transition-all brutal-shadow hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_var(--color-primary)] cursor-pointer"
              onClick={() => setSelectedQuestion(q)}
            >
              <div className="flex flex-col min-w-[120px]">
                <div className="w-20 h-20 border-4 border-foreground flex items-center justify-center bg-background group-hover:bg-primary transition-colors">
                  <span className="text-4xl font-black italic tracking-tighter group-hover:text-primary-foreground">0{i + 1}</span>
                </div>
                <span className="text-[10px] font-black uppercase mt-6 text-primary tracking-[0.2em]">{q.category}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-black leading-none mb-10 uppercase italic tracking-tighter">
                  {q.question}
                </h3>
                
                <div className="flex flex-wrap gap-10 items-center">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase opacity-30 mb-2 underline">Focus Parameter</span>
                      <span className="text-sm font-black uppercase italic">{q.targetedRequirement}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase opacity-30 mb-2 underline">Complexity Index</span>
                      <span className="text-sm font-black uppercase italic text-primary">{q.difficulty}</span>
                   </div>
                </div>
              </div>

              <div className="md:self-center">
                <button 
                  className="brutal-btn bg-foreground text-background group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <span className="flex items-center gap-3">
                    INITIATE_TRIAL
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[4px]" />
                  </span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedQuestion && (
          <AnswerEvaluator 
            question={selectedQuestion} 
            onClose={() => setSelectedQuestion(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
