// source_handbook: week11-hackathon-preparation

import React from 'react';
import { motion } from 'motion/react';

const steps = [
  {
    id: "01",
    title: "Upload JD",
    description: "Paste your job description or upload a PDF. Our RAG engine chunks and indexes it in seconds."
  },
  {
    id: "02",
    title: "Smart Practice",
    description: "Generate role-specific questions and record your answers for deep AI evaluation."
  },
  {
    id: "03",
    title: "Ace the Role",
    description: "Review scores, strengthen weak areas, and chat with your coach to go in confident."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 px-6 md:px-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-24 pr-12">
           <span className="micro-label mb-4 block">Section 02 / The Process</span>
           <h2 className="text-5xl md:text-8xl font-serif leading-[0.9] tracking-tight">How we redefine <br /><span className="italic opacity-80">preparation.</span></h2>
           
           <div className="hidden md:block absolute right-0 top-0 vertical-rail micro-label opacity-30 tracking-[0.5em]">
             SEQUENCE OF OPERATIONS
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative pt-24"
            >
              <span className="absolute top-0 left-0 font-serif text-[120px] leading-none opacity-10 pointer-events-none">{step.id}</span>
              <div className="relative z-10">
                <h3 className="text-2xl font-serif mb-4 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-primary" />
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm max-w-xs">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
