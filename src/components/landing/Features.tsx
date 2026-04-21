// source_handbook: week11-hackathon-preparation

import React from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, Target, MessageSquare, ShieldCheck, BarChart3, FileSearch } from 'lucide-react';

const features = [
  {
    title: "Smart JD Analysis",
    description: "Upload any job description as PDF or text. We extract key skills, requirements, and responsibilities automatically.",
    icon: FileSearch,
    color: "emerald"
  },
  {
    title: "Tailored Questions",
    description: "AI generates behavioral, technical, and situational questions directly from the job requirements. No generic prep.",
    icon: Target,
    color: "indigo"
  },
  {
    title: "Answer Evaluation",
    description: "Type your answer and get instant scoring on relevance, depth, structure, and STAR method usage.",
    icon: ClipboardCheck,
    color: "amber"
  },
  {
    title: "AI Career Coach",
    description: "Chat with a coach that knows YOUR target role. Every answer grounded in the actual JD using RAG logic.",
    icon: MessageSquare,
    color: "indigo"
  },
  {
    title: "AI Transparency",
    description: "See every AI call logged — tokens, latency, quality scores. Full evaluation observability for researchers.",
    icon: BarChart3,
    color: "emerald"
  },
  {
    title: "Guardrailed Prep",
    description: "AI stays on topic. No hallucinated requirements. No off-topic advice. Grounded, reliable preparation.",
    icon: ShieldCheck,
    color: "rose"
  }
];

export default function Features() {
  return (
    <section className="py-32 px-6 md:px-20 bg-background border-t border-primary">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-primary pb-12 gap-8">
          <div className="max-w-2xl">
            <span className="micro-label mb-4 block">Volume 01 / Methodology</span>
            <h2 className="text-5xl md:text-7xl font-serif italic mb-6 leading-tight">Built with six core AI principles.</h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-right uppercase text-[10px] font-bold tracking-widest leading-relaxed">
            Demonstrating modern engineering patterns for the next generation of mission-critical applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 border-primary group hover:bg-primary hover:text-primary-foreground transition-all duration-500
                ${i % 3 !== 2 ? 'md:border-r' : ''} 
                ${i < 3 ? 'md:border-b' : ''}
              `}
            >
              <div className="mb-12 flex justify-between items-start">
                <span className="font-serif italic text-3xl opacity-30 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
                <feature.icon className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              </div>
              <h3 className="text-2xl font-serif mb-4">{feature.title}</h3>
              <p className="opacity-60 group-hover:opacity-100 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
