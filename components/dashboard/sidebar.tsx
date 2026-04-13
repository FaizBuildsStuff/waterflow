'use client'

import React, { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Home,
  Briefcase,
  CheckSquare,
  FileText,
  Users,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { setCookie } from 'cookies-next'
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
  SelectValue,
} from "@/components/ui/select"

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Briefcase, label: 'Projects', href: '/dashboard/projects' },
  { icon: CheckSquare, label: 'My Tasks', href: '/dashboard/tasks' },
  { icon: FileText, label: 'Docs', href: '/dashboard/docs' },
  { icon: Users, label: 'Team', href: '/dashboard/team' },
  { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

interface SidebarContentProps {
  onItemClick?: () => void;
}

export const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [activeWorkspace, setActiveWorkspace] = React.useState<any>(null)
  const [workspaces, setWorkspaces] = React.useState<any[]>([])
  const [projects, setProjects] = React.useState<any[]>([])
  const [isWorkspaceOpen, setIsWorkspaceOpen] = React.useState(false)
  
  const [isNewProjectOpen, setIsNewProjectOpen] = React.useState(false)
  const [newProjectName, setNewProjectName] = React.useState('')
  const [selectedWorkspaceId, setSelectedWorkspaceId] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = React.useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = React.useState('')
  const [isCreatingWorkspace, setIsCreatingWorkspace] = React.useState(false)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, workspacesRes, projectsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/workspaces'),
          fetch('/api/projects')
        ]);
        
        const meData = await meRes.json();
        const workspacesData = await workspacesRes.json();
        const projectsData = await projectsRes.json();

        if (meData.user) setUser(meData.user);
        if (meData.workspace) setActiveWorkspace(meData.workspace);
        if (workspacesData.workspaces) setWorkspaces(workspacesData.workspaces);
        if (projectsData.projects) setProjects(projectsData.projects);
      } catch (err) {
        console.error('Sidebar fetch error:', err);
      }
    };

    fetchData();
  }, [])

  const handleSwitchWorkspace = (workspace: any) => {
    setCookie('workspace_id', workspace.id.toString(), { maxAge: 60 * 60 * 24 * 30 });
    setActiveWorkspace(workspace);
    setIsWorkspaceOpen(false);
    if (onItemClick) onItemClick();
    window.location.reload();
  }

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' })
    if (res.ok) {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('onboarded')
      window.location.href = '/'
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !selectedWorkspaceId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName, workspace_id: parseInt(selectedWorkspaceId) })
      });
      if (res.ok) {
        const data = await res.json();
        setIsNewProjectOpen(false);
        setNewProjectName('');
        if (onItemClick) onItemClick();
        router.push(`/dashboard/projects/${data.project.slug}`);
      }
    } catch (err) {
      console.error('Create project error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName) return;
    setIsCreatingWorkspace(true);
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWorkspaceName })
      });
      if (res.ok) {
        const data = await res.json();
        setIsNewWorkspaceOpen(false);
        setNewWorkspaceName('');
        if (onItemClick) onItemClick();
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create workspace');
      }
    } catch (err) {
      console.error('Create workspace error:', err);
    } finally {
      setIsCreatingWorkspace(false);
    }
  }

  useLayoutEffect(() => {
    if (activeWorkspace) setSelectedWorkspaceId(activeWorkspace.id.toString());
  }, [activeWorkspace])

  return (
    <div className="flex flex-col h-full">
      <div className="mb-10 px-4">
        <Popover open={isWorkspaceOpen} onOpenChange={setIsWorkspaceOpen}>
          <PopoverTrigger asChild>
            <button className="flex flex-col gap-1 text-left w-full group outline-none">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-primary transition-colors">Workspace</span>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white truncate max-w-[140px]">
                  {activeWorkspace?.name || 'Anthryve'}
                </h2>
                <Plus size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-[#0D0D0D] border-white/5 p-2 rounded-2xl shadow-2xl backdrop-blur-xl" align="start">
            <div className="px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">My Workspaces</p>
              <ScrollArea className="max-h-[200px]">
                <div className="space-y-1">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => handleSwitchWorkspace(ws)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left",
                        activeWorkspace?.id === ws.id 
                          ? "bg-white/10 text-white" 
                          : "text-zinc-500 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="size-6 rounded-lg bg-linear-to-br from-primary/40 to-blue-600/40 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                        {ws.name.charAt(0)}
                      </div>
                      <span className="truncate">{ws.name}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
              <Separator className="my-2 bg-white/5" />
              {user?.subscriptionTier === 'free' && workspaces.length >= 1 ? (
                <div className="px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 space-y-1">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Free Tier Limit</p>
                  <p className="text-[9px] text-zinc-600">Upgrade to Pro to create more workspaces.</p>
                  <Link href="/dashboard/billing" onClick={() => { setIsWorkspaceOpen(false); if(onItemClick) onItemClick(); }} className="text-[9px] text-primary hover:underline font-bold inline-block mt-1">
                    Upgrade Now
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsWorkspaceOpen(false);
                    setIsNewWorkspaceOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-all text-left"
                >
                  <Plus size={16} />
                  Create Workspace
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-hidden">
        <nav className="space-y-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <React.Fragment key={item.href}>
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.05)]" 
                      : "text-zinc-500 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon 
                      size={18} 
                      className={cn(
                          "transition-colors",
                          isActive ? "text-black" : "text-zinc-500 group-hover:text-white"
                      )} 
                  />
                  {item.label}
                </Link>
                {item.label === 'Projects' && projects.length > 0 && (
                  <div className="ml-4 mt-2 space-y-1 border-l border-white/5 pl-4 mb-4">
                    {projects.map((p) => (
                      <Link 
                        key={p.id} 
                        href={`/dashboard/projects/${p.slug}`}
                        onClick={onItemClick}
                        className={cn(
                          "block text-[11px] font-medium py-1.5 transition-all text-left truncate",
                          pathname === `/dashboard/projects/${p.slug}` ? "text-primary" : "text-zinc-600 hover:text-zinc-300"
                        )}
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </nav>

        <div className="space-y-1 border-t border-white/5 pt-6 mt-6">
          <Link
            href="/dashboard/settings"
            onClick={onItemClick}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings size={18} />
            Settings
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400/80 hover:bg-red-500/10 transition-all text-left"
          >
            <LogOut size={18} />
            Logout
          </button>

          <div className="mt-8 flex items-center gap-3 border-t border-white/5 pt-6 px-4">
            <div className="size-10 shrink-0 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">{user?.name || 'User'}</span>
              <span className="text-[10px] text-zinc-500 truncate">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Dialog open={isNewProjectOpen} onOpenChange={(open) => {
          setIsNewProjectOpen(open);
          if (open && activeWorkspace) setSelectedWorkspaceId(activeWorkspace.id.toString());
        }}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2 rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 py-6 font-bold transition-all active:scale-95">
                <Plus size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">New Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-md">
            <DialogHeader className="space-y-4">
              <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <Briefcase size={24} />
               </div>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold tracking-tight">Create Project</DialogTitle>
                <DialogDescription className="text-zinc-500 text-sm">
                  Start a new project in your workspace.
                </DialogDescription>
              </div>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-6 mt-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Project Name</Label>
                <Input 
                  placeholder="e.g. Design System" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
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
                <Button 
                  type="submit"
                  disabled={isSubmitting || !newProjectName || !selectedWorkspaceId}
                  className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isNewWorkspaceOpen} onOpenChange={setIsNewWorkspaceOpen}>
        <DialogContent className="bg-[#0D0D0D] border-white/5 text-white rounded-3xl p-8 max-w-md">
          <DialogHeader className="space-y-4">
            <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
              <Plus size={24} />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">Create Workspace</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm">
                Name your new strategic command center.
              </DialogDescription>
            </div>
          </DialogHeader>
          <form onSubmit={handleCreateWorkspace} className="space-y-6 mt-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Workspace Name</Label>
              <Input 
                placeholder="e.g. Acme Agency" 
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="bg-white/5 border-white/10 rounded-xl h-12 text-sm focus:ring-primary/40"
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit"
                disabled={isCreatingWorkspace || !newWorkspaceName}
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold"
              >
                {isCreatingWorkspace ? "Creating..." : "Create Workspace"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const Sidebar = () => {
  const sidebarRef = useRef(null)
  return (
    <aside 
      ref={sidebarRef}
      className="sidebar fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-white/5 bg-[#0A0A0A] p-6 lg:flex z-50"
    >
      <SidebarContent />
    </aside>
  )
}