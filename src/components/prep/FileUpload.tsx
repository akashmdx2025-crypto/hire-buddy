// source_handbook: week11-hackathon-preparation

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileUp, Clipboard, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { JDAnalysis } from '../../lib/types';

interface FileUploadProps {
  onSuccess: (analysis: JDAnalysis) => void;
}

export default function FileUpload({ onSuccess }: FileUploadProps) {
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = async (content?: string, type: string = 'text/plain') => {
    const payload = content || text;
    if (!payload.trim()) {
      toast.error("Please enter job description text or upload a file.");
      return;
    }

    setIsUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: payload, type })
      });
      
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        toast.success("Job description parsed and indexed successfully.");
        setTimeout(() => {
          onSuccess(data.analysis);
        }, 1000);
      } else {
        toast.error(data.error || "Failed to process JD.");
      }
    } catch (err) {
      toast.error("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    if (file.type === 'application/pdf') {
      reader.onload = async (event) => {
        const base64Content = (event.target?.result as string).split(',')[1];
        handleUpload(base64Content, 'application/pdf');
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (event) => {
        handleUpload(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <div className="bg-background">
        {isSuccess ? (
          <div className="text-center py-20 px-10 border-4 border-foreground brutal-shadow">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-32 h-32 bg-primary text-primary-foreground border-4 border-foreground flex items-center justify-center mx-auto mb-10 brutal-shadow-white"
            >
              <CheckCircle2 className="w-20 h-20 stroke-[4px]" />
            </motion.div>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">LOG_INCOMING</h2>
            <p className="text-xl font-black uppercase italic opacity-40">Synchronizing extraction nodes...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary text-primary-foreground border-4 border-foreground flex items-center justify-center mx-auto mb-10 brutal-shadow-white group-hover:rotate-6 transition-transform">
                <FileUp className="w-12 h-12 stroke-[3px]" />
              </div>
              <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-6">Archive Input</h2>
              <p className="text-xl font-black uppercase italic opacity-40">Feed the engine a Job Description [ PDF / TXT ]</p>
            </div>

            <div className="space-y-10">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="PASTE_CASE_TEXT_HERE..."
                className="w-full min-h-[250px] bg-background border-4 border-foreground p-10 text-xl font-black uppercase italic focus:outline-none focus:bg-primary/5 transition-all resize-none brutal-shadow focus:translate-x-[-4px] focus:translate-y-[-4px] focus:shadow-[12px_12px_0px_0px_var(--color-primary)]"
              />

              <div className="flex flex-col md:flex-row gap-8">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                />
                <Button 
                  className="flex-1 brutal-btn h-20 text-xl"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isUploading}
                >
                  <Upload className="mr-4 w-8 h-8 stroke-[3px]" />
                  SYNC_FILE
                </Button>
                <Button 
                  className="flex-1 brutal-btn h-20 text-xl bg-primary text-primary-foreground"
                  onClick={() => handleUpload()}
                  disabled={isUploading || !text.trim()}
                >
                  {isUploading ? (
                    <Loader2 className="w-10 h-10 animate-spin" />
                  ) : (
                    <>
                      <Clipboard className="mr-4 w-8 h-8 stroke-[3px]" />
                      COMPUTE_TEXT
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-16 flex items-center justify-center gap-6 opacity-30">
        <div className="h-1 w-12 bg-foreground" />
        <p className="text-xs font-black uppercase italic tracking-[0.4em] flex items-center gap-4">
          <Sparkles className="w-5 h-5 text-primary" />
          RAG_CORE_STABLE // PRIVACY_LOCKED
        </p>
        <div className="h-1 w-12 bg-foreground" />
      </div>
    </motion.div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
