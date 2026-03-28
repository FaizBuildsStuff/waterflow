'use client'

import React from 'react'
import { 
  MoreHorizontal, 
  Clock, 
  MessageSquare, 
  CheckSquare,
  AlertCircle,
  Calendar,
  User
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface Task {
  id: number
  title: string
  status: string
  priority: 'High' | 'Medium' | 'Low'
  due_date?: string
  description?: string
  assignee_id?: number
  assignee_name?: string
  assignee_avatar?: string
  subtasks?: any[]
  created_at: string
}

interface ListViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export const ListView = ({ tasks, onTaskClick }: ListViewProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-400/10'
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'Low': return 'text-blue-400 bg-blue-400/10'
      default: return 'text-zinc-400 bg-zinc-400/10'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Todo': return 'bg-zinc-500'
      case 'In Progress': return 'bg-primary'
      case 'In Review': return 'bg-amber-500'
      case 'Done': return 'bg-green-500'
      default: return 'bg-zinc-500'
    }
  }

  return (
    <div className="p-8">
      <Card className="bg-[#0D0D0D] border-white/5 overflow-hidden rounded-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-6 pl-8">Task</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Priority</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Assignee</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Due Date</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pr-8 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow 
                key={task.id} 
                className="border-white/5 hover:bg-white/5 cursor-pointer group transition-colors"
                onClick={() => onTaskClick(task)}
              >
                <TableCell className="py-6 pl-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{task.title}</span>
                    <span className="text-[11px] text-zinc-500 truncate max-w-xs">{task.description || 'No description'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", getStatusColor(task.status))} />
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{task.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest", getPriorityColor(task.priority))}>
                    {task.priority || 'Medium'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={task.assignee_avatar || `https://i.pravatar.cc/150?u=${task.assignee_id || task.id}`} />
                      <AvatarFallback className="text-[8px] bg-zinc-800">U</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-zinc-400">{task.assignee_name || 'Team Member'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-bold text-zinc-300 italic">
                  {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No date'}
                </TableCell>
                <TableCell className="pr-8 text-right">
                  <button className="text-zinc-600 hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-50">
                    <AlertCircle size={32} className="text-zinc-600" />
                    <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">No tasks found in this project</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
