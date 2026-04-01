'use client'

import React, { useState, useEffect } from 'react'
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

interface Task {
  id: number
  title: string
  description?: string
  status: string
  priority: 'High' | 'Medium' | 'Low'
  due_date?: string
  assignee_id?: number
  subtasks?: any[]
  comments_count?: number
  created_at: string
}

interface KanbanBoardProps {
  tasks: Task[]
  projectId: number
  onTasksChange: (tasks: Task[]) => void
  members?: any[]
}

const COLUMNS = [
  { id: 'Todo', title: 'To Do', color: 'bg-zinc-500' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-primary' },
  { id: 'In Review', title: 'In Review', color: 'bg-amber-500' },
  { id: 'Done', title: 'Done', color: 'bg-green-500' },
]

const SortableTaskCard = ({ task, onClick, members }: { task: Task, onClick: () => void, members?: any[] }) => {
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
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      default: return 'text-zinc-400 bg-zinc-400/10'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <Card className="bg-[#0D0D0D] border-white/5 p-4 rounded-2xl group hover:border-primary/40 hover:bg-[#111111] transition-all cursor-pointer shadow-xl shadow-black/20 mb-3">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Badge className={cn("border px-2 py-0 text-[9px] font-black uppercase tracking-wider", getPriorityColor(task.priority))}>
              {task.priority || 'Medium'}
            </Badge>
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

export const KanbanBoard = ({ tasks, projectId, onTasksChange, members }: KanbanBoardProps) => {
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
    try {
      const res = await fetch(`/api/projects/${projectId}/columns`)
      const data = await res.json()
      if (data.columns) setColumns(data.columns)
    } catch (err) {
      console.error('Fetch columns error:', err)
    }
  }

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
    const overColumn = columns.find(c => c.title === overId || c.id.toString() === overId.toString())

    let newStatus = activeTask.status
    if (overColumn) {
      newStatus = overColumn.title
    } else {
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) newStatus = overTask.status
    }

    if (newStatus !== activeTask.status) {
      const updatedTasks = tasks.map(t => t.id === active.id ? { ...t, status: newStatus } : t)
      onTasksChange(updatedTasks)

      // Sync with DB
      fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: active.id, status: newStatus })
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
            {columns.map((column) => {
              const columnTasks = tasks.filter(t => (t.status || 'Todo') === column.title)
              return (
                <div key={column.id} className="kanban-column w-80 flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className={cn("size-2 rounded-full", column.color || 'bg-zinc-500')} />
                      <h3 className="text-sm font-bold text-white tracking-widest uppercase">{column.title}</h3>
                      <Badge variant="outline" className="bg-white/5 border-white/5 text-[10px] text-zinc-500 px-2">
                        {columnTasks.length}
                      </Badge>
                    </div>
                    <button onClick={() => { setColToDelete(column); setIsDeleteColOpen(true); }} className="text-zinc-600 hover:text-red-500 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  <SortableContext
                    id={column.title}
                    items={columnTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <KanbanDroppableColumn id={column.title}>
                      <div className="space-y-3 min-h-[500px] flex flex-col bg-white/[0.02] rounded-3xl p-2 border border-dashed border-white/5 group-hover:border-primary/20 transition-all">
                        {columnTasks.map((task) => (
                          <SortableTaskCard
                            key={task.id}
                            task={task}
                            members={members}
                            onClick={() => setSelectedTask(task)}
                          />
                        ))}

                        <button
                          onClick={() => { setNewTaskStatus(column.title); setIsAddTaskOpen(true); }}
                          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-white/5 text-zinc-600 hover:border-primary/20 hover:text-primary transition-all group mt-auto"
                        >
                          <Plus size={16} className="group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Add Task</span>
                        </button>
                      </div>
                    </KanbanDroppableColumn>
                  </SortableContext>
                </div>
              )
            })}

            {/* Add Column Button */}
            <div className="w-80 flex flex-col gap-4">
              <Dialog open={isAddColOpen} onOpenChange={setIsAddColOpen}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-center gap-2 py-12 rounded-[32px] border-2 border-dashed border-white/5 text-zinc-600 hover:border-primary/40 hover:text-primary transition-all group bg-white/[0.02]">
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
