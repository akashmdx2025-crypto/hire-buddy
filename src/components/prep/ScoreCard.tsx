// source_handbook: week11-hackathon-preparation

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, TrendingUp, Award, Clock } from 'lucide-react';
import { AILogEntry } from '../../lib/types';

export default function ScoreCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState({
    overall: 0,
    practiced: 0,
    avgScore: 0,
    status: 'In Training'
  });

  const updateStats = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      const evaluations = data.logs.filter((l: AILogEntry) => l.action === 'evaluate-answer' && l.qualityScore);
      
      if (evaluations.length > 0) {
        const avg = evaluations.reduce((sum: number, l: AILogEntry) => sum + (l.qualityScore || 0), 0) / evaluations.length;
        const status = avg > 80 ? 'Interview Ready' : avg > 60 ? 'Well Prepared' : avg > 40 ? 'Getting There' : 'In Training';
        
        setStats({
          overall: Math.round(avg),
          practiced: evaluations.length,
          avgScore: Math.round(avg),
          status
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-6 py-2 border-2 border-foreground bg-primary text-primary-foreground font-black text-xs italic brutal-shadow-white flex items-center gap-3 uppercase"
      >
        <div className="w-2 h-2 bg-primary-foreground animate-pulse border border-black" />
        <span>READINESS // {stats.overall}%</span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-6 w-80 bg-background border-4 border-foreground p-8 z-50 brutal-shadow"
          >
            <div className="text-center mb-8 border-b-2 border-foreground pb-4">
              <div className="text-[10px] font-black uppercase text-primary mb-2 underline decoration-2 underline-offset-4 tracking-[0.2em]">Prep_Status_Report</div>
              <div className="text-2xl font-black italic uppercase tracking-tighter">
                {stats.status}
              </div>
            </div>

            <div className="space-y-6">
              <DetailRow icon={Award} label="Avg_Quality" value={`${stats.avgScore}%`} />
              <DetailRow icon={TrendingUp} label="Questions_Log" value={stats.practiced.toString()} />
              <DetailRow icon={Target} label="JD_Alignment" value="OPTIMIZED" />
              <DetailRow icon={Clock} label="Session_Uptime" value="12:04" />
            </div>

            <div className="mt-8 pt-8 border-t-4 border-foreground">
              <div className="flex justify-between items-center text-[10px] font-black uppercase mb-3 italic">
                <span>Progress_Vector</span>
                <span className="text-primary font-black">{stats.overall}%</span>
              </div>
              <div className="h-4 w-full bg-foreground border-2 border-foreground p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.overall}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
               <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em]">Integrated_Feedback_OS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-foreground text-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] font-black uppercase italic">{label}</span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-primary italic underline underline-offset-2">{value}</span>
    </div>
  );
}
