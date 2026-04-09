'use client'

import React, { useEffect, useState } from 'react'
import { 
  Users, 
  Mail, 
  UserPlus, 
  Shield, 
  ChevronRight,
  MoreHorizontal,
  Loader2,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  project_name: string
  joined_at: string
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await fetch('/api/team')
        const data = await res.json()
        if (data.members) setMembers(data.members)
        if (data.invitations) setInvitations(data.invitations)
      } catch (err) {
        console.error('Fetch team error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeamData()
  }, [])

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050505]">
      <header className="px-8 pt-12 pb-8 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-3xl sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Users size={12} className="animate-pulse" /> Team Active
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white/95 leading-[0.9]">
              Team Members<span className="text-primary">.</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium max-w-xl">
               Manage your team, collaborate on projects, and invite new members to your workspace.
            </p>
          </div>
          <Button className="bg-white text-black hover:bg-zinc-200 gap-3 h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-white/5 transition-all active:scale-95 group">
            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
            Invite Member
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-8 space-y-12 max-w-7xl mx-auto">
          {/* Active Members Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Active Members</h2>
              <Badge variant="outline" className="bg-primary/5 border-primary/10 text-primary text-[10px] px-3 font-black">
                {members.length} Members
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, idx) => (
                <Card key={idx} className="bg-[#0D0D0D] border-white/5 p-6 rounded-3xl group hover:border-primary/40 hover:bg-[#111111] transition-all shadow-xl shadow-black/20">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                      <Avatar className="size-14 border-2 border-primary/20 p-1 bg-primary/5">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`} />
                        <AvatarFallback className="bg-zinc-800 text-xs">U</AvatarFallback>
                      </Avatar>
                      <Badge className="bg-white text-black text-[9px] font-black uppercase tracking-widest border-none px-2.5 py-1">
                        {member.role}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{member.name || 'Anonymous User'}</h3>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Mail size={12} />
                        <span className="text-xs font-medium">{member.email}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Working On</p>
                        <p className="text-xs font-bold text-zinc-400 italic">{member.project_name}</p>
                      </div>
                      <button className="text-zinc-600 hover:text-white transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
              {loading && (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-[240px] rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                ))
              )}
            </div>

            {!loading && members.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                <Users size={48} className="text-zinc-600" />
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">No active collaborators found</p>
              </div>
            )}
          </section>

          {/* Pending Invitations section could go here */}
        </div>
      </ScrollArea>
    </div>
  )
}
