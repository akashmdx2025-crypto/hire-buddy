// source_handbook: week11-hackathon-preparation

import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button.tsx';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 overflow-hidden bg-background">
      {/* Editorial Decorative Background */}
      <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-primary z-0 opacity-5 md:opacity-100" />
      
      <nav className="absolute top-12 left-6 md:left-20 right-6 md:right-20 flex justify-between items-end z-10">
        <div className="flex flex-col">
          <span className="micro-label">Digital Coach</span>
          <span className="font-serif italic text-2xl">The Interviewer</span>
        </div>
        <div className="hidden md:flex space-x-12 micro-label mb-1 uppercase tracking-widest">
          <a href="#" className="hover:line-through transition-all">Career Guide</a>
          <a href="#" className="hover:line-through transition-all">Mock Rounds</a>
          <a href="#" className="hover:line-through transition-all">About</a>
          <button onClick={onStart} className="text-primary-foreground bg-primary px-4 py-1 rounded-sm uppercase tracking-widest">Join Now</button>
        </div>
      </nav>

      <div className="max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <h1 className="font-serif text-[18vw] md:text-[180px] leading-[0.8] tracking-[-0.04em] ml-[-4px] md:ml-[-10px] uppercase">
            HIRE<br />
            <span className="ml-12 md:ml-24 italic opacity-90">READY</span>
          </h1>
          
          <div className="absolute -top-4 md:-top-8 right-0 md:right-[30%] w-48 md:w-64">
            <p className="text-[11px] leading-relaxed border-l border-primary pl-4 uppercase font-semibold">
              An AI-powered investigation into your professional potential.
            </p>
          </div>
        </motion.div>

        <div className="mt-16 md:mt-24 flex flex-col md:flex-row items-start gap-12 md:gap-24">
          <div className="w-full md:w-80">
            <span className="micro-label block mb-4 opacity-50">Core Mission</span>
            <p className="text-lg md:text-xl leading-snug font-serif">
              Bridging the gap between performance and opportunity through real-time RAG-powered feedback.
            </p>
            <div className="mt-8 line-divider" />
            <div className="mt-4 flex justify-between text-[9px] font-bold uppercase tracking-widest">
              <span>Readiness: AI Evaluated</span>
              <span>Built by Discovery Syndicate</span>
            </div>
            
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-none border-primary px-10 h-14 uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={onStart}
              >
                Assemble Preparation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          <div className="relative flex-1 w-full hidden md:block">
            <div className="h-64 md:h-96 bg-secondary w-full relative overflow-hidden">
               <div className="absolute inset-0 border-[20px] border-transparent border-t-background border-r-background"></div>
               <div className="absolute bottom-6 left-6 text-primary text-[10px] uppercase font-bold tracking-[0.3em] z-10 flex items-center gap-2">
                 <Sparkles className="w-4 h-4" />
                 Plate No. 01 / Career Vector
               </div>
               
               {/* Visual mask effect */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/20 rotate-45" />
            </div>
          </div>
        </div>
      </div>

      <aside className="absolute right-6 md:right-8 bottom-6 md:bottom-12 z-20 text-foreground md:text-white">
        <div className="flex flex-col items-center space-y-12 md:space-y-32">
          <div className="vertical-rail text-[10px] font-bold uppercase tracking-[0.4em] origin-center rotate-180 transition-all hover:tracking-[0.6em] cursor-default">
            ESTABLISHED MMXXVI
          </div>
          <button 
            onClick={onStart}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-current flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-colors"
          >
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </aside>

      <div className="absolute bottom-6 md:bottom-12 left-6 md:left-20">
        <span className="micro-label">© 2026 HireReady Collective</span>
      </div>
    </section>
  );
}
