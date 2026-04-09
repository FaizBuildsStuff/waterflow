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
  FileText,
  Shield,
  UserMinus,
  ArrowLeftRight,
  ShieldAlert
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleColor, setNewRoleColor] = useState('#1a7fe0')
  const [projectRoles, setProjectRoles] = useState<any[]>([])

  // New Task States
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isDescGenerating, setIsDescGenerating] = useState(false)

  // View & Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterAssignee, setFilterAssignee] = useState<string>('all')
  const [groupBy, setGroupBy] = useState<'status' | 'priority' | 'assignee'>('status')
  const [focusMode, setFocusMode] = useState(false)

  // Notifications
  const [notification, setNotification] = useState<{ title: string, desc: string } | null>(null)

  const headerRef = useRef<HTMLElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true)
    try {
      const [projectRes, tasksRes, membersRes, meRes, rolesRes] = await Promise.all([
        fetch(`/api/projects/${slug}`),
        fetch(`/api/projects/${slug}/tasks`),
        fetch(`/api/projects/${slug}/members`),
        fetch(`/api/auth/me`),
        fetch(`/api/projects/${slug}/roles`)
      ])

      const projectData = projectRes.ok ? await projectRes.json() : {}
      const tasksData = tasksRes.ok ? await tasksRes.json() : { tasks: [] }
      const membersData = membersRes.ok ? await membersRes.json() : { members: [] }
      const meData = meRes.ok ? await meRes.json() : {}
      const rolesData = rolesRes.ok ? await rolesRes.json() : { roles: [] }

      if (projectData.project) setProject(projectData.project)
      if (meData.user) setCurrentUser(meData.user)
      if (rolesData.roles) setProjectRoles(rolesData.roles)

      // Real-time notification check: If tasks increased and last task is assigned to me
      if (tasksData.tasks && tasksData.tasks.length > tasks.length && !isInitial) {
        const lastTask = tasksData.tasks[tasksData.tasks.length - 1]
        setNotification({
          title: "New Task Assigned",
          desc: `You have been assigned: ${lastTask.title}`
        })
        setTimeout(() => setNotification(null), 5000)
      }

      setTasks(tasksData.tasks || [])
      setMembers(membersData.members || [])

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

  const handleUpdateMemberRole = async (userId: number, role: string, roleId?: number) => {
    try {
      const res = await fetch(`/api/projects/${slug}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role, roleId })
      })
      if (res.ok) fetchData()
    } catch (err) {
      console.error('Update role error:', err)
    }
  }

  const handleCreateRole = async () => {
    if (!newRoleName) return
    setIsShareLoading(true)
    try {
      const res = await fetch(`/api/projects/${slug}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName, color: newRoleColor })
      })
      if (res.ok) {
        setNewRoleName('')
        setIsCreateRoleOpen(false)
        fetchData()
        setNotification({
          title: "Role Created",
          desc: `${newRoleName} is now available for assignment.`
        })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch (err) {
      console.error('Create role error:', err)
    } finally {
      setIsShareLoading(false)
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
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Loading Project Details...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 h-screen bg-[#0A0A0A] flex flex-col overflow-hidden animate-in fade-in duration-700">

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
      <header ref={headerRef} className="border-b border-white/5 px-8 pt-12 pb-8 bg-[#0D0D0D]/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" /> Project Active
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white/95 leading-[0.9]">
              {project?.name}<span className="text-primary">.</span>
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary/60" />
                <span>/projects/{slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon size={14} className="text-primary/60" />
                <span>{members.length} Members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-pulse" />
                <span>Sync Active</span>
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

            <div className="flex items-center justify-between gap-2 p-2 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md w-full max-w-full overflow-hidden">

              {/* LEFT: Team & Invite Triggers */}
              <div className="flex items-center gap-1 shrink-0">
                <Dialog open={isTeamOpen} onOpenChange={setIsTeamOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="group size-10 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                      <UsersIcon size={18} className="group-hover:scale-110 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0A0A0A] border-white/10 text-white rounded-[2rem] p-0 max-w-2xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
                    <div className="p-8 pb-4">
                      <DialogHeader className="flex flex-row items-center gap-5 space-y-0">
                        <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                          <UsersIcon size={28} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <DialogTitle className="text-2xl font-bold tracking-tight mb-1 truncate">Team Management</DialogTitle>
                          <DialogDescription className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] truncate">
                            {members.length} Active Members
                          </DialogDescription>
                        </div>
                      </DialogHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Project Members</h4>
                        <div className="grid gap-2">
                          {members.map((member) => (
                            <div key={member.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="relative shrink-0">
                                  <Avatar className="size-11 border-2 border-transparent group-hover:border-primary/50 transition-all">
                                    <AvatarImage src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`} />
                                    <AvatarFallback className="bg-zinc-800 text-xs">{member.name?.[0]}</AvatarFallback>
                                  </Avatar>
                                  {member.role === 'owner' && <div className="absolute -top-1 -right-1 size-4 bg-primary rounded-full border-2 border-[#0A0A0A]" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-zinc-100 truncate">{member.name}</p>
                                  <p className="text-[11px] text-zinc-500 font-mono italic truncate">{member.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {((members.find(m => m.id === currentUser?.id)?.role === 'owner' || members.find(m => m.id === currentUser?.id)?.role === 'admin') && member.id !== currentUser?.id) ? (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button className="focus:outline-none">
                                        <Badge
                                          variant="outline"
                                          style={member.custom_role_color ? { borderColor: `${member.custom_role_color}40`, color: member.custom_role_color, backgroundColor: `${member.custom_role_color}10` } : {}}
                                          className={cn("px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter cursor-pointer hover:bg-white/10 transition-colors",
                                            !member.custom_role_color && (member.role === 'owner' ? "bg-primary/10 text-primary border-primary/20" :
                                              member.role === 'admin' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-zinc-500/5 text-zinc-400 border-white/10")
                                          )}>
                                          {member.custom_role_name || member.role}
                                        </Badge>
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#0D0D0D] border-white/10 text-white w-48">
                                      <h4 className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500">Actions for {member.name}</h4>

                                      {/* Only Owner can transfer ownership */}
                                      {members.find(m => m.id === currentUser?.id)?.role === 'owner' && (
                                        <DropdownMenuItem
                                          className="text-primary focus:text-primary focus:bg-primary/10 cursor-pointer"
                                          onClick={() => handleUpdateMemberRole(member.id, 'TRANSFER')}
                                        >
                                          <ArrowLeftRight size={14} className="mr-2" />
                                          Transfer Ownership
                                        </DropdownMenuItem>
                                      )}

                                      <DropdownMenuSeparator className="bg-white/5" />

                                      <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => handleUpdateMemberRole(member.id, 'admin')}
                                      >
                                        <Shield size={14} className="mr-2 text-amber-500" />
                                        Make Admin
                                      </DropdownMenuItem>

                                      <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => handleUpdateMemberRole(member.id, 'member')}
                                      >
                                        <UsersIcon size={14} className="mr-2 text-zinc-400" />
                                        Make Member
                                      </DropdownMenuItem>

                                      <DropdownMenuSeparator className="bg-white/5" />

                                      {projectRoles.length > 0 && (
                                        <>
                                          <h4 className="px-2 py-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500">Project Roles</h4>
                                          {projectRoles.map(r => (
                                            <DropdownMenuItem
                                              key={r.id}
                                              className="cursor-pointer"
                                              onClick={() => handleUpdateMemberRole(member.id, 'CUSTOM', r.id)}
                                            >
                                              <div className="size-2 rounded-full mr-2" style={{ backgroundColor: r.color }} />
                                              {r.name}
                                            </DropdownMenuItem>
                                          ))}
                                          <DropdownMenuSeparator className="bg-white/5" />
                                        </>
                                      )}

                                      <DropdownMenuItem
                                        className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                                        onClick={() => { setMemberToRemove(member); setIsRemoveMemberOpen(true); }}
                                      >
                                        <UserMinus size={14} className="mr-2" />
                                        Kick from Project
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    style={member.custom_role_color ? { borderColor: `${member.custom_role_color}40`, color: member.custom_role_color, backgroundColor: `${member.custom_role_color}10` } : {}}
                                    className={cn("px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter",
                                      !member.custom_role_color && (member.role === 'owner' ? "bg-primary/10 text-primary border-primary/20" :
                                        member.role === 'admin' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-zinc-500/5 text-zinc-400 border-white/10")
                                    )}>
                                    {member.custom_role_name || member.role}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-8 pt-4 bg-gradient-to-t from-white/[0.02] to-transparent space-y-3">
                      <Button
                        onClick={() => { setIsTeamOpen(false); setIsShareOpen(true); }}
                        className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-12 font-black uppercase tracking-[0.15em] text-[10px] shadow-lg transition-transform active:scale-[0.98]"
                      >
                        Invite Member
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setIsCreateRoleOpen(true)}
                        className="w-full text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl h-10 font-bold uppercase tracking-widest text-[9px]"
                      >
                        <ShieldAlert size={14} className="mr-2 text-primary" />
                        New Team Role
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="group size-10 text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                      <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0A0A0A] border-white/10 text-white rounded-[2rem] p-8 max-w-md shadow-2xl">
                    <DialogHeader className="space-y-4">
                      <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
                        <Share2 size={28} />
                      </div>
                      <div className="text-center space-y-1">
                        <DialogTitle className="text-2xl font-bold tracking-tight">Invite Members</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-sm">
                          Invite teammates to <span className="text-zinc-200 font-semibold">{project?.name}</span>
                        </DialogDescription>
                      </div>
                    </DialogHeader>
                    <form onSubmit={handleShare} className="space-y-6 mt-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</Label>
                        <Input
                          placeholder="colleague@agency.com"
                          value={shareEmail}
                          onChange={(e) => setShareEmail(e.target.value)}
                          className="bg-white/[0.03] border-white/10 h-14 rounded-2xl focus:ring-primary/20 transition-all text-sm px-4"
                        />
                      </div>
                      {/* FIXED: White Button with Black Text */}
                      <Button type="submit" disabled={isShareLoading} className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all active:scale-[0.98]">
                        {isShareLoading ? "Sending..." : "Send Invitation"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* CENTER: Separator (Hidden on tiny screens) */}
              <div className="hidden xs:block w-px h-6 bg-white/10 shrink-0" />

              {/* RIGHT: Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-black hover:bg-zinc-100 gap-2 h-10 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 group">
                      <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                      <span className="hidden sm:inline">Add Task</span>
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Button
                  onClick={handleGenerateDoc}
                  disabled={isDocGenerating}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-xl h-10 px-4 flex items-center gap-2 transition-all active:scale-95 border border-white/5"
                >
                  {isDocGenerating ? (
                    <Loader2 size={14} className="animate-spin text-primary" />
                  ) : (
                    <FileText size={14} className="text-primary" />
                  )}
                  <span className="text-[10px] uppercase tracking-widest hidden sm:inline">
                    {isDocGenerating ? '...' : 'Export'}
                  </span>
                </Button>
              </div>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary/40 w-full md:w-72 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filter + Group Bar */}
      {view === 'kanban' && (
        <div className="px-8 py-4 border-b border-white/5 bg-[#0D0D0D]/30 backdrop-blur-md flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-zinc-500" />
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="h-8 w-[110px] bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest rounded-lg">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D0D0D] border-white/5 text-white">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="h-8 w-[130px] bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest rounded-lg">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D0D0D] border-white/5 text-white">
              <SelectItem value="all">All Assignees</SelectItem>
              {members.map(m => (
                <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6 bg-white/10" />

        <div className="flex items-center gap-2">
          <Layers size={14} className="text-zinc-500" />
          <Select value={groupBy} onValueChange={(val: any) => setGroupBy(val)}>
            <SelectTrigger className="h-8 w-[120px] bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest rounded-lg">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D0D0D] border-white/5 text-white">
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="priority">By Priority</SelectItem>
              <SelectItem value="assignee">By Assignee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFocusMode(!focusMode)}
            className={cn("h-8 px-3 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all",
              focusMode ? "bg-primary text-white" : "text-zinc-500 hover:text-white hover:bg-white/5")}
          >
            <Zap size={14} className={cn("mr-2", focusMode && "fill-white")} />
            Focus Mode
          </Button>
        </div>
      </div>
      )}

      {/* Main Area */}
      <main ref={boardRef} className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {view === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            projectId={project?.id}
            onTasksChange={setTasks}
            members={members}
            searchQuery={searchQuery}
            filterPriority={filterPriority}
            filterAssignee={filterAssignee}
            groupBy={groupBy}
            focusMode={focusMode}
            currentUser={currentUser}
          />
        )}
        {view === 'list' && (
          <ListView tasks={tasks} onTaskClick={(task) => { }} />
        )}
        {view === 'timeline' && (
          <TimelineView tasks={tasks} onTaskClick={(task) => { }} />
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

      {/* Remove Member Confirmation */}
      <Dialog open={isRemoveMemberOpen} onOpenChange={setIsRemoveMemberOpen}>
        <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-sm">
          <DialogHeader className="space-y-4">
            <div className="size-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
              <AlertCircle size={24} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Remove Member?</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm leading-relaxed">
                Are you sure you want to remove <span className="text-white font-bold">{memberToRemove?.name}</span>? They will lose access to this project instantly.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 mt-6">
            <Button
              variant="destructive"
              className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]"
              onClick={handleRemoveMember}
            >
              Confirm Removal
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

      {/* Create Role Dialog (UI Placeholder) */}
      <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
        <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-[2rem] p-8 max-w-md">
          <DialogHeader className="space-y-4 text-center">
            <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <ShieldAlert size={32} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight mb-1">New Role</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm">
                Define a new set of permissions for this project.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="mt-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Role Name</Label>
              <Input
                placeholder="e.g. Designer, Manager"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl h-12"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Identity Color</Label>
              <div className="flex items-center gap-3">
                <div
                  className="size-12 rounded-xl border border-white/10 shrink-0 shadow-inner"
                  style={{ backgroundColor: newRoleColor }}
                />
                <Input
                  type="color"
                  value={newRoleColor}
                  onChange={(e) => setNewRoleColor(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl h-12 w-full cursor-pointer p-1"
                />
              </div>
            </div>

            <Button
              className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-12 font-bold uppercase tracking-widest text-[11px]"
              onClick={handleCreateRole}
              disabled={isShareLoading}
            >
              {isShareLoading ? "Creating..." : "Create Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
