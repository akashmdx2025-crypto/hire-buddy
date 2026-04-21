// source_handbook: week11-hackathon-preparation

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Question, EvaluationResult } from '../../lib/types';
import { Button } from '@/components/ui/button';
import { X, Send, Loader2, Trophy, AlertTriangle, CheckCircle2, ChevronDown, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface AnswerEvaluatorProps {
  question: Question;
  onClose: () => void;
}

export default function AnswerEvaluator({ question, onClose }: AnswerEvaluatorProps) {
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEvaluate = async () => {
    if (answer.trim().length < 20) {
      toast.error("Please provide a more detailed answer (min 20 chars).");
      return;
    }

    setIsEvaluating(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: question.question, 
          answer,
          category: question.category
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      toast.error("Evaluation failed. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const reset = () => {
    setResult(null);
    setAnswer('');
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-card/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Answer Evaluation</h3>
              <p className="text-xs text-muted-foreground font-mono">{question.category.toUpperCase()} • {formatTime(timer)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black mb-4 leading-tight">"{question.question}"</h2>
            <div className="flex items-center gap-3 text-sm text-primary font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Target: {question.targetedRequirement}</span>
            </div>
          </div>

          {!result ? (
            <div className="space-y-6">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Structure your answer using the STAR method if behavioral, or explain your logic if technical..."
                className="w-full min-h-[300px] bg-black/20 border border-white/10 rounded-2xl p-8 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg leading-relaxed"
              />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" className="rounded-xl h-12 px-6" onClick={onClose}>Cancel</Button>
                <Button className="rounded-xl h-12 px-8 font-bold" onClick={handleEvaluate} disabled={isEvaluating}>
                  {isEvaluating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                  Evaluate Answer
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ScoreCard title="Relevance" score={result.breakdown.relevance.score} delay={0.1} />
                <ScoreCard title="Depth" score={result.breakdown.depth.score} delay={0.2} />
                <ScoreCard title="Structure" score={result.breakdown.structure.score} delay={0.3} />
                <ScoreCard title="Comm." score={result.breakdown.communication.score} delay={0.4} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h4 className="text-sm font-mono text-primary uppercase font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-sm bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex gap-3 text-emerald-200">
                        <span className="shrink-0 text-emerald-500">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="space-y-4">
                  <h4 className="text-sm font-mono text-accent uppercase font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Improvements
                  </h4>
                  <ul className="space-y-2">
                    {result.improvements.map((s, i) => (
                      <li key={i} className="text-sm bg-accent/5 border border-accent/10 p-3 rounded-xl flex gap-3 text-accent">
                        <span className="shrink-0 text-accent">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <section className="space-y-4">
                <h4 className="text-sm font-mono text-foreground uppercase font-bold">Suggested Better Answer</h4>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-sm leading-relaxed text-muted-foreground italic">
                  {result.suggestedAnswer}
                </div>
              </section>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="rounded-xl h-12 px-6" onClick={reset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button className="rounded-xl h-12 px-8 font-bold" onClick={onClose}>Done</Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ScoreCard({ title, score, delay }: { title: string; score: number; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="glass p-4 rounded-2xl text-center flex flex-col items-center justify-center gap-2"
    >
      <span className="text-[10px] font-mono uppercase text-muted-foreground">{title}</span>
      <span className={`text-2xl font-black ${score > 7 ? 'text-primary' : score > 4 ? 'text-accent' : 'text-rose-500'}`}>
        {score}/10
      </span>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          className={`h-full ${score > 7 ? 'bg-primary' : score > 4 ? 'bg-accent' : 'bg-rose-500'}`}
        />
      </div>
    </motion.div>
  );
}
