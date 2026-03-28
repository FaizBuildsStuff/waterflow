'use client'

import React, { useEffect, useState } from 'react'
import { 
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { cn } from '@/lib/utils'

interface Task {
  id: number
  title: string
  status: string
  priority: 'High' | 'Medium' | 'Low'
  due_date?: string
  created_at: string
}

interface TimelineViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export const TimelineView = ({ tasks, onTaskClick }: TimelineViewProps) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.due_date) return 1
    if (!b.due_date) return -1
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  })

  return (
    <div className="p-8 h-full">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Project Timeline</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Chronological task roadmap</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            Live Sync
          </Badge>
        </div>

        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-px before:bg-linear-to-b before:from-primary/50 before:via-white/5 before:to-transparent">
          {sortedTasks.map((task, idx) => {
            const hasDate = !!task.due_date
            const date = hasDate ? new Date(task.due_date!) : null
            const overdue = hasDate && isPast(date!) && task.status !== 'Done'

            return (
              <div key={task.id} className="relative pl-12 group">
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute left-0 top-1.5 size-10 rounded-2xl flex items-center justify-center border-4 border-[#0A0A0A] transition-all group-hover:scale-110 z-10",
                  task.status === 'Done' ? "bg-green-500 shadow-lg shadow-green-500/20" : overdue ? "bg-red-500 animate-pulse" : "bg-white/10"
                )}>
                  {task.status === 'Done' ? (
                    <div className="size-2 rounded-full bg-white" />
                  ) : (
                    <Clock size={14} className={cn("text-white", overdue ? "text-white" : "text-zinc-500")} />
                  )}
                </div>

                <Card 
                  onClick={() => onTaskClick(task)}
                  className="bg-[#0D0D0D] border-white/5 p-6 rounded-3xl hover:border-primary/40 hover:bg-[#111111] transition-all cursor-pointer shadow-2xl shadow-black/40 group-hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge className={cn("px-2 py-0 text-[9px] font-black uppercase tracking-widest border-none", 
                          task.priority === 'High' ? "bg-red-500/10 text-red-500" : task.priority === 'Medium' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                          {task.priority}
                        </Badge>
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{task.status}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{task.title}</h3>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                      {hasDate ? (
                        <>
                          <div className={cn("flex items-center gap-2 text-sm font-black italic", overdue ? "text-red-400" : "text-primary")}>
                            {overdue ? 'OVERDUE' : 'DUE SOON'}
                            <ChevronRight size={14} />
                          </div>
                          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                            {format(date!, 'PPp')}
                          </p>
                          <p className="text-[10px] font-medium text-zinc-600">
                             {formatDistanceToNow(date!, { addSuffix: true })}
                          </p>
                        </>
                      ) : (
                        <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">No due date set</p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}

          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
              <TrendingUp size={48} className="text-zinc-600 mb-4" />
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Timeline Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
