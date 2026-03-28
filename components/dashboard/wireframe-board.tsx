'use client'

import React, { useState } from 'react'
import { 
  Square, 
  Type, 
  Image as ImageIcon, 
  MousePointer2, 
  Plus, 
  Zap,
  Layers,
  Search,
  MessageSquare,
  ChevronRight,
  Maximize2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface WireframeElement {
  id: string
  type: 'box' | 'text' | 'image' | 'button'
  x: number
  y: number
  w: number
  h: number
  label?: string
}

export const WireframeBoard = ({ projectId }: { projectId: number }) => {
  const [elements, setElements] = useState<WireframeElement[]>([
    { id: '1', type: 'box', x: 100, y: 100, w: 600, h: 400, label: 'Hero Section' },
    { id: '2', type: 'text', x: 150, y: 150, w: 300, h: 40, label: 'Main Title Goes Here' },
    { id: '3', type: 'button', x: 150, y: 220, w: 120, h: 40, label: 'Get Started' },
    { id: '4', type: 'image', x: 480, y: 150, w: 180, h: 180, label: 'Feature Image' },
  ])

  const [isGenerating, setIsGenerating] = useState(false)

  const handleAiGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation delay
    setTimeout(() => {
      setElements([
        ...elements,
        { id: Date.now().toString(), type: 'box', x: 100, y: 520, w: 600, h: 300, label: 'Features Grid' },
        { id: (Date.now() + 1).toString(), type: 'box', x: 120, y: 560, w: 180, h: 200, label: 'Feature 1' },
        { id: (Date.now() + 2).toString(), type: 'box', x: 310, y: 560, w: 180, h: 200, label: 'Feature 2' },
        { id: (Date.now() + 3).toString(), type: 'box', x: 500, y: 560, w: 180, h: 200, label: 'Feature 3' },
      ])
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="h-full w-full flex bg-[#050505] overflow-hidden">
      {/* Sidebar - Tools */}
      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-6 bg-[#080808]">
        <Button variant="ghost" size="icon" className="size-12 rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5">
          <MousePointer2 size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="size-12 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5">
          <Square size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="size-12 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5">
          <Type size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="size-12 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5">
          <ImageIcon size={20} />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="size-12 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5">
          <Layers size={20} />
        </Button>
      </aside>

      {/* Canvas Area */}
      <main className="flex-1 relative overflow-auto bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="absolute top-8 left-8 flex items-center gap-4 z-20">
          <div className="bg-[#0D0D0D] border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Board:</span>
            <span className="text-xs font-bold text-white">Homepage Wireframe v1</span>
          </div>
          <Button 
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className="bg-linear-to-br from-primary to-blue-600 text-white gap-2 h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20"
          >
            {isGenerating ? <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Zap size={14} fill="currentColor" />}
            AI Auto-Layout
          </Button>
        </div>

        <div className="min-w-[1200px] min-h-[1200px] p-24">
          <div className="relative w-full h-full">
            {elements.map((el) => (
              <div
                key={el.id}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.w,
                  height: el.h,
                }}
                className={cn(
                  "absolute border-2 transition-all group cursor-move hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/20",
                  el.type === 'box' ? "bg-white/5 border-zinc-800 rounded-3xl" : "",
                  el.type === 'text' ? "border-transparent border-dashed hover:border-zinc-800" : "",
                  el.type === 'button' ? "bg-primary/20 border-primary/40 rounded-xl" : "",
                  el.type === 'image' ? "bg-white/5 border-zinc-800 rounded-2xl flex items-center justify-center" : ""
                )}
              >
                {el.type === 'image' && <ImageIcon size={32} className="text-zinc-800" />}
                <div className="absolute top-2 left-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {el.label}
                </div>
                {el.type === 'text' && (
                  <div className="p-4 text-xl font-black text-white italic">{el.label}</div>
                )}
                {el.type === 'button' && (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-primary">
                    {el.label}
                  </div>
                )}
                {el.type === 'box' && (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-zinc-800 border-2 border-zinc-800/10 rounded-2xl m-2">
                    {el.label} Section
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Layers & Inspector */}
      <aside className="w-80 border-l border-white/5 bg-[#080808] p-8 space-y-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Elements pipeline</h3>
          <div className="space-y-2">
            {elements.map((el) => (
              <div key={el.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-primary">
                    {el.type === 'box' && <Square size={14} />}
                    {el.type === 'text' && <Type size={14} />}
                    {el.type === 'button' && <Maximize2 size={14} />}
                  </div>
                  <span className="text-xs font-bold text-zinc-300">{el.label}</span>
                </div>
                <Badge className="bg-white/5 text-[8px] font-black uppercase border-none">{el.type}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Team feedback</h3>
            <span className="text-[10px] font-bold text-zinc-800">2 Active</span>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="size-6 rounded-full bg-primary flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white">Design Lead</p>
                <p className="text-[10px] text-zinc-500 bg-white/5 p-3 rounded-xl rounded-tl-none">Should we add a pricing section here?</p>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <textarea 
                placeholder="Add comment..." 
                className="flex-1 bg-white/5 border border-white/5 rounded-xl p-3 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-primary/40 h-20 resize-none"
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
