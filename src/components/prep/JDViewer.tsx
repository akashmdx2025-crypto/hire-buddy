// source_handbook: week11-hackathon-preparation

import React from 'react';
import { motion } from 'motion/react';
import { JDAnalysis } from '@/lib/types.ts';
import { Badge } from '@/components/ui/badge.tsx';
import { Star, Briefcase, Code, GraduationCap } from 'lucide-react';

export default function JDViewer({ analysis }: { analysis: JDAnalysis }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 max-w-6xl mx-auto py-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b-4 border-foreground pb-12">
        <div className="flex-1">
          <span className="text-xs font-black uppercase text-primary mb-4 block underline decoration-2 underline-offset-4">Subject Extraction Profile</span>
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter uppercase italic">
            {analysis.roleTitle}
          </h1>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="px-8 py-4 bg-primary text-primary-foreground border-4 border-foreground brutal-shadow-white">
            <span className="text-xs block font-black mb-1 opacity-70">Seniority</span>
            <span className="text-3xl font-black uppercase italic">{analysis.experienceLevel}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-6">
           <div className="p-8 border-4 border-foreground bg-accent text-accent-foreground brutal-shadow-white">
             <span className="text-xs block mb-4 font-black underline decoration-2 underline-offset-4">Executive Case Summary</span>
             <p className="text-lg font-black leading-tight italic">
               "{analysis.summary}"
             </p>
           </div>
        </div>

        <div className="md:col-span-8">
           <div className="p-8 border-4 border-foreground bg-background brutal-shadow">
             <span className="text-xs block mb-8 font-black uppercase text-primary border-b-2 border-primary w-fit pb-1">Core Capability Matrix</span>
             <div className="flex flex-wrap gap-4">
                {analysis.skills.map((skill, i) => (
                  <div key={skill} className="px-6 py-3 border-2 border-foreground bg-background hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-3 font-black text-sm italic">
                    <span className="opacity-30">0{i + 1}</span>
                    {skill}
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      <section className="space-y-8">
        <div className="flex justify-between items-center bg-foreground text-background p-4">
           <h2 className="text-2xl font-black uppercase italic tracking-tighter">Operational Duty Logs</h2>
           <span className="text-xs font-black">EXTRACTED_{analysis.responsibilities.length}_UNITS</span>
        </div>
        <div className="grid grid-cols-1 gap-px bg-foreground border-4 border-foreground brutal-shadow">
          {analysis.responsibilities.map((resp, i) => (
            <div 
              key={i}
              className="group p-8 bg-background flex items-start gap-8 hover:bg-primary/10 transition-all border-b-2 border-foreground last:border-b-0"
            >
              <div className="flex flex-col items-center">
                <span className="text-xs font-black py-1 px-3 bg-foreground text-background uppercase">L_{String(i + 1).padStart(2, '0')}</span>
                <div className="w-[2px] h-full bg-foreground mt-2 opacity-20" />
              </div>
              <p className="text-xl font-black leading-tight uppercase italic flex-1">
                {resp}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-between items-end pt-24 pb-12 border-t-4 border-foreground mt-24">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-primary text-primary-foreground border-4 border-foreground font-black text-4xl italic brutal-shadow-white pointer-events-none">
              HR_AI
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black uppercase italic">HireReady_System</span>
              <span className="text-xs font-black opacity-50 uppercase tracking-[0.4em]">Integrated Archive v.2.4</span>
            </div>
         </div>
         <div className="text-right">
           <span className="text-xs font-black uppercase text-primary mb-2 block underline decoration-2 underline-offset-4">Last Sync Data</span>
           <span className="text-xl font-black italic">{new Date().toISOString().split('T')[0]} // {new Date().toLocaleTimeString()}</span>
         </div>
      </div>
    </motion.div>
  );
}
