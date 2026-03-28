'use client'

import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Plus, 
  Zap, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Share2, 
  Settings2,
  Calendar,
  Users as UsersIcon,
  MessageSquare,
  Paperclip,
  Clock as ClockIcon,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  List as ListIcon,
  CalendarDays,
  CheckSquare,
  AlertCircle,
  Pencil,
  Sparkles,
  UserPlus,
  Layers,
  Loader2,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from '@/lib/utils'
import { KanbanBoard } from '@/components/dashboard/kanban-board'
import gsap from 'gsap'

import { ListView } from '@/components/dashboard/list-view'
import { TimelineView } from '@/components/dashboard/timeline-view'
import { WireframeBoard } from '@/components/dashboard/wireframe-board'

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'kanban' | 'list' | 'timeline' | 'wireframe'>('kanban')
  const [aiGoal, setAiGoal] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false)
  
  const [members, setMembers] = useState<any[]>([])
  const [shareEmail, setShareEmail] = useState('')
  const [isShareLoading, setIsShareLoading] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  
  const [isTeamOpen, setIsTeamOpen] = useState(false)
  const [isTeamLoading, setIsTeamLoading] = useState(false)
  const [isDocGenerating, setIsDocGenerating] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [memberToRemove, setMemberToRemove] = useState<any>(null)
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false)

  // New Task States
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isDescGenerating, setIsDescGenerating] = useState(false)

  // Notifications
  const [notification, setNotification] = useState<{title: string, desc: string} | null>(null)

  const headerRef = useRef<HTMLElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true)
    try {
      const [projectRes, tasksRes, membersRes, meRes] = await Promise.all([
        fetch(`/api/projects/${slug}`),
        fetch(`/api/projects/${slug}/tasks`),
        fetch(`/api/projects/${slug}/members`),
        fetch(`/api/auth/me`)
      ])
      
      const projectData = await projectRes.json()
      const tasksData = await tasksRes.json()
      const membersData = await membersRes.json()
      const meData = await meRes.json()
      
      if (projectData.project) setProject(projectData.project)
      if (meData.user) setCurrentUser(meData.user)
      
      // Real-time notification check: If tasks increased and last task is assigned to me
      if (tasksData.tasks && tasksData.tasks.length > tasks.length && !isInitial) {
        const lastTask = tasksData.tasks[tasksData.tasks.length - 1]
        setNotification({
          title: "New Task Assigned",
          desc: `You have been assigned: ${lastTask.title}`
        })
        setTimeout(() => setNotification(null), 5000)
      }

      if (tasksData.tasks) setTasks(tasksData.tasks)
      if (membersData.members) setMembers(membersData.members)
      
      if (projectRes.status === 404) {
        router.push('/dashboard/projects')
      }
    } catch (err) {
      console.error('Project fetch error:', err)
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [slug, tasks.length])

  // Polling for real-time updates (every 5 seconds)
  useEffect(() => {
    fetchData(true)
    const interval = setInterval(() => fetchData(), 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shareEmail) return
    setIsShareLoading(true)
    try {
      const res = await fetch(`/api/projects/${slug}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: shareEmail })
      })
      if (res.ok) {
        setShareEmail('')
        setIsShareOpen(false)
        fetchData()
      }
    } catch (err) {
      console.error('Share error:', err)
    } finally {
      setIsShareLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle) return
    
    try {
      const res = await fetch(`/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          project_id: project?.id,
          due_date: newTaskDeadline,
          assignee_id: newTaskAssignee ? parseInt(newTaskAssignee) : null,
          status: 'Todo'
        })
      })
      if (res.ok) {
        setNewTaskTitle('')
        setNewTaskDesc('')
        setNewTaskDeadline('')
        setNewTaskAssignee('')
        setIsTaskDialogOpen(false)
        fetchData()
      }
    } catch (err) {
      console.error('Create task error:', err)
    }
  }

  const handleUpdateMemberRole = async (userId: number, role: string) => {
    try {
      const res = await fetch(`/api/projects/${slug}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role })
      })
      if (res.ok) fetchData()
    } catch (err) {
      console.error('Update role error:', err)
    }
  }

  const handleRemoveMember = async () => {
    if (!memberToRemove) return
    try {
      const res = await fetch(`/api/projects/${slug}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberToRemove.id })
      })
      if (res.ok) {
        setIsRemoveMemberOpen(false)
        setMemberToRemove(null)
        fetchData()
      }
    } catch (err) {
      console.error('Remove member error:', err)
    }
  }
  const handleGenerateDescription = async () => {
    if (!newTaskTitle) return
    setIsDescGenerating(true)
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle })
      })
      if (res.ok) {
        const data = await res.json()
        setNewTaskDesc(data.description)
      }
    } catch (err) {
      console.error('AI Describe error:', err)
    } finally {
      setIsDescGenerating(false)
    }
  }

  const handleGenerateDoc = async () => {
    setIsDocGenerating(true)
    try {
      const res = await fetch('/api/ai/generate-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project?.id })
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/dashboard/docs/${data.doc.id}`)
      }
    } catch (err) {
      console.error('Doc generation error:', err)
    } finally {
      setIsDocGenerating(false)
    }
  }

  useLayoutEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.out'
      })
    })
    return () => ctx.revert()
  }, [loading])

  if (loading) {
    return (
      <div className="flex-1 bg-[#0A0A0A] p-8 flex flex-col items-center justify-center space-y-4">
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Syncing Workspace...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen bg-[#0A0A0A] flex flex-col animate-in fade-in duration-700 overflow-hidden">
      
      {/* Real-time Notification Alert */}
      {notification && (
        <div className="fixed top-24 right-8 z-[100] w-80 animate-in slide-in-from-right duration-500">
          <Alert className="bg-primary border-none text-white shadow-2xl">
            <Zap className="h-4 w-4 fill-white" />
            <AlertTitle className="font-black uppercase tracking-widest text-[10px]">{notification.title}</AlertTitle>
            <AlertDescription className="text-xs font-medium opacity-90">
              {notification.desc}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Project Header */}
      <header ref={headerRef} className="border-b border-white/5 px-8 py-6 bg-[#0D0D0D]/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{project?.name}</h1>
              <Badge className="bg-green-500/10 text-green-500 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-green-500/5">Agency Active</Badge>
            </div>
            <div className="flex items-center gap-6 text-[11px] font-medium text-zinc-500">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>Slug: /projects/{slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon size={14} className="text-primary" />
                <span>{members.length} Collaborators</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
                <span>Live Sync Enabled</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-4 overflow-hidden">
              {members.map((member) => (
                <div key={member.id} className="group relative">
                  <Avatar className="size-9 border-2 border-[#0D0D0D] transition-transform hover:scale-110 cursor-pointer shadow-xl shadow-black/40">
                    <AvatarImage src={member.avatar_url || `https://i.pravatar.cc/150?u=${member.id}`} />
                    <AvatarFallback className="bg-zinc-800 text-[10px] uppercase">{member.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {member.name} • {member.role || 'Member'}
                  </div>
                </div>
              ))}
            </div>
            
             <Separator orientation="vertical" className="h-8 bg-white/5 mr-2 hidden sm:block" />
            
            <div className="flex items-center gap-2">
              <Dialog open={isTeamOpen} onOpenChange={setIsTeamOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-10 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl mr-1">
                    <UsersIcon size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
                  <DialogHeader className="space-y-4">
                    <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                      <UsersIcon size={24} />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold tracking-tight">Team Management</DialogTitle>
                      <DialogDescription className="text-zinc-500 text-sm italic">
                        Manage roles, collaborators and project ownership
                      </DialogDescription>
                    </div>
                  </DialogHeader>

                  <div className="mt-8 flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Project Members</h4>
                      <div className="space-y-3">
                        {members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-4">
                              <Avatar className="size-10">
                                <AvatarImage src={member.avatar_url || `https://i.pravatar.cc/150?u=${member.id}`} />
                                <AvatarFallback className="bg-zinc-800">{member.name?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-bold text-white">{member.name}</p>
                                <p className="text-[10px] text-zinc-500 font-medium">{member.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Badge className={cn("px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-none", 
                                member.role === 'owner' ? "bg-primary text-white" : 
                                member.role === 'admin' ? "bg-amber-500/20 text-amber-500" : "bg-white/10 text-zinc-500"
                              )}>
                                {member.role}
                              </Badge>

                              {/* Only owner or admins can manage roles, and can't manage the owner */}
                              {((members.find(m => m.id === currentUser?.id)?.role === 'owner' || members.find(m => m.id === currentUser?.id)?.role === 'admin')) && member.role !== 'owner' && member.id !== currentUser?.id && (
                                <Select 
                                  defaultValue={member.role} 
                                  onValueChange={(val) => handleUpdateMemberRole(member.id, val)}
                                >
                                  <SelectTrigger className="w-24 h-8 bg-transparent border-white/10 text-[10px] uppercase font-black">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#0D0D0D] border-white/5 text-white">
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}

                              {members.find(m => m.id === currentUser?.id)?.role === 'owner' && member.role !== 'owner' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="size-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                                  onClick={() => { setMemberToRemove(member); setIsRemoveMemberOpen(true); }}
                                >
                                  <AlertCircle size={14} />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="mt-8 pt-6 border-t border-white/5">
                    <Button onClick={() => { setIsTeamOpen(false); setIsShareOpen(true); }} className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-12 font-bold uppercase tracking-widest text-[11px]">
                      Add New Member
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Remove Member Confirmation */}
              <Dialog open={isRemoveMemberOpen} onOpenChange={setIsRemoveMemberOpen}>
                <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-sm">
                  <DialogHeader className="space-y-4">
                    <div className="size-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold">Remove Member?</DialogTitle>
                      <DialogDescription className="text-zinc-500 text-sm">
                        Are you sure you want to remove <span className="text-white font-bold">{memberToRemove?.name}</span>? They will lose access to this project.
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col gap-3 mt-6">
                    <Button 
                      variant="destructive"
                      className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]"
                      onClick={handleRemoveMember}
                    >
                      Remove Member
                    </Button>
                    <Button 
                      variant="ghost"
                      className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] text-zinc-500 hover:text-white"
                      onClick={() => setIsRemoveMemberOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-10 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl">
                    <UserPlus size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-md">
                  <DialogHeader className="space-y-4">
                    <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                      <Share2 size={24} />
                    </div>
                    <div className="space-y-1">
                      <DialogTitle className="text-2xl font-bold tracking-tight">Invite Teammate</DialogTitle>
                      <DialogDescription className="text-zinc-500 text-sm">
                        Add users to <span className="text-white font-bold">{project?.name}</span>
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                  <form onSubmit={handleShare} className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Email Address</Label>
                      <Input 
                        placeholder="colleague@agency.com"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        className="bg-white/5 border-white/10 h-12 rounded-xl"
                      />
                    </div>
                    <Button type="submit" disabled={isShareLoading} className="w-full h-12 bg-white text-black hover:bg-zinc-200">
                      {isShareLoading ? "Sending..." : "Send Invitation"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-zinc-200 gap-2 h-11 px-6 rounded-xl font-bold shadow-xl shadow-white/5 transition-all active:scale-95">
                    <Plus size={18} />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-lg overflow-hidden">
                  <DialogHeader className="space-y-4">
                    <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                      <Pencil size={24} />
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">Architect New Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTask} className="space-y-6 mt-6">
                    <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Task Title</Label>
                        <Input 
                          placeholder="e.g. Design System Audit" 
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          className="bg-white/5 border-white/10 h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Description</Label>
                          <Button 
                            type="button" 
                            onClick={handleGenerateDescription}
                            disabled={isDescGenerating || !newTaskTitle}
                            variant="ghost" 
                            className="h-6 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10"
                          >
                            <Sparkles size={12} className="mr-1" />
                            {isDescGenerating ? "Thinking..." : "AI Describe"}
                          </Button>
                        </div>
                        <textarea 
                          placeholder="What needs to be done?"
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/40 h-24 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Deadline</Label>
                          <Input 
                            type="date"
                            value={newTaskDeadline}
                            onChange={(e) => setNewTaskDeadline(e.target.value)}
                            className="bg-white/5 border-white/10 h-12 rounded-xl invert brightness-0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Assignee</Label>
                          <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                            <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0D0D0D] border-white/5 text-white">
                              {members.map(m => (
                                <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <Button type="submit" disabled={!newTaskTitle} className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest">
                      Initialize Task
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={handleGenerateDoc}
                disabled={isDocGenerating}
                className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11 px-6 flex items-center gap-2 group shadow-xl shadow-primary/20"
              >
                {isDocGenerating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileText size={18} className="group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[10px] uppercase tracking-widest">{isDocGenerating ? 'Generating...' : 'Full Doc'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 gap-4">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
            <button onClick={() => setView('kanban')} className={cn("view-tab", view === 'kanban' && "active")}>
              <LayoutGrid size={14} /> Kanban
            </button>
            <button onClick={() => setView('list')} className={cn("view-tab", view === 'list' && "active")}>
              <ListIcon size={14} /> List
            </button>
            <button onClick={() => setView('timeline')} className={cn("view-tab", view === 'timeline' && "active")}>
              <CalendarDays size={14} /> Timeline
            </button>
            <button onClick={() => setView('wireframe')} className={cn("view-tab", view === 'wireframe' && "active")}>
              <Layers size={14} /> Wireframe
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input 
                placeholder="Find tasks..." 
                className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary/40 w-full md:w-72 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Area */}
      <main ref={boardRef} className="flex-1 overflow-auto flex flex-col">
        {view === 'kanban' && (
          <KanbanBoard tasks={tasks} projectId={project?.id} onTasksChange={setTasks} members={members} />
        )}
        {view === 'list' && (
          <ListView tasks={tasks} onTaskClick={(task) => {}} />
        )}
        {view === 'timeline' && (
          <TimelineView tasks={tasks} onTaskClick={(task) => {}} />
        )}
        {view === 'wireframe' && (
          <WireframeBoard projectId={project?.id} />
        )}
      </main>

      <style jsx>{`
        .view-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #71717a;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .view-tab.active {
          background: white;
          color: black;
          box-shadow: 0 20px 25px -5px rgba(255, 255, 255, 0.1);
        }
        .view-tab:hover:not(.active) {
          color: #d4d4d8;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
