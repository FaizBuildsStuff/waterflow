'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { Logo } from '@/components/logo'
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  Zap, 
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import gsap from 'gsap'
import Link from 'next/link'

const Dashboard = () => {
  const comp = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Initial states
      gsap.set(".sidebar", { x: -80, opacity: 0 })
      gsap.set(".stat-card", { y: 20, opacity: 0 })
      gsap.set(".main-content", { opacity: 0 })

      tl.to(".sidebar", { x: 0, opacity: 1, duration: 0.8 })
        .to(".main-content", { opacity: 1, duration: 0.6 }, "-=0.4")
        .to(".stat-card", { y: 0, opacity: 1, stagger: 0.1, duration: 0.8 }, "-=0.4")
    }, comp)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={comp} className="flex min-h-screen bg-[#F8F9FB] text-slate-900 selection:bg-primary/10">
      
      {/* --- SIDEBAR --- */}
      <aside className="sidebar sticky top-0 hidden h-screen w-64 flex-col border-r bg-white p-6 lg:flex">
        <div className="mb-10 px-2">
          <Logo className="h-7 w-auto" />
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
          <NavItem icon={<Layers size={18} />} label="Projects" />
          <NavItem icon={<Zap size={18} />} label="AI Decompositions" />
          <NavItem icon={<Users size={18} />} label="Team" />
        </nav>

        <div className="mt-auto space-y-1 pt-6 border-t">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <div className="mt-4 rounded-2xl bg-primary/5 p-4">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Pro Plan</p>
            <p className="mt-1 text-[11px] text-slate-500">78% of AI tokens used this month.</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-primary/10">
              <div className="h-full w-[78%] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content flex-1 overflow-y-auto">
        
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white/80 px-8 py-4 backdrop-blur-md">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search tasks, docs, or AI logs..." 
              className="h-10 border-none bg-slate-100 pl-10 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500 border-2 border-white" />
            </Button>
            <div className="h-8 w-px bg-slate-200" />
            <Button className="gap-2 rounded-full px-5">
              <Plus size={18} />
              New Project
            </Button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-tight">Morning, Alex</h1>
              <p className="text-slate-500 mt-1">Here’s what’s flowing in your workspace today.</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white border px-3 py-1.5 rounded-lg shadow-sm">
              <Clock size={16} />
              Last sync: 2m ago
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Active Projects" value="12" trend="+2 this week" />
            <StatCard label="AI Tasks Solved" value="148" trend="+12% velocity" />
            <StatCard label="Team Members" value="6" trend="2 online" />
            <StatCard label="Efficiency Score" value="94%" trend="Optimized" highlight />
          </div>

          {/* Main Bento Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Recent Activity Table */}
            <Card className="stat-card col-span-1 border-none bg-white p-6 shadow-sm lg:col-span-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Recent AI Decompositions</h3>
                <Button variant="link" className="text-primary text-xs">View All</Button>
              </div>
              <div className="space-y-4">
                <ActivityRow title="Mobile App Redesign" tag="Design" time="2h ago" status="Completed" />
                <ActivityRow title="API Auth Architecture" tag="Backend" time="5h ago" status="In Progress" />
                <ActivityRow title="Q3 Marketing Roadmap" tag="Strategy" time="Yesterday" status="Completed" />
                <ActivityRow title="Database Migration" tag="DevOps" time="2 days ago" status="Pending" />
              </div>
            </Card>

            {/* AI Insights Card */}
            <Card className="stat-card col-span-1 border-none bg-primary p-6 text-white shadow-lg shadow-primary/20 lg:col-span-4">
              <Zap className="mb-4 size-8" />
              <h3 className="text-xl font-bold">AI Insight</h3>
              <p className="mt-3 text-sm text-blue-100 leading-relaxed">
                Based on last week&apos;s velocity, your team is 15% faster when tasks are broken into sub-4-hour blocks.
              </p>
              <Button className="mt-6 w-full bg-white text-primary hover:bg-blue-50">
                Apply to Backlog
              </Button>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <Link
    href="#" 
    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
      active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    {label}
  </Link>
)

const StatCard = ({ label, value, trend, highlight = false }: any) => (
  <Card className={`stat-card border-none p-6 shadow-sm transition-transform hover:scale-[1.02] ${highlight ? 'bg-white ring-1 ring-primary/20' : 'bg-white'}`}>
    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <div className="mt-3 flex items-baseline justify-between">
      <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${highlight ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-600'}`}>
        {trend}
      </span>
    </div>
  </Card>
)

const ActivityRow = ({ title, tag, time, status }: any) => (
  <div className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-slate-50">
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm">
        <Layers size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-400">{tag} • {time}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
        status === 'Completed' ? 'bg-green-100 text-green-600' : 
        status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
      }`}>
        {status}
      </span>
      <ChevronRight size={14} className="text-slate-300" />
    </div>
  </div>
)

export default Dashboard