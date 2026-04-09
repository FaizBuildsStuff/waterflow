'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Plus,
  MoreHorizontal,
  Clock,
  MessageSquare,
  Paperclip,
  CheckSquare,
  TrendingUp,
  AlertCircle,
  Calendar,
  Zap,
  ChevronRight,
  Send,
  Loader2
} from 'lucide-react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useDroppable
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Task {
  id: number
  title: string
  description?: string
  status: string
  priority: 'High' | 'Medium' | 'Low'
  due_date?: string | null
  assignee_id?: number | null
  subtasks?: any[]
  comments_count?: number
  created_at: string
  blocked_by_ids?: number[]
}

interface KanbanBoardProps {
  tasks: Task[]
  projectId: number
  onTasksChange: (tasks: Task[]) => void
  members?: any[]
  searchQuery?: string
  filterPriority?: string
  filterAssignee?: string
  groupBy?: 'status' | 'priority' | 'assignee'
  focusMode?: boolean
  currentUser?: any
}

const COLUMNS = [
  { id: 'Todo', title: 'Todo', color: 'bg-zinc-500' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-primary' },
  { id: 'In Review', title: 'In Review', color: 'bg-amber-500' },
  { id: 'Done', title: 'Done', color: 'bg-green-500' },
]

const SortableTaskCard = ({ task, onClick, members, onUpdate }: { 
  task: Task, 
  onClick: () => void, 
  members?: any[],
  onUpdate: (taskId: number, updates: Partial<Task>) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Low": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-white/10";
    }
  };

  const isBlocked = task.blocked_by_ids && task.blocked_by_ids.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="relative group/card"
    >
      <Card className="bg-[#0D0D0D] border-white/5 p-4 rounded-2xl group hover:border-primary/40 hover:bg-[#111111] transition-all cursor-pointer shadow-xl shadow-black/20 mb-3 relative overflow-hidden">
        {/* Quick Actions Bar */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-all transform translate-y-[-10px] group-hover/card:translate-y-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md p-1 rounded-lg border border-white/10">
          <button 
            onClick={(e) => { e.stopPropagation(); onUpdate(task.id, { status: 'Done' }) }}
            className="p-1 hover:bg-green-500/20 text-zinc-400 hover:text-green-500 rounded transition-colors"
            title="Mark Complete"
          >
            <CheckSquare size={14} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="p-1 hover:bg-primary/20 text-zinc-400 hover:text-primary rounded transition-colors"
                title="Change Priority"
              >
                <TrendingUp size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0D0D0D] border-white/10 text-white min-w-[120px]">
              <DropdownMenuItem onClick={() => onUpdate(task.id, { priority: 'High' })}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(task.id, { priority: 'Medium' })}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(task.id, { priority: 'Low' })}>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="p-1 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-500 rounded transition-colors"
                title="Set Due Date"
              >
                <Calendar size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 bg-[#0D0D0D] border-white/10" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Pick Due Date</p>
                <Input 
                  type="date" 
                  defaultValue={task.due_date?.split('T')[0]} 
                  onChange={(e) => onUpdate(task.id, { due_date: e.target.value })}
                  className="bg-white/5 border-white/10 h-8 text-[10px] invert brightness-0"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={cn("border px-2 py-0 text-[9px] font-black uppercase tracking-wider", getPriorityColor(task.priority))}>
                {task.priority || 'Medium'}
              </Badge>
              {isBlocked && (
                <div className="size-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500" title="This task is blocked">
                  <AlertCircle size={10} className="fill-red-500/20" />
                </div>
              )}
            </div>
            <Avatar className="size-6 ring-2 ring-black" title={members?.find(m => m.id === task.assignee_id)?.name || 'Unassigned'}>
              <AvatarImage src={members?.find(m => m.id === task.assignee_id)?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${members?.find(m => m.id === task.assignee_id)?.name || task.id}`} />
              <AvatarFallback className="text-[8px] bg-zinc-800 uppercase">{members?.find(m => m.id === task.assignee_id)?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </div>
          <h4 className="text-sm font-semibold text-zinc-100 leading-tight group-hover:text-white transition-colors">
            {task.title}
          </h4>
          <div className="flex items-center justify-between text-[10px] font-medium text-zinc-600">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MessageSquare size={12} />
                <span>{task.comments_count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckSquare size={12} />
                <span>{Array.isArray(task.subtasks) ? task.subtasks.filter((s: any) => s.completed).length : 0}/{Array.isArray(task.subtasks) ? task.subtasks.length : 0}</span>
              </div>
            </div>
            {task.due_date && (
              <div className="flex items-center gap-1 text-zinc-500 italic">
                <Clock size={12} />
                <span>{format(new Date(task.due_date), 'MMM d')}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export const KanbanBoard = ({ 
  tasks, 
  projectId, 
  onTasksChange, 
  members,
  searchQuery = '',
  filterPriority = 'all',
  filterAssignee = 'all',
  groupBy = 'status',
  focusMode = false,
  currentUser
}: KanbanBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskStatus, setNewTaskStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [columns, setColumns] = useState<any[]>([])
  const [isAiBreakingDown, setIsAiBreakingDown] = useState(false)
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('Medium')
  const [isAddColOpen, setIsAddColOpen] = useState(false)
  const [newColTitle, setNewColTitle] = useState('')
  const [colToDelete, setColToDelete] = useState<any>(null)
  const [isDeleteColOpen, setIsDeleteColOpen] = useState(false)
  const [collapsedColumns, setCollapsedColumns] = useState<string[]>([])
  const [isAiPrioritizing, setIsAiPrioritizing] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    fetchColumns()
  }, [projectId])

  useEffect(() => {
    if (selectedTask) {
      fetchComments(selectedTask.id)
    }
  }, [selectedTask])

  const fetchColumns = async () => {
    if (!projectId) return
    try {
      const res = await fetch(`/api/projects/${projectId}/columns`)
      const data = await res.json()
      if (data.columns) setColumns(data.columns)
    } catch (err) {
      console.error('Fetch columns error:', err)
    }
  }

  const handleAiPrioritize = async () => {
    if (!projectId || isAiPrioritizing) return
    setIsAiPrioritizing(true)
    try {
      // Filter tasks in "Todo" (or current status-based column)
      const todoTasks = tasks.filter(t => t.status === 'Todo')
      const res = await fetch('/api/ai/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: todoTasks })
      })
      if (res.ok) {
        const { order } = await res.json()
        if (Array.isArray(order)) {
          // Re-order tasks and potentially update their priority in DB if needed, 
          // but for now let's just re-order them in the view.
          // Real apps would persistent this order via a 'position' field.
          const taskMap = new Map(tasks.map(t => [t.id, t]))
          const newTasks = [...tasks]
          // Simple reordering for the sake of demonstration
          const reordered = order.map(id => taskMap.get(id)).filter(Boolean) as Task[]
          const otherTasks = tasks.filter(t => !order.includes(t.id))
          onTasksChange([...reordered, ...otherTasks])
        }
      }
    } catch (err) {
      console.error('AI Prioritize error:', err)
    } finally {
      setIsAiPrioritizing(false)
    }
  }

  const toggleColumnCollapse = (columnId: string) => {
    setCollapsedColumns(prev => 
      prev.includes(columnId) ? prev.filter(c => c !== columnId) : [...prev, columnId]
    )
  }

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    // Optimistic update
    onTasksChange(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t))

    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, ...updates })
      })
    } catch (err) {
      console.error('Update task error:', err)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesAssignee = filterAssignee === 'all' || task.assignee_id?.toString() === filterAssignee
    const matchesFocus = !focusMode || task.assignee_id === currentUser?.id
    return matchesSearch && matchesPriority && matchesAssignee && matchesFocus
  })

  // Dynamic board columns based on groupBy
  const boardColumns = useMemo(() => {
    if (groupBy === 'status') return columns.length > 0 ? columns : COLUMNS
    if (groupBy === 'priority') {
      return [
        { id: 'High', title: 'High', color: 'bg-red-500' },
        { id: 'Medium', title: 'Medium', color: 'bg-yellow-500' },
        { id: 'Low', title: 'Low', color: 'bg-blue-500' }
      ]
    }
    if (groupBy === 'assignee') {
      const assignedMembers = members || []
      const cols = assignedMembers.map(m => ({
        id: m.id.toString(),
        title: m.name,
        color: 'bg-primary'
      }))
      cols.push({ id: 'unassigned', title: 'Unassigned', color: 'bg-zinc-500' })
      return cols
    }
    return columns
  }, [groupBy, columns, members])

  const fetchComments = async (taskId: number) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`)
      const data = await res.json()
      if (data.comments) setComments(data.comments)
    } catch (err) {
      console.error('Fetch comments error:', err)
    }
  }

  const handleAddComment = async () => {
    if (!newComment || !selectedTask) return
    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      })
      if (res.ok) {
        setNewComment('')
        fetchComments(selectedTask.id)
      }
    } catch (err) {
      console.error('Comment error:', err)
    }
  }

  const handleAiTaskBreakdown = async () => {
    if (!selectedTask) return
    setIsAiBreakingDown(true)
    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}/breakdown`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setSelectedTask(data.task)
        onTasksChange(tasks.map(t => t.id === data.task.id ? data.task : t))
      }
    } catch (err) {
      console.error('AI Breakdown error:', err)
    } finally {
      setIsAiBreakingDown(false)
    }
  }

  const onDragEnd = async (event: any) => {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    if (!activeTask) return

    // If dropped over a column or another task in a different column
    const overId = over.id
    const overColumn = boardColumns.find((c: any) => c.title === overId || c.id.toString() === overId.toString())
    
    let updates: Partial<Task> = {}
    
    if (groupBy === 'status') {
      let newStatus = activeTask.status
      if (overColumn) {
        newStatus = overColumn.title
      } else {
        const overTask = tasks.find(t => t.id === overId)
        if (overTask) newStatus = overTask.status
      }
      if (newStatus !== activeTask.status) updates.status = newStatus
    } else if (groupBy === 'priority') {
      let newPriority = activeTask.priority
      if (overColumn) {
        newPriority = overColumn.id as any
      } else {
        const overTask = tasks.find(t => t.id === overId)
        if (overTask) newPriority = overTask.priority
      }
      if (newPriority !== activeTask.priority) updates.priority = newPriority
    } else if (groupBy === 'assignee') {
      let newAssignee = activeTask.assignee_id
      if (overColumn) {
        newAssignee = overColumn.id === 'unassigned' ? null : parseInt(overColumn.id)
      } else {
        const overTask = tasks.find(t => t.id === overId)
        if (overTask) newAssignee = overTask.assignee_id
      }
      if (newAssignee !== activeTask.assignee_id) updates.assignee_id = newAssignee
    }

    // If moving to 'In Progress', check if task is blocked
    const updatedStatus = updates.status || activeTask.status;
    const isBlocked = activeTask.blocked_by_ids && activeTask.blocked_by_ids.length > 0;
    if (updatedStatus === 'In Progress' && isBlocked) {
      // Check if any blocker is NOT 'Done'
      const blockingTasks = tasks.filter(t => activeTask.blocked_by_ids?.includes(t.id))
      const hasIncompleteBlockers = blockingTasks.some(t => t.status !== 'Done')
      if (hasIncompleteBlockers) {
        alert(`This task is blocked by ${blockingTasks.filter(t => t.status !== 'Done').map(t => t.title).join(', ')}`)
        return
      }
    }

    if (Object.keys(updates).length > 0) {
      onTasksChange(tasks.map(t => t.id === active.id ? { ...t, ...updates } : t))

      // Sync with DB
      fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: active.id, ...updates })
      })
    }
  }

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newColTitle) return
    try {
      const res = await fetch(`/api/projects/${projectId}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newColTitle })
      })
      if (res.ok) {
        setNewColTitle('')
        setIsAddColOpen(false)
        fetchColumns()
      }
    } catch (err) {
      console.error('Add column error:', err)
    }
  }

  const handleDeleteColumn = async () => {
    if (!colToDelete) return
    try {
      const res = await fetch(`/api/projects/${projectId}/columns`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId: colToDelete.id })
      })
      if (res.ok) {
        setIsDeleteColOpen(false)
        setColToDelete(null)
        fetchColumns()
      }
    } catch (err) {
      console.error('Delete column error:', err)
    }
  }

  const handleAddTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle || !newTaskStatus) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          project_id: projectId,
          status: newTaskStatus,
          description: newTaskDesc,
          due_date: newTaskDeadline,
          assignee_id: newTaskAssignee ? parseInt(newTaskAssignee) : null,
          priority: newTaskPriority
        })
      })
      if (res.ok) {
        const data = await res.json()
        onTasksChange([...tasks, data.task])
        setNewTaskTitle('')
        setNewTaskDesc('')
        setNewTaskDeadline('')
        setNewTaskAssignee('')
        setNewTaskPriority('Medium')
        setIsAddTaskOpen(false)
      }
    } catch (err) {
      console.error('Add task error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={onDragEnd}
      >
        <ScrollArea className="h-full w-full">
          <div className="flex gap-6 p-8 h-full min-w-max">
            {boardColumns.map((column: any) => {
              const isCollapsed = collapsedColumns.includes(column.id.toString())
              const columnTasks = filteredTasks.filter(t => {
                if (groupBy === 'status') return (t.status || 'Todo') === column.title
                if (groupBy === 'priority') return (t.priority || 'Medium') === column.id
                if (groupBy === 'assignee') {
                  if (column.id === 'unassigned') return !t.assignee_id
                  return t.assignee_id?.toString() === column.id
                }
                return (t.status || 'Todo') === column.title
              })

              return (
                <div 
                  key={column.id} 
                  className={cn("kanban-column flex flex-col gap-4 transition-all duration-300", 
                    isCollapsed ? "w-16" : "w-80")}
                >
                  <div className="flex items-center justify-between px-2 mb-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className={cn("size-2 rounded-full shrink-0", column.color || 'bg-zinc-500')} />
                      {!isCollapsed && (
                        <>
                          <h3 className="text-sm font-bold text-white tracking-widest uppercase truncate">{column.title}</h3>
                          <Badge variant="outline" className="bg-white/5 border-white/5 text-[10px] text-zinc-500 px-2 shrink-0">
                            {columnTasks.length}
                          </Badge>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {column.id === 'Todo' && groupBy === 'status' && !isCollapsed && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleAiPrioritize}
                          disabled={isAiPrioritizing}
                          className="size-7 text-primary hover:bg-primary/10 rounded-lg"
                          title="AI Prioritize"
                        >
                          {isAiPrioritizing ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} className="fill-current" />}
                        </Button>
                      )}
                      <button 
                        onClick={() => toggleColumnCollapse(column.id.toString())} 
                        className="text-zinc-600 hover:text-white transition-colors p-1"
                      >
                        {isCollapsed ? <ChevronRight size={14} /> : <MoreHorizontal size={14} />}
                      </button>
                    </div>
                  </div>

                  {!isCollapsed ? (
                    <SortableContext
                      id={column.id.toString()}
                      items={columnTasks.map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <KanbanDroppableColumn id={column.id.toString()}>
                        <div className="space-y-3 min-h-[500px] flex flex-col bg-white/2 rounded-3xl p-2 border border-dashed border-white/5 group-hover:border-primary/20 transition-all">
                          {columnTasks.map((task) => (
                            <SortableTaskCard
                              key={task.id}
                              task={task}
                              members={members}
                              onClick={() => setSelectedTask(task)}
                              onUpdate={handleUpdateTask}
                            />
                          ))}

                          <button
                            onClick={() => { 
                              if (groupBy === 'status') setNewTaskStatus(column.title)
                              setIsAddTaskOpen(true); 
                            }}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-white/5 text-zinc-600 hover:border-primary/20 hover:text-primary transition-all group mt-auto"
                          >
                            <Plus size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Add Task</span>
                          </button>
                        </div>
                      </KanbanDroppableColumn>
                    </SortableContext>
                  ) : (
                    <div 
                      onClick={() => toggleColumnCollapse(column.id.toString())}
                      className="flex-1 bg-white/2 rounded-2xl border border-white/5 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all"
                    >
                      <div className="rotate-90 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 whitespace-nowrap">
                        {column.title} ({columnTasks.length})
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add Column Button */}
            <div className="w-80 flex flex-col gap-4">
              <Dialog open={isAddColOpen} onOpenChange={setIsAddColOpen}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-center gap-2 py-12 rounded-[32px] border-2 border-dashed border-white/5 text-zinc-600 hover:border-primary/40 hover:text-primary transition-all group bg-white/2">
                    <Plus size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Add Column</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-md">
                  <DialogHeader className="space-y-4">
                    <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                      <Plus size={24} />
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">New Column</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddColumn} className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Column Title</Label>
                      <Input
                        autoFocus
                        placeholder="e.g. Backlog"
                        value={newColTitle}
                        onChange={(e) => setNewColTitle(e.target.value)}
                        className="bg-white/5 border-white/10 rounded-xl h-12"
                      />
                    </div>
                    <Button type="submit" disabled={!newColTitle} className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl">
                      Create Column
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Delete Column Confirmation */}
          <Dialog open={isDeleteColOpen} onOpenChange={setIsDeleteColOpen}>
            <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-sm">
              <DialogHeader className="space-y-4">
                <div className="size-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">Delete Column?</DialogTitle>
                  <DialogDescription className="text-zinc-500 text-sm">
                    Are you sure you want to delete <span className="text-white font-bold">{colToDelete?.title}</span>? Tasks will remain but their status will be unassigned.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <DialogFooter className="flex flex-col gap-3 mt-6">
                <Button
                  variant="destructive"
                  className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]"
                  onClick={handleDeleteColumn}
                >
                  Delete Column
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] text-zinc-500 hover:text-white"
                  onClick={() => setIsDeleteColOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DndContext>

      {/* Task Detail Sheet */}
      <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent className="w-full sm:max-w-xl bg-[#0A0A0A] border-l border-white/5 text-white p-0 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-8 space-y-8">
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={cn("border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                    selectedTask?.priority === 'High' ? "text-red-400 bg-red-400/10" : "text-primary bg-primary/10"
                  )}>
                    {selectedTask?.priority}
                  </Badge>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{selectedTask?.status}</span>
                </div>
                <SheetTitle className="text-3xl font-bold text-white tracking-tight leading-tight">
                  {selectedTask?.title}
                </SheetTitle>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Assignee</p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="size-8">
                      <AvatarImage src={members?.find(m => m.id === selectedTask?.assignee_id)?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${members?.find(m => m.id === selectedTask?.assignee_id)?.name || selectedTask?.assignee_id || 1}`} />
                    </Avatar>
                    <span className="text-sm font-bold">{members?.find(m => m.id === selectedTask?.assignee_id)?.name || 'Unassigned'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Due Date</p>
                  <div className="flex items-center gap-3 pt-2 text-zinc-300">
                    <Calendar className="size-5 text-primary" />
                    <span className="text-sm font-bold italic">
                      {selectedTask?.due_date ? format(new Date(selectedTask.due_date), 'MMMM d, yyyy') : 'No date set'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedTask?.blocked_by_ids && selectedTask.blocked_by_ids.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Blocked By</p>
                  <div className="space-y-2">
                    {tasks.filter(t => selectedTask.blocked_by_ids?.includes(t.id)).map(blocker => (
                      <div key={blocker.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                        <AlertCircle size={14} className="text-red-500" />
                        <span className="text-xs font-bold">{blocker.title}</span>
                        <Badge variant="outline" className="ml-auto text-[8px] uppercase">{blocker.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Subtasks</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAiTaskBreakdown}
                    disabled={isAiBreakingDown}
                    className="text-primary hover:bg-primary/10 gap-2 h-8"
                  >
                    {isAiBreakingDown ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                    AI Breakdown
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedTask?.subtasks && Array.isArray(selectedTask.subtasks) && selectedTask.subtasks.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTask.subtasks.map((st: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                          <CheckSquare size={16} className={st.completed ? "text-primary" : "text-zinc-600"} />
                          <span className={cn("text-xs font-medium", st.completed ? "text-zinc-500 line-through" : "text-zinc-300")}>{st.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                      <AlertCircle className="size-8 text-zinc-600" />
                      <p className="text-sm text-zinc-500 max-w-[200px]">No subtasks yet. Let AI break down this task for you.</p>
                      <Button onClick={handleAiTaskBreakdown} disabled={isAiBreakingDown} className="bg-white text-black hover:bg-zinc-200 rounded-xl px-6">Generate Breakdown</Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Comments</h3>
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                      <Avatar className="size-8 ring-2 ring-black">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`} />
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-white">{comment.user_name || 'Anonymous'}</span>
                          <span className="text-[10px] text-zinc-600 font-bold uppercase">{format(new Date(comment.created_at), 'HH:mm')}</span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">{comment.content}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-4 pt-4">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-zinc-800 text-[10px]">U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none transition-all"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          className="bg-primary text-white hover:bg-primary/80 rounded-lg px-6 font-bold shadow-lg shadow-primary/20"
                        >
                          <Send size={14} className="mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-lg overflow-hidden">
          <DialogHeader className="space-y-4">
            <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Plus size={24} />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">New Task</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm">
                Add a new task to <span className="text-white font-bold">{newTaskStatus}</span>
              </DialogDescription>
            </div>
          </DialogHeader>
          <form onSubmit={handleAddTaskSubmit} className="space-y-6 mt-6">
            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Task Title</Label>
                <Input
                  autoFocus
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Description</Label>
                <textarea
                  placeholder="Details about this task..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/40 h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Priority</Label>
                  <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0D0D0D] border-white/5 text-white">
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Deadline</Label>
                  <Input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="bg-white/5 border-white/10 h-12 rounded-xl invert brightness-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Assignee</Label>
                <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0D0D0D] border-white/5 text-white">
                    {members?.map(m => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting || !newTaskTitle}
                className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest"
              >
                {isSubmitting ? "Creating..." : "Initialize Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const KanbanDroppableColumn = ({ id, children }: { id: string, children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className="h-full">
      {children}
    </div>
  )
}
