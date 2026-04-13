'use client'

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Search,
  MoreHorizontal,
  Folder,
  Users,
  Trash2,
  ExternalLink,
  Edit2,
  UserMinus,
  ArrowRight,
  Loader2,
  Shield,
  Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Project {
  id: number
  name: string
  slug: string
  is_owner: boolean
  workspace_id: number
  created_at: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // States for actions
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const [editName, setEditName] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [activeWorkspace, setActiveWorkspace] = useState<any>(null)
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')

  const [searchQuery, setSearchQuery] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const fetchUserAndProjects = async () => {
    try {
      const [userRes, projectsRes, workspacesRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/projects'),
        fetch('/api/workspaces')
      ])
      
      const userData = await userRes.json()
      const projectsData = await projectsRes.json()
      const workspacesData = await workspacesRes.json()
      
      setUser(userData.user)
      setActiveWorkspace(userData.workspace)
      if (userData.workspace) {
        setSelectedWorkspaceId(userData.workspace.id.toString())
      }
      setProjects(projectsData.projects || [])
      setWorkspaces(workspacesData.workspaces || [])
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserAndProjects()
  }, [])

  useLayoutEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      // Re-animate section headers
      gsap.fromTo('.section-header', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power4.out' }
      )
      
      // Re-animate cards every time filtering happens
      gsap.fromTo('.project-card',
        { y: 40, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.6, 
          stagger: {
            each: 0.08,
            from: "start"
          }, 
          ease: 'power2.out',
          clearProps: "all"
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [loading, searchQuery]) // Re-run when searching to animate appearing cards

  const handleCreateProject = async () => {
    if (!newProjectName) return
    setIsCreating(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newProjectName,
          workspace_id: parseInt(selectedWorkspaceId)
        })
      })
      if (res.ok) {
        setIsCreateOpen(false)
        setNewProjectName('')
        fetchUserAndProjects()
      }
    } catch (err) {
      console.error('Create error:', err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateProject = async () => {
    if (!projectToEdit || !editName) return
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/projects/${projectToEdit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      })
      if (res.ok) {
        setIsEditOpen(false)
        setProjectToEdit(null)
        fetchUserAndProjects()
      }
    } catch (err) {
      console.error('Update error:', err)
    } finally {
      setIsUpdating(false)
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
        setIsDeleteOpen(false)
        setProjectToDelete(null)
        fetchUserAndProjects()
      }
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStopCollab = async (project: Project) => {
    if (!user) return
    try {
      const res = await fetch(`/api/projects/${project.id}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })
      if (res.ok) {
        fetchUserAndProjects()
      }
    } catch (err) {
      console.error('Stop collab error:', err)
    }
  }

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const ownedProjects = filteredProjects.filter(p => p.is_owner)
  const collabProjects = filteredProjects.filter(p => !p.is_owner)

  if (loading) {
    return (
      <div className="flex-1 bg-[#0A0A0A] flex flex-col items-center justify-center space-y-4">
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Loading Workspace...</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex-1 min-h-screen bg-[#0A0A0A] text-white p-8 lg:p-12 overflow-y-auto custom-scrollbar">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
              <Shield size={12} /> Workspace
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              My Projects
            </h1>
            <p className="text-zinc-500 text-lg max-w-xl font-medium leading-relaxed">
              Manage your work, collaborate with your team, and track your progress in one place.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/40 w-full md:w-72 transition-all backdrop-blur-xl"
              />
            </div>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-white text-black hover:bg-zinc-200 h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all active:scale-95 group"
            >
              <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-500" />
              New Project
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {/* Owned Projects */}
          <div className="space-y-8">
            <div className="section-header flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Briefcase size={20} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Owned by you</h2>
              <div className="h-px flex-1 bg-white/5" />
              <Badge variant="outline" className="border-white/10 text-zinc-500">{ownedProjects.length} Projects</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ownedProjects.length > 0 ? (
                ownedProjects.map((project, i) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onEdit={() => {
                      setProjectToEdit(project)
                      setEditName(project.name)
                      setIsEditOpen(true)
                    }}
                    onDelete={() => {
                      setProjectToDelete(project)
                      setIsDeleteOpen(true)
                    }}
                    onOpen={() => router.push(`/dashboard/projects/${project.slug}`)}
                  />
                ))
              ) : (
                <EmptyState icon={<Folder />} title="No projects found" description="Create your first masterpiece to get started." />
              )}
            </div>
          </div>

          {/* Collaboration Projects */}
          <div className="space-y-8">
            <div className="section-header flex items-center gap-4">
              <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Users size={20} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Shared Collaborations</h2>
              <div className="h-px flex-1 bg-white/5" />
              <Badge variant="outline" className="border-white/10 text-zinc-500">{collabProjects.length} Shared</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {collabProjects.length > 0 ? (
                collabProjects.map((project, i) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onStopCollab={() => handleStopCollab(project)}
                    onOpen={() => router.push(`/dashboard/projects/${project.slug}`)}
                  />
                ))
              ) : (
                <EmptyState icon={<Users />} title="Workspace is quiet" description="Invited projects will materialize here." />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open)
        if (open && activeWorkspace) {
          setSelectedWorkspaceId(activeWorkspace.id.toString())
        }
      }}>
        <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-[2rem] p-8 max-w-md shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <Plus size={28} />
            </div>
            <div className="text-center space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">New Project</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm">
                Create a new project to start organizing your tasks.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="space-y-6 mt-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Project Name</Label>
              <Input
                placeholder="High-Performance Campaign"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="bg-white/3 border-white/10 h-14 rounded-2xl focus:ring-primary/20 transition-all text-sm px-4"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Target Workspace</Label>
              <Select value={selectedWorkspaceId} onValueChange={setSelectedWorkspaceId}>
                <SelectTrigger className="bg-white/3 border-white/10 h-14 rounded-2xl focus:ring-primary/20 transition-all text-sm px-4">
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D0D0D] border-white/10 text-white rounded-xl">
                  {workspaces.map((ws) => (
                    <SelectItem key={ws.id} value={ws.id.toString()} className="focus:bg-white/5 focus:text-white cursor-pointer">
                      {ws.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleCreateProject} 
              disabled={isCreating} 
              className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all active:scale-[0.98]"
            >
              {isCreating ? <Loader2 className="animate-spin mr-2" size={16} /> : "Create Project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-[2rem] p-8 max-w-md">
          <DialogHeader className="space-y-4">
            <div className="size-14 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center text-white mx-auto">
              <Edit2 size={24} />
            </div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight">Rename Project</DialogTitle>
              <DialogDescription className="text-zinc-500">Give your project a new name.</DialogDescription>
            </div>
          </DialogHeader>
          <div className="space-y-6 mt-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">New Identity</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-white/3 border-white/10 h-14 rounded-2xl focus:ring-primary/20 transition-all text-sm px-4"
              />
            </div>
            <Button 
              onClick={handleUpdateProject} 
              disabled={isUpdating} 
              className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-[11px]"
            >
              {isUpdating ? <Loader2 className="animate-spin mr-2" size={16} /> : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-[2rem] p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="size-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
              <Trash2 size={32} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Delete Project?</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm py-2">
                This will permanently delete <span className="text-white font-bold">{projectToDelete?.name}</span> and all its tasks. This cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 mt-6">
            <Button 
              variant="destructive" 
              onClick={handleDeleteProject} 
              disabled={isDeleting}
              className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px]"
            >
              {isDeleting ? <Loader2 className="animate-spin mr-2" size={14} /> : "Delete Project"}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsDeleteOpen(false)}
              className="w-full h-12 rounded-xl text-zinc-500 hover:text-white"
            >
              Keep Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}

function ProjectCard({ project, onOpen, onEdit, onDelete, onStopCollab }: { 
  project: Project, 
  onOpen: () => void,
  onEdit?: () => void,
  onDelete?: () => void,
  onStopCollab?: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -8,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.15)',
      duration: 0.4,
      ease: 'power2.out'
    })
    gsap.to(iconRef.current, {
      scale: 1.15,
      rotate: 5,
      duration: 0.4,
      ease: 'back.out(1.7)'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderColor: 'rgba(255, 255, 255, 0.05)',
      boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0)',
      duration: 0.4,
      ease: 'power2.out'
    })
    gsap.to(iconRef.current, {
      scale: 1,
      rotate: 0,
      duration: 0.4,
      ease: 'power2.out'
    })
  }

  return (
    <div 
      ref={cardRef}
      className="project-card group relative bg-white/2 border border-white/5 rounded-3xl p-6 transition-none cursor-pointer scale-100 active:scale-[0.98]"
      onClick={onOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-start justify-between">
          <div 
            ref={iconRef}
            className="size-12 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary"
          >
            <Folder size={24} />
          </div>
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0D0D0D] border-white/5 text-white w-48">
              <DropdownMenuItem onClick={onOpen} className="cursor-pointer gap-2">
                <ExternalLink size={14} /> Open Project
              </DropdownMenuItem>
              {project.is_owner ? (
                <>
                  <DropdownMenuItem onClick={onEdit} className="cursor-pointer gap-2">
                    <Edit2 size={14} /> Rename Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer gap-2">
                    <Trash2 size={14} /> Delete Project
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={onStopCollab} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer gap-2">
                  <UserMinus size={14} /> Leave Project
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">{project.name}</h3>
          <p className="text-xs font-mono text-zinc-500 italic">/projects/{project.slug}</p>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-zinc-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{project.is_owner ? "Owner" : "Collaborator"}</span>
            </div>
            <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">Open</span>
              <ArrowRight size={12} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-white/5 rounded-[3rem]">
      <div className="size-16 rounded-3xl bg-white/5 flex items-center justify-center text-zinc-500">
        {React.cloneElement(icon as React.ReactElement<{ size: number }>, { size: 32 })}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-zinc-500 text-sm max-w-[200px]">{description}</p>
      </div>
    </div>
  )
}
