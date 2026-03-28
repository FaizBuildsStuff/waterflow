'use client'

import React, { useEffect, useState } from 'react'
import { 
  User, 
  Settings as SettingsIcon, 
  Lock, 
  Bell, 
  Palette, 
  Globe, 
  Rocket,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  Camera,
  Loader2,
  Zap
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user)
        setLoading(false)
      })
  }, [])

  const TABS = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Rocket },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050505]">
      <header className="h-24 flex items-center justify-between px-8 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-3xl sticky top-0 z-20">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white tracking-widest uppercase italic">Console settings</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Architect your workspace environment</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <aside className="w-80 border-r border-white/5 p-8 space-y-8 bg-[#080808]">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center justify-between w-full group rounded-2xl px-5 py-4 text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-black shadow-2xl shadow-white/5" 
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <tab.icon size={18} className={cn("transition-colors", activeTab === tab.id ? "text-black" : "text-zinc-600 group-hover:text-white")} />
                  {tab.label}
                </div>
                {activeTab === tab.id && <ChevronRight size={14} />}
              </button>
            ))}
          </nav>

          <Separator className="bg-white/5" />
          
          <div className="bg-linear-to-br from-primary/20 to-blue-600/20 rounded-3xl p-6 border border-primary/20 space-y-4">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-white">Agency Pro Plan</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">Unlock unlimited projects, AI collaborators, and advanced timeline views.</p>
            <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl font-black text-[10px] h-10 uppercase tracking-widest">Upgrade Now</Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#050505]">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto p-12 space-y-12">
              {activeTab === 'profile' && (
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500">Identity Structure</h2>
                    <div className="flex items-center gap-8">
                      <div className="relative group">
                        <div className="size-24 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-primary/20">
                          {user?.name?.[0] || user?.email?.[0] || 'U'}
                        </div>
                        <button className="absolute -bottom-1 -right-1 size-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg border-4 border-[#050505] transition-transform hover:scale-110">
                          <Camera size={14} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white italic">{user?.name || 'Anonymous User'}</h3>
                        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{user?.email}</p>
                        <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3">Role: Administrator</Badge>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Full Name</Label>
                        <Input 
                          defaultValue={user?.name}
                          className="bg-white/5 border-white/5 rounded-2xl h-14 text-sm font-medium focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Email Address</Label>
                        <Input 
                          defaultValue={user?.email}
                          disabled
                          className="bg-white/5 border-white/5 rounded-2xl h-14 text-sm font-medium opacity-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Professional Bio</Label>
                      <textarea 
                        placeholder="Tell us about your agency role..."
                        className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/40 h-32 resize-none transition-all font-medium"
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button variant="ghost" className="text-zinc-500 hover:text-white rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
                      <Button className="bg-white text-black hover:bg-zinc-200 rounded-xl px-12 h-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-white/5">Update Core</Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="h-96 flex flex-col items-center justify-center gap-6 border-2 border-dashed border-white/5 rounded-[40px] opacity-40">
                  <CreditCard size={48} className="text-zinc-600" />
                  <p className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Billing infrastructure loading...</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}
