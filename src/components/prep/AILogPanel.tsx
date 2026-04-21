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
    <div className="h-full flex flex-col p-8 bg-black/40 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            AI Interaction Logs
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Evaluation transparency: token counts, latency, and guardrails.</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="API Calls" value={stats.totalCalls} icon={Zap} color="primary" />
          <StatCard title="Total Tokens" value={stats.totalTokens} icon={Server} color="indigo" />
          <StatCard title="Avg Latency" value={`${stats.avgLatency}ms`} icon={Activity} color="amber" />
          <StatCard title="Guardrail Blocks" value={`${stats.guardrailBlockRate}%`} icon={ShieldCheck} color="rose" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto rounded-3xl border border-white/5 bg-black/20">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-card border-b border-white/5 z-10">
            <tr className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              <th className="p-4 font-bold">Action</th>
              <th className="p-4 font-bold">Latency</th>
              <th className="p-4 font-bold">Tokens</th>
              <th className="p-4 font-bold">Guardrails</th>
              <th className="p-4 font-bold">Quality</th>
              <th className="p-4 font-bold text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-xs group hover:bg-white/5 transition-colors ${!log.guardrailsPassed ? 'bg-rose-500/5' : ''}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          log.action === 'evaluate-answer' ? 'bg-primary' :
                          log.action === 'generate-questions' ? 'bg-indigo-500' :
                          log.action === 'chat' ? 'bg-amber-500' : 'bg-muted'
                        }`} />
                        <span className="font-bold">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono">{log.latencyMs}ms</td>
                    <td className="p-4 text-muted-foreground font-mono">{log.totalTokens}</td>
                    <td className="p-4">
                      {log.guardrailsPassed ? (
                        <div className="flex items-center gap-1.5 text-primary">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>PASSED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-500">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>BLOCKED</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {log.qualityScore ? (
                        <div className="font-bold text-accent">{log.qualityScore}%</div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {expandedId === log.id ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                      </button>
                    </td>
                  </motion.tr>
                  {expandedId === log.id && (
                    <motion.tr 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-black/40"
                    >
                      <td colSpan={6} className="p-6">
                        <div className="grid grid-cols-2 gap-8 text-[11px] font-mono leading-relaxed">
                          <div className="space-y-2">
                            <div className="text-muted-foreground uppercase mb-1">Observation Details:</div>
                            <div className="text-foreground">Model: {log.model}</div>
                            <div className="text-foreground">Tokens: {log.promptTokens} prompt + {log.completionTokens} completion</div>
                            {log.similarityScore && (
                              <div className="text-foreground">RAG Similarity: {log.similarityScore.toFixed(4)}</div>
                            )}
                          </div>
                          {log.guardrailDetails && (
                            <div className="space-y-2">
                              <div className="text-rose-500 uppercase mb-1">Guardrail Failure Reason:</div>
                              <div className="text-rose-400 p-2 bg-rose-500/10 rounded border border-rose-500/20">
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
    primary: 'text-primary bg-primary/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
    amber: 'text-amber-500 bg-amber-500/10',
    rose: 'text-rose-500 bg-rose-500/10',
  };

  return (
    <div className="glass p-5 rounded-2xl flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">{title}</div>
        <div className="text-xl font-black">{value}</div>
      </div>
    </div>
  );
}
