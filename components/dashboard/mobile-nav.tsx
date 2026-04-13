'use client'

import React, { useState } from 'react'
import { 
  Menu, 
  Search, 
  Bell, 
  X,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { SidebarContent } from './sidebar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl z-50 flex items-center justify-between px-4 lg:hidden">
      <div className="flex items-center gap-3">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-10 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-[#0A0A0A] border-r border-white/5 p-6 text-white overflow-hidden flex flex-col">
            <SheetHeader className="pb-8 border-b border-white/5 mb-6">
              <SheetTitle className="flex items-center gap-2 text-white">
                <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white p-1.5 shadow-lg shadow-indigo-500/10">
                  <Sparkles size={18} strokeWidth={2.5} />
                </div>
                <span className="font-bold tracking-tight">Anthryve</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <SidebarContent onItemClick={() => setIsOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white lg:hidden p-1 shadow-lg shadow-indigo-500/10">
                <Sparkles size={14} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm tracking-tight text-white lg:hidden">Anthryve</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-9 text-zinc-500 hover:text-white rounded-lg">
          <Search size={18} />
        </Button>
        <button className="relative size-9 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-[#0A0A0A]" />
        </button>
      </div>
    </header>
  )
}
