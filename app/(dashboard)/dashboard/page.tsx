'use client'

import React, { useEffect, useState } from 'react'
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
  Trash2
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

  const handleProjectClick = (slug: string) => {
    router.push(`/dashboard/projects/${slug}`)
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

  return (
    <div className="flex-1 min-h-screen bg-[#0A0A0A] p-4 md:p-8 space-y-8 animate-in fade-in duration-700 overflow-x-hidden">
      
      {/* Zone 1: Welcome Banner */}
      <section className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-primary/10 to-blue-600/10 border border-white/5 p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Good morning, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-zinc-400 text-base md:text-lg mb-8 leading-relaxed">
            {projects.length === 0 
              ? "You haven't created any projects yet. Start with a goal and let AI do the lifting."
              : `You have ${projects.length} active project${projects.length > 1 ? 's' : ''} in your workspace.`}
          </p>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-white text-black hover:bg-zinc-200 px-6 md:px-8 py-5 md:py-6 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-white/5 text-sm"
              >
                {projects.length === 0 ? 'Create your first project' : 'New Project'}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-md">
              <DialogHeader className="space-y-4">
                <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <Plus size={24} />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-bold tracking-tight">Create Project</DialogTitle>
                  <DialogDescription className="text-zinc-500 text-sm">
                    Select a workspace and give your project a name.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-6 mt-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Project Name</Label>
                  <Input 
                    placeholder="e.g. Website Redesign" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-primary/40"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Workspace</Label>
                  <Select value={selectedWorkspaceId} onValueChange={setSelectedWorkspaceId}>
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-sm">
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
                <DialogFooter>
                  <Button type="submit" disabled={loading} className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold">
                    {loading ? 'Creating...' : 'Create Project'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Abstract shapes for premium look */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-96 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 size-64 bg-blue-600/10 blur-[100px] rounded-full" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Zone 2: AI Digest Card */}
        <div className="lg:col-span-4 h-full">
          <Card className="h-full bg-[#0D0D0D] border-white/5 p-8 rounded-[32px] flex flex-col items-start text-left space-y-6 group hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between w-full">
              <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <Zap size={24} />
              </div>
              <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest">Live Updates</Badge>
            </div>
            <div className="space-y-4 w-full">
              <h3 className="text-lg font-bold text-white">AI Agency Digest</h3>
              <div className="space-y-3">
                {stats.highlights && stats.highlights.length > 0 ? (
                  stats.highlights.map((task: any) => (
                    <div key={task.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 hover:bg-white/10 transition-all cursor-pointer" onClick={() => handleProjectClick(task.project_slug)}>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">{task.project_name}</span>
                        <Badge className={cn(
                          "text-[8px] font-black px-1.5 py-0.5",
                          task.priority === 'High' ? "bg-red-500/20 text-red-500" : "bg-zinc-500/20 text-zinc-500"
                        )}>{task.priority}</Badge>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{task.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    Your morning digest will appear here once you have active tasks assigned.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Zone 3: Project Overview Grid */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="h-40 bg-white/5 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  onClick={() => handleProjectClick(project.slug)}
                  className="bg-[#0D0D0D] border-white/5 p-6 rounded-2xl group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <Folder size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{project.name}</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">/projects/{project.slug}</p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0D0D0D] border-white/5 text-white">
                        <DropdownMenuItem 
                          className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            setProjectToDelete(project)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600 pt-4 border-t border-white/5">
                    <span>Collaborative</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              ))}
              <Card 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-white/5 border-2 border-dashed border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center group hover:border-white/20 transition-all cursor-pointer h-full min-h-[120px]"
              >
                <Plus size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
                <span className="text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-widest">Add Project</span>
              </Card>
            </div>
          ) : (
            <Card 
              onClick={() => setIsCreateDialogOpen(true)}
              className="h-full bg-[#0D0D0D] border-white/5 p-8 rounded-[32px] flex flex-col items-center justify-center text-center border-dashed border-2 group hover:border-white/20 transition-all cursor-pointer min-h-[300px]"
            >
              <div className="size-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Plus size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No projects yet</h3>
              <p className="text-zinc-500 text-sm">Click to create your first project using AI.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Zone 4: Quick Stats Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Rocket className="text-blue-400" size={18} />} 
          label="Total Tasks" 
          value={stats.total} 
        />
        <StatCard 
          icon={<CheckCircle2 className="text-green-400" size={18} />} 
          label="Completed" 
          value={stats.completed} 
        />
        <StatCard 
          icon={<Loader2 className="text-primary" size={18} />} 
          label="In Progress" 
          value={stats.inProgress} 
        />
        <StatCard 
          icon={<TrendingUp className="text-amber-500" size={18} />} 
          label="Overdue" 
          value={stats.overdue} 
        />
      </section>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-sm">
          <DialogHeader className="space-y-4">
            <div className="size-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
              <AlertCircle size={24} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Delete Project?</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm">
                This action is permanent. All tasks and documents in <span className="text-white font-bold">{projectToDelete?.name}</span> will be lost.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 mt-6">
            <Button 
              variant="destructive"
              className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px]"
              disabled={isDeleting}
              onClick={handleDeleteProject}
            >
              {isDeleting ? "Deleting..." : "Confirm Deletion"}
            </Button>
            <Button 
              variant="ghost"
              className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] text-zinc-500 hover:text-white"
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

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <Card className="bg-[#0D0D0D] border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors">
      <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
      </div>
    </Card>
  )
}