'use client'

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Rocket, 
  AlertCircle,
  Folder,
  ChevronRight,
  TrendingUp,
  Loader2,
  MoreVertical,
  Trash2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Activity,
  Layers
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import gsap from 'gsap'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('')
  const [projectName, setProjectName] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [stats, setStats] = useState<any>({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    highlights: []
  })
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [meRes, projectsRes, statsRes, workspacesRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/projects'),
          fetch('/api/dashboard/stats'),
          fetch('/api/workspaces')
        ])
        
        const meData = await meRes.json()
        const projectsData = await projectsRes.json()
        const statsData = await statsRes.json()
        const workspacesData = await workspacesRes.json()

        if (meData.user) setUser(meData.user)
        if (meData.workspace) setSelectedWorkspaceId(meData.workspace.id.toString())
        if (projectsData.projects) setProjects(projectsData.projects)
        if (!statsData.error) setStats(statsData)
        if (workspacesData.workspaces) setWorkspaces(workspacesData.workspaces)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useLayoutEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from('.dashboard-hero', {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power4.out'
        })
        
        gsap.from('.bento-cell', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2
        })
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading])

  const handleCreateProject = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!projectName || !selectedWorkspaceId) return

    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, workspace_id: parseInt(selectedWorkspaceId) })
      })
      if (res.ok) {
        const data = await res.json()
        setProjects([data.project, ...projects])
        setProjectName('')
        setIsCreateDialogOpen(false)
        router.push(`/dashboard/projects/${data.project.slug}`)
      }
    } catch (err) {
      console.error('Create project error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== projectToDelete.id))
        setIsDeleteDialogOpen(false)
        setProjectToDelete(null)
      }
    } catch (err) {
      console.error('Delete project error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 bg-[#0A0A0A] flex flex-col items-center justify-center space-y-4">
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Loading Workspace...</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex-1 min-h-screen bg-[#0A0A0A] p-2 md:p-10 space-y-12 overflow-x-hidden">
      
      {/* Cinematic Hero Header */}
      <section className="dashboard-hero max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10 mt-6 px-4">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} className="animate-pulse" /> Live Status
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white/95 leading-[0.9]">
            Welcome back<span className="text-primary">,</span> {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl">
             Everything is on track. You have {projects.length} active projects in your workspace.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-zinc-200 h-16 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all active:scale-95 group">
                <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-500" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-[2rem] p-10 max-w-md shadow-3xl">
              <DialogHeader className="space-y-6 text-center">
                <div className="size-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
                  <Layers size={32} />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black tracking-tighter">New Project</DialogTitle>
                  <DialogDescription className="text-zinc-500 font-medium">Create a new project to start organizing your work.</DialogDescription>
                </div>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-8 mt-10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Project Name</Label>
                  <Input 
                    placeholder="e.g. Marketing Campaign" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-xl h-14 text-sm focus:ring-primary/40 px-5"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Workspace</Label>
                  <Select value={selectedWorkspaceId} onValueChange={setSelectedWorkspaceId}>
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-14 text-sm px-5">
                      <SelectValue placeholder="Select workspace" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0D0D0D] border-white/5 text-white">
                      {workspaces.map((ws) => (
                        <SelectItem key={ws.id} value={ws.id.toString()}>
                          {ws.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-xs">
                  {loading ? 'Creating...' : 'Create Project'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Bentō Grid System */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 px-4">
        
        {/* BIG CELL: AI Insight Briefing */}
        <Card className="bento-cell md:col-span-8 bg-[#0D0D0D] border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/20 transition-all duration-700 h-full">
           <div className="relative z-10 flex flex-col h-full space-y-10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <Zap size={20} />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-white uppercase tracking-widest">Recent Updates</span>
                 </div>
                 <Badge className="bg-white/5 text-zinc-400 border-none font-black text-[9px] px-3">Live Feed</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {stats.highlights && stats.highlights.length > 0 ? (
                    stats.highlights.slice(0, 4).map((task: any) => (
                      <div key={task.id} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4 hover:bg-white/[0.06] transition-all cursor-pointer group/task" onClick={() => router.push(`/dashboard/projects/${task.project_slug}`)}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary/80">{task.project_name}</span>
                          <ArrowUpRight size={14} className="text-zinc-600 group-hover/task:text-white group-hover/task:translate-x-1 group-hover/task:-translate-y-1 transition-all" />
                        </div>
                        <h4 className="text-white font-bold leading-snug line-clamp-2">{task.title}</h4>
                        <div className="flex items-center gap-2">
                           <Calendar size={12} className="text-zinc-600" />
                           <span className="text-[9px] font-bold text-zinc-500">{task.priority} Priority</span>
                        </div>
                      </div>
                    ))
                 ) : (
                    <div className="col-span-full py-10 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                       <Activity size={32} className="text-zinc-700" />
                       <p className="text-zinc-500 text-sm font-medium">Scanning for priority signals...</p>
                    </div>
                 )}
              </div>
           </div>
           
           {/* Abstract Glow Background */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </Card>

        {/* SIDE CELL: Quick Performance */}
        <div className="bento-cell md:col-span-4 flex flex-col gap-6">
           <Card className="flex-1 bg-primary/10 border border-primary/20 p-8 rounded-[2.5rem] flex flex-col justify-between group hover:bg-primary/15 transition-all">
              <div className="space-y-2">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60">Completion Rate</h4>
                 <div className="text-5xl font-black text-white tracking-tighter">
                   {stats.total > 0 ? Math.round((stats.completed / (stats.total || 1)) * 100) : 0}<span className="text-2xl text-primary/50">%</span>
                 </div>
              </div>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed">Your projects are moving forward. Completion is up 12% across your workspace.</p>
           </Card>

           <Card className="flex-1 bg-[#0D0D0D] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between group hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-[1.25rem] bg-white/5 flex items-center justify-center text-zinc-500">
                   <Clock size={20} />
                </div>
                <Badge className="bg-amber-500/10 text-amber-500 border-none font-black text-[9px]">{stats.overdue} Tasks</Badge>
              </div>
              <div className="space-y-1 mt-6">
                 <h4 className="text-2xl font-black text-white">{stats.overdue}</h4>
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Needs Attention</p>
              </div>
           </Card>
        </div>

        {/* BOTTOM WIDE CELL: Project Hub */}
        <div className="bento-cell md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {projects.slice(0, 3).map((project) => (
             <Card 
               key={project.id} 
               onClick={() => router.push(`/dashboard/projects/${project.slug}`)}
               className="bg-[#0D0D0D] border-white/5 p-8 rounded-[2.5rem] group hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer relative overflow-hidden h-72 flex flex-col justify-between"
             >
                <div className="flex items-start justify-between">
                   <div className="size-14 rounded-3xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:scale-110 group-hover:text-primary transition-all duration-500">
                      <Folder size={28} />
                   </div>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="size-10 text-zinc-500 hover:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0D0D0D] border-white/5 text-white w-48">
                        <DropdownMenuItem 
                          className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer p-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            setProjectToDelete(project)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 size={16} className="mr-3" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>

                <div className="space-y-1">
                   <h3 className="text-2xl font-black text-white tracking-tight leading-tight">{project.name}</h3>
                   <p className="text-[10px] text-zinc-600 font-mono italic">/projects/{project.slug}</p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <div className="flex -space-x-1.5">
                      {[1,2,3].map(i => (
                         <div key={i} className="size-5 rounded-full bg-zinc-800 border-2 border-[#0D0D0D] flex items-center justify-center text-[7px] font-black uppercase tracking-tighter text-zinc-500">{i}</div>
                      ))}
                   </div>
                   <ArrowUpRight size={18} className="text-zinc-700 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
             </Card>
           ))}

           {/* Create Project Tile */}
           <Card 
             onClick={() => setIsCreateDialogOpen(true)}
             className="bg-white/2 border-2 border-dashed border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center justify-center group hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer h-72"
           >
              <div className="size-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Plus size={32} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-white transition-colors">Create Project</h3>
           </Card>
        </div>

      </section>

      {/* Footer Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 pb-20">
         {[
           { icon: <Rocket size={18} />, label: 'Projects', value: stats.total, color: 'text-blue-400' },
           { icon: <CheckCircle2 size={18} />, label: 'Completed', value: stats.completed, color: 'text-green-500' },
           { icon: <TrendingUp size={18} />, label: 'Efficiency', value: '+12%', color: 'text-primary' },
           { icon: <Sparkles size={18} />, label: 'Team Score', value: '4.8', color: 'text-amber-500' }
         ].map((stat, i) => (
           <div key={i} className="flex flex-col gap-2 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
              <div className={cn("size-8 rounded-lg flex items-center justify-center bg-white/5 transition-transform group-hover:scale-110", stat.color)}>
                 {stat.icon}
              </div>
              <div className="space-y-0.5 mt-2">
                 <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</p>
                 <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
           </div>
         ))}
      </section>

      {/* Confirm Deletion */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-[2.5rem] p-10 max-w-md shadow-3xl text-center">
          <DialogHeader className="space-y-6">
            <div className="size-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
              <Trash2 size={40} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight">Delete Project?</DialogTitle>
              <DialogDescription className="text-zinc-500 font-medium py-3">
                You are about to permanently delete <span className="text-white font-black">{projectToDelete?.name}</span>. This cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-4 mt-10">
            <Button 
              variant="destructive"
              className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-500/10"
              disabled={isDeleting}
              onClick={handleDeleteProject}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete Project"}
            </Button>
            <Button 
              variant="ghost"
              className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-500 hover:text-white"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}