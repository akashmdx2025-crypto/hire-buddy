// source_handbook: week11-hackathon-preparation

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AILogEntry } from '../../lib/types';
import { History, Activity, Zap, ShieldCheck, ShieldAlert, ChevronDown, ChevronUp, Server } from 'lucide-react';

const LOG_POLL_INTERVAL = 5000;

export default function AILogPanel() {
  const [logs, setLogs] = useState<AILogEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data.logs);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch AI logs.");
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, LOG_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col p-8 md:p-12 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ffffff05_2px,#ffffff05_4px)]">
      <div className="flex items-center justify-between mb-12 border-b-4 border-foreground pb-8">
        <div>
          <h2 className="text-5xl font-black uppercase italic tracking-tighter flex items-center gap-6">
            <History className="w-12 h-12 text-primary stroke-[4px]" />
            SYSTEM_LOGS // ANALYSIS
          </h2>
          <p className="text-xs font-black uppercase italic text-primary mt-4 tracking-[0.2em]">Observability metrics: Token_Flux, Latency_Delta, and Guardrail_Status.</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="API_TRIGGERS" value={stats.totalCalls} icon={Zap} color="primary" />
          <StatCard title="TOKEN_CONSUMPTION" value={stats.totalTokens} icon={Server} color="indigo" />
          <StatCard title="MEAN_LATENCY" value={`${stats.avgLatency}ms`} icon={Activity} color="amber" />
          <StatCard title="BLOCK_RATE" value={`${stats.guardrailBlockRate}%`} icon={ShieldCheck} color="rose" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto border-4 border-foreground bg-background brutal-shadow">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-foreground text-background z-10">
            <tr className="text-[10px] font-black uppercase tracking-widest italic">
              <th className="p-6">PROTOCOL</th>
              <th className="p-6">DELAY</th>
              <th className="p-6">FLUX</th>
              <th className="p-6">GATE_STATUS</th>
              <th className="p-6">QUALITY</th>
              <th className="p-6 text-right">META</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-foreground">
            <AnimatePresence>
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-xs group hover:bg-primary/10 transition-colors ${!log.guardrailsPassed ? 'bg-rose-500/10' : ''}`}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 border-2 border-foreground ${
                          log.action === 'evaluate-answer' ? 'bg-primary' :
                          log.action === 'generate-questions' ? 'bg-blue-500' :
                          log.action === 'chat' ? 'bg-yellow-500' : 'bg-muted'
                        }`} />
                        <span className="font-black uppercase italic">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-6 font-black italic">{log.latencyMs}ms</td>
                    <td className="p-6 font-black italic">{log.totalTokens}</td>
                    <td className="p-6">
                      {log.guardrailsPassed ? (
                        <div className="flex items-center gap-2 text-primary font-black uppercase italic">
                          <ShieldCheck className="w-4 h-4 stroke-[3px]" />
                          <span>SECURE</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-500 font-black uppercase italic">
                          <ShieldAlert className="w-4 h-4 stroke-[3px]" />
                          <span>BLOCKED</span>
                        </div>
                      )}
                    </td>
                    <td className="p-6 text-primary">
                      {log.qualityScore ? (
                        <div className="font-black italic text-lg">{log.qualityScore}%</div>
                      ) : (
                        <span className="opacity-20 font-black">—</span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                        className="p-2 border-2 border-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        {expandedId === log.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </motion.tr>
                  {expandedId === log.id && (
                    <motion.tr 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-muted"
                    >
                      <td colSpan={6} className="p-10 border-b-2 border-foreground">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm font-black uppercase italic italic leading-tight">
                          <div className="space-y-4">
                            <div className="text-primary underline decoration-2 underline-offset-4 mb-4">Observation_Matrix:</div>
                            <div className="flex justify-between border-b border-foreground/10 pb-2"><span>Model:</span> <span>{log.model}</span></div>
                            <div className="flex justify-between border-b border-foreground/10 pb-2"><span>Token_Distribution:</span> <span>{log.promptTokens} P + {log.completionTokens} C</span></div>
                            {log.similarityScore && (
                              <div className="flex justify-between border-b border-foreground/10 pb-2"><span>RAG_Semantic_Score:</span> <span>{log.similarityScore.toFixed(4)}</span></div>
                            )}
                          </div>
                          {log.guardrailDetails && (
                            <div className="space-y-4">
                              <div className="text-rose-500 underline decoration-2 underline-offset-4 mb-4">Gate_Failure_Log:</div>
                              <div className="text-rose-400 p-6 bg-rose-500/5 border-2 border-rose-500/30 brutal-shadow">
                                {log.guardrailDetails}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: any; icon: any; color: string }) {
  const colorMap: Record<string, string> = {
    primary: 'text-primary border-primary bg-primary/5',
    indigo: 'text-blue-500 border-blue-500 bg-blue-500/5',
    amber: 'text-yellow-500 border-yellow-500 bg-yellow-500/5',
    rose: 'text-rose-500 border-rose-500 bg-rose-500/5',
  };

  return (
    <div className={`p-6 border-4 border-foreground brutal-shadow bg-background relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity`}>
        <Icon className="w-12 h-12" />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase text-foreground/40 italic mb-2 tracking-widest">{title}</div>
        <div className={`text-3xl font-black italic tracking-tighter ${colorMap[color].split(' ')[0]}`}>{value}</div>
      </div>
    </div>
  );
}
