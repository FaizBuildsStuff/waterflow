import React from 'react'
import { Check, Loader2, Terminal, Zap, ShieldCheck, Database, Layout } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OrchestrationStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed'
  icon: React.ElementType
}

export const OrchestrationVisualizer = ({ 
  steps, 
  logs, 
  progress 
}: { 
  steps: OrchestrationStep[], 
  logs: string[],
  progress: number
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header Stat */}
      <div className="space-y-4">
        <div className="relative size-20 rounded-3xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-primary/40 overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 animate-scan opacity-20" />
          <Zap size={32} fill="currentColor" className="animate-pulse-subtle z-10" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white italic tracking-tight flex items-center gap-2">
            Neural Core 
            <span className="text-[10px] font-mono text-zinc-500 not-italic px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 group-hover:text-primary transition-colors">
              v4.0.2
            </span>
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="size-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Sequence Orchestration</p>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-1.5">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={cn(
              "group relative flex items-center justify-between p-3 rounded-2xl border transition-all duration-300",
              step.status === 'completed' ? "bg-primary/5 border-primary/20 scale-[0.98] opacity-60" : 
              step.status === 'processing' ? "bg-white/3 border-white/20 shadow-xl shadow-primary/5" : 
              "border-transparent opacity-30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "size-8 rounded-xl flex items-center justify-center transition-colors",
                step.status === 'completed' ? "text-primary bg-primary/10" : 
                step.status === 'processing' ? "text-white bg-primary animate-pulse shadow-lg shadow-primary/20" : 
                "text-zinc-600 bg-white/5"
              )}>
                {step.status === 'completed' ? <Check size={14} strokeWidth={4} /> : 
                 step.status === 'processing' ? <Loader2 size={14} className="animate-spin" /> : 
                 <step.icon size={14} />}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]",
                step.status === 'processing' ? "text-white" : "text-zinc-500"
              )}>
                {step.name}
              </span>
            </div>
            
            {step.status === 'processing' && (
              <div className="text-[9px] font-mono text-primary font-bold animate-pulse">
                [ {progress}% ]
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Terminal Log Output */}
      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-zinc-700" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Matrix Logs</span>
          </div>
          <span className="text-[8px] font-mono text-zinc-800">UTF-8 SYSTEM_EXEC</span>
        </div>
        
        <div className="bg-[#020202] border border-white/5 rounded-2xl p-4 overflow-hidden h-40 relative group hover:border-white/10 transition-colors">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#ffffff01,transparent)] pointer-events-none" />
          <div className="space-y-1 font-mono text-[9px] relative z-10 select-none">
            {logs.slice(-6).map((log, i) => (
              <div key={i} className={cn(
                "flex gap-3",
                i === logs.slice(-6).length - 1 ? "text-primary" : "text-zinc-600"
              )}>
                <span className="opacity-30 shrink-0">{(i + logs.length - 5).toString().padStart(3, '0')}</span>
                <span className="truncate">{log}</span>
              </div>
            ))}
            <div className="size-1 w-2 bg-primary animate-pulse inline-block ml-1" />
          </div>
          {/* Scroll fade effect */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#020202] to-transparent pointer-events-none" />
        </div>
      </div>
      
      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
        <p className="text-[9px] font-bold text-primary/80 lowercase leading-relaxed">
          &gt; system operating in high-fidelity mode. neural synthesis may take a few seconds to stabilize...
        </p>
      </div>
    </div>
  )
}
