'use client'

import React, { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  Settings, 
  Zap, 
  LogOut,
  Home,
  Briefcase,
  CheckSquare,
  BarChart3,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import gsap from 'gsap'

const navItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Briefcase, label: 'Projects', href: '/dashboard/projects' },
  { icon: CheckSquare, label: 'My Tasks', href: '/dashboard/tasks' },
  { icon: Users, label: 'Team', href: '/dashboard/team' },
  { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const sidebarRef = useRef(null)
  const [user, setUser] = React.useState<any>(null)
  const [workspace, setWorkspace] = React.useState<any>(null)

  React.useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          setWorkspace(data.workspace)
        }
      })
  }, [])

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' })
    if (res.ok) {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('onboarded')
      router.push('/')
    }
  }

  useLayoutEffect(() => {
    gsap.from(sidebarRef.current, {
      x: -20,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out'
    })
  }, [])

  return (
    <aside 
      ref={sidebarRef}
      className="sidebar fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-white/5 bg-[#0A0A0A] p-6 lg:flex z-50"
    >
      <div className="mb-10 px-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Workspace</span>
          <h2 className="text-lg font-bold text-white truncate">
            {workspace?.name || 'Waterflow'}
          </h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <nav className="space-y-1.5">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.05)]" // Active: White BG, Black Text
                    : "text-zinc-500 hover:bg-white/5 hover:text-white" // Inactive: Grey Text
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
            )
          })}
        </nav>

        <div className="space-y-1 border-t border-white/5 pt-6">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings size={18} />
            Settings
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400/80 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>

          <div className="mt-8 flex items-center gap-3 border-t border-white/5 pt-6 px-4">
            <div className="size-10 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">{user?.name || 'User'}</span>
              <span className="text-[10px] text-zinc-500 truncate">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Button at bottom */}
      <div className="mt-auto pt-6">
        <Button className="w-full gap-2 rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 py-6">
            <Plus size={18} />
            <span className="text-xs font-black uppercase tracking-widest">New Project</span>
        </Button>
      </div>
    </aside>
  )
}