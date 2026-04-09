'use client'

import React, { useEffect, useState } from 'react'
import { 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { format, isPast } from 'date-fns'
import { cn } from '@/lib/utils'
import { ListView } from '@/components/dashboard/list-view'

interface Task {
  id: number
  title: string
  status: string
  priority: 'High' | 'Medium' | 'Low'
  due_date?: string
  description?: string
  project_name: string
  created_at: string
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks/my')
        const data = await res.json()
        if (data.tasks) setTasks(data.tasks)
      } catch (err) {
        console.error('Fetch my tasks error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.project_name.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    overdue: tasks.filter(t => t.due_date && isPast(new Date(t.due_date)) && t.status !== 'Done').length
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050505]">
      <header className="px-8 pt-12 pb-8 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-3xl sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 size={12} className="animate-pulse" /> Focus Active
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white/95 leading-[0.9]">
              My Tasks<span className="text-primary">.</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium max-w-xl">
               Manage your individual workload and track upcoming deadlines across all projects.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-white transition-colors" />
              <input 
                placeholder="Find tasks..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 h-14 w-80 text-sm placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-medium text-white"
              />
            </div>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-8 space-y-12 max-w-7xl mx-auto">
          {/* Stats Zone */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="bg-[#0D0D0D] border-white/5 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle2 size={120} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Total Assigned</p>
              <h3 className="text-5xl font-black text-white mt-4 italic">{stats.total}</h3>
            </Card>
            <Card className="bg-[#0D0D0D] border-white/5 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-primary">
                <LayoutGrid size={120} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">In Progress</p>
              <h3 className="text-5xl font-black text-white mt-4 italic">{stats.todo}</h3>
            </Card>
            <Card className="bg-[#0D0D0D] border-white/5 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-red-500">
                <TrendingUp size={120} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 text-red-500">Overdue Tasks</p>
              <h3 className="text-5xl font-black text-white mt-4 italic">{stats.overdue}</h3>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Current Tasks</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 border-primary/10 text-primary text-[10px] px-3 font-black">
                  {filteredTasks.length} Active
                </Badge>
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5 rounded-3xl">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-xs font-black uppercase tracking-widest text-zinc-600">Syncing with server...</p>
              </div>
            ) : filteredTasks.length > 0 ? (
              <ListView tasks={filteredTasks as any} onTaskClick={() => {}} />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">No tasks found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

import { ScrollArea } from '@/components/ui/scroll-area'
