// source_handbook: week11-hackathon-preparation

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, FileText, LayoutDashboard, MessageSquare, ListTodo, History, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUpload from './FileUpload';
import JDViewer from './JDViewer';
import QuestionPanel from './QuestionPanel';
import CoachChat from './CoachChat';
import AILogPanel from './AILogPanel';
import ScoreCard from './ScoreCard';
import { JDAnalysis } from '../../lib/types';

interface PrepWorkspaceProps {
  onBack: () => void;
}

export default function PrepWorkspace({ onBack }: PrepWorkspaceProps) {
  const [jdAnalysis, setJdAnalysis] = useState<JDAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'questions' | 'coach' | 'logs' | 'tips'>('content');
  const [isJDParsed, setIsJDParsed] = useState(false);

  const tabs = [
    { id: 'content', label: 'Analysis', icon: FileText },
    { id: 'questions', label: 'Questions', icon: ListTodo },
    { id: 'coach', label: 'AI Coach', icon: MessageSquare },
    { id: 'logs', label: 'AI Logs', icon: History },
  ];

  return (
    <div className="h-screen flex flex-col bg-background text-foreground font-mono selection:bg-primary selection:text-primary-foreground">
      {/* Marquee Banner */}
      <div className="marquee-container h-8 z-50">
        <div className="marquee-content whitespace-nowrap">
          HIRE READY AI INTERFACE // [ SESSION ACTIVE ] // SYSTEM STATUS: OPTIMIZED // LATENCY: 24MS // RAG CORE: ONLINE // [ CRITICAL PREPARATION IN PROGRESS ] // 
          HIRE READY AI INTERFACE // [ SESSION ACTIVE ] // SYSTEM STATUS: OPTIMIZED // LATENCY: 24MS // RAG CORE: ONLINE // [ CRITICAL PREPARATION IN PROGRESS ] // 
        </div>
      </div>

      {/* Header */}
      <header className="h-20 px-6 border-b-2 border-foreground flex items-center justify-between bg-background z-30">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack} 
            className="brutal-btn py-1.5 px-4 text-xs"
          >
            <span className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              EXIT_ARCHIVE
            </span>
          </button>
          <div className="h-10 w-[2px] bg-foreground" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary uppercase">HIRE_READY_OS</span>
            <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">Terminal.V1</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-4">
             <div className="px-3 py-1 bg-primary text-primary-foreground border-2 border-foreground font-black text-xs">
               LIVE_CONNECTION
             </div>
             <div className="px-3 py-1 border-2 border-foreground font-black text-xs bg-accent text-accent-foreground">
               REGION_01
             </div>
           </div>
           {isJDParsed && <ScoreCard />}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {!isJDParsed ? (
          <div className="flex-1 flex items-center justify-center p-6 relative bg-[repeating-linear-gradient(45deg,#111,#111_10px,#000_10px,#000_20px)]">
            <div className="relative z-10 w-full max-w-xl brutal-border bg-background p-12 brutal-shadow">
              <FileUpload 
                onSuccess={(analysis) => {
                  setJdAnalysis(analysis);
                  setIsJDParsed(true);
                }} 
              />
            </div>
          </div>
        ) : (
          <>
            {/* Sidebar */}
            <nav className="w-20 md:w-72 border-r-2 border-foreground bg-background flex flex-col">
              <div className="flex-1 py-8">
                <div className="px-6 mb-8">
                  <span className="text-xs font-black uppercase text-primary border-b-2 border-primary pb-1">Protocols</span>
                </div>
                <div className="flex flex-col gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-4 px-8 py-5 transition-all relative group ${
                        activeTab === tab.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <tab.icon className={`w-6 h-6 shrink-0 ${activeTab === tab.id ? 'stroke-[3px]' : 'opacity-50'}`} />
                      <span className={`hidden md:block font-black text-lg uppercase tracking-tighter ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}`}>
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-8 border-t-2 border-foreground mt-auto hidden md:block">
                <div className="p-4 border-2 border-primary bg-primary/5 brutal-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Archive Meta</span>
                  </div>
                  <p className="text-[10px] text-foreground leading-relaxed uppercase font-black">
                    Analysis engine synchronized. Grounding protocols active. [ RE-SYNC REQUIRED: 0ms ]
                  </p>
                </div>
              </div>
            </nav>

            {/* Content Area */}
            <div className="flex-1 bg-background overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "anticipate" }}
                  className="h-full relative z-10"
                >
                  <div className="h-full overflow-y-auto">
                    {activeTab === 'content' && <JDAnalysisView analysis={jdAnalysis!} />}
                    {activeTab === 'questions' && <div className="p-12"><QuestionPanel /></div>}
                    {activeTab === 'coach' && <div className="p-0 h-full"><CoachChat /></div>}
                    {activeTab === 'logs' && <div className="p-12"><AILogPanel /></div>}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function JDAnalysisView({ analysis }: { analysis: JDAnalysis }) {
  return (
    <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto">
      <JDViewer analysis={analysis} />
    </div>
  );
}
