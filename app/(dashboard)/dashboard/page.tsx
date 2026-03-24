'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Activity, 
  AlertCircle,
  Folder,
  ChevronRight
} from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [meRes, projectsRes, statsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/projects'),
          fetch('/api/dashboard/stats')
        ])
        
        const meData = await meRes.json()
        const projectsData = await projectsRes.json()
        const statsData = await statsRes.json()

        if (meData.user) setUser(meData.user)
        if (projectsData.projects) {
          console.log('Projects fetched:', projectsData.projects)
          setProjects(projectsData.projects)
        }
        if (!statsData.error) setStats(statsData)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateProject = async () => {
    const name = prompt('Enter project name:')
    if (!name) return

    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      if (res.ok) {
        const data = await res.json()
        setProjects([data.project, ...projects])
      }
    } catch (err) {
      console.error('Create project error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 min-h-screen bg-[#0A0A0A] p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Zone 1: Welcome Banner */}
      <section className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-primary/10 to-blue-600/10 border border-white/5 p-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            Good morning, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            {projects.length === 0 
              ? "You haven't created any projects yet. Start with a goal and let AI do the lifting."
              : `You have ${projects.length} active project${projects.length > 1 ? 's' : ''} in your workspace.`}
          </p>
          <Button 
            onClick={handleCreateProject}
            className="bg-white text-black hover:bg-zinc-200 px-8 py-6 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-white/5"
          >
            {projects.length === 0 ? 'Create your first project' : 'New Project'}
          </Button>
        </div>
        
        {/* Abstract shapes for premium look */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 size-96 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 size-64 bg-blue-600/10 blur-[100px] rounded-full" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Zone 2: AI Digest Card */}
        <div className="lg:col-span-4 h-full">
          <Card className="h-full bg-[#0D0D0D] border-white/5 p-8 rounded-[32px] flex flex-col items-center justify-center text-center space-y-6 group hover:border-white/10 transition-colors">
            <div className="size-20 rounded-3xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
              <Zap size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">AI Morning Digest</h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-[200px]">
                Your morning digest will appear here once you have active tasks.
              </p>
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
                <Card key={project.id} className="bg-[#0D0D0D] border-white/5 p-6 rounded-2xl group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                      <Folder size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{project.name}</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Active Project</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600 pt-4 border-t border-white/5">
                    <span>Active</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              ))}
              <Card 
                onClick={handleCreateProject}
                className="bg-white/5 border-2 border-dashed border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center group hover:border-white/20 transition-all cursor-pointer"
              >
                <Plus size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
                <span className="text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-widest">Add Project</span>
              </Card>
            </div>
          ) : (
            <Card 
              onClick={handleCreateProject}
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
          icon={<Activity className="text-blue-400" size={18} />} 
          label="Total Tasks" 
          value={stats.total} 
        />
        <StatCard 
          icon={<CheckCircle2 className="text-green-400" size={18} />} 
          label="Completed" 
          value={stats.completed} 
        />
        <StatCard 
          icon={<Clock className="text-primary" size={18} />} 
          label="In Progress" 
          value={stats.inProgress} 
        />
        <StatCard 
          icon={<AlertCircle className="text-red-400" size={18} />} 
          label="Overdue" 
          value={stats.overdue} 
        />
      </section>

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