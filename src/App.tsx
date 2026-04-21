// source_handbook: week11-hackathon-preparation

import React, { useState } from 'react';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import PrepWorkspace from './components/prep/PrepWorkspace';
import { Toaster } from 'sonner';

export default function App() {
  const [view, setView] = useState<'landing' | 'prep'>('landing');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {view === 'landing' ? (
        <main className="mesh-gradient">
          <Hero onStart={() => setView('prep')} />
          <Features />
          <HowItWorks />
          <footer className="py-12 border-t border-border/50 text-center text-muted-foreground text-sm font-mono">
            Built for CST4625 Generative AI Module | Powered by HireReady AI & Gemini
          </footer>
        </main>
      ) : (
        <PrepWorkspace onBack={() => setView('landing')} />
      )}
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
