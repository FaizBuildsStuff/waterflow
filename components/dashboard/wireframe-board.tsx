'use client'

import React, { useState, useEffect } from 'react'
import {
  Square,
  Type,
  Image as ImageIcon,
  MousePointer2,
  Plus,
  Trash2,
  Layers,
  Search,
  Shield,
  Maximize2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'

interface WireframeElement {
  id: string
  type: 'box' | 'text' | 'image' | 'button'
  x: number
  y: number
  w: number
  h: number
  label?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'muted'
  theme?: 'glass' | 'solid' | 'gradient' | 'none'
  color?: 'brand' | 'accent' | 'success' | 'white' | 'zinc'
}

interface WireframeLog {
  id: number
  user_name: string
  user_avatar: string
  action: string
  details: string
  created_at: string
}

export const WireframeBoard = ({ projectId, user }: { projectId: number; user?: any }) => {
  const params = useParams()
  const slug = params.slug as string

  const [elements, setElements] = useState<WireframeElement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sideTab, setSideTab] = useState<'layers' | 'inspector' | 'logs'>('layers')
  const [logs, setLogs] = useState<WireframeLog[]>([])
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced')

  // Interaction states
  const [activeId, setActiveId] = useState<string | null>(null)
  const [interactionMode, setInteractionMode] = useState<'dragging' | 'resizing' | null>(null)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [initialDim, setInitialDim] = useState({ x: 0, y: 0, w: 0, h: 0 })

  const fetchBoard = async (silent = false) => {
    const id = slug || projectId
    if (!id) {
      console.warn('WireframeBoard: Missing project identity')
      return
    }

    if (!silent) setSyncStatus('syncing')
    try {
      const res = await fetch(`/api/projects/${id}/wireframe`)
      const data = await res.json()
      if (res.ok && Array.isArray(data.elements)) {
        setElements(data.elements)
        setSyncStatus('synced')
      } else {
        setSyncStatus('error')
      }
    } catch (err) {
      console.error('Fetch board error:', err)
      setSyncStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/projects/${slug || projectId}/wireframe/logs`)
      const data = await res.json()
      if (res.ok && Array.isArray(data.logs)) {
        setLogs(data.logs)
      } else {
        setLogs([])
      }
    } catch (err) {
      console.error('Fetch logs error:', err)
      setLogs([])
    }
  }

  useEffect(() => {
    fetchBoard()
    fetchLogs()
    
    // Real-time Collaboration Polling (every 5 seconds)
    const interval = setInterval(() => {
      if (!interactionMode) {
        fetchBoard(true)
        fetchLogs()
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [slug, projectId, interactionMode])

  const saveBoard = async (updatedElements: WireframeElement[], action?: string, details?: string) => {
    setSyncStatus('syncing')
    try {
      await fetch(`/api/projects/${slug || projectId}/wireframe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements: updatedElements, action, details })
      })
      setSyncStatus('synced')
      if (action) fetchLogs()
    } catch (err) {
      console.error('Save board error:', err)
      setSyncStatus('error')
    }
  }

  const handleInteractionStart = (e: React.MouseEvent, id: string, mode: 'dragging' | 'resizing') => {
    e.stopPropagation()
    const el = elements.find(item => item.id === id)
    if (!el) return

    setActiveId(id)
    setSelectedId(id)
    setInteractionMode(mode)
    setStartPoint({ x: e.clientX, y: e.clientY })
    setInitialDim({ x: el.x, y: el.y, w: el.w, h: el.h })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeId || !interactionMode) return

    const dx = e.clientX - startPoint.x
    const dy = e.clientY - startPoint.y

    setElements(prev => prev.map(el => {
      if (el.id === activeId) {
        if (interactionMode === 'dragging') {
          return { ...el, x: initialDim.x + dx, y: initialDim.y + dy }
        } else if (interactionMode === 'resizing') {
          return { ...el, w: Math.max(20, initialDim.w + dx), h: Math.max(20, initialDim.h + dy) }
        }
      }
      return el
    }))
  }

  const handleInteractionEnd = () => {
    if (!activeId) return
    const el = elements.find(item => item.id === activeId)
    saveBoard(elements, interactionMode === 'dragging' ? 'Move' : 'Resize', `${interactionMode === 'dragging' ? 'Moved' : 'Resized'} ${el?.label || el?.type}`)
    setActiveId(null)
    setInteractionMode(null)
  }

  const addElement = (type: WireframeElement['type']) => {
    const newEl: WireframeElement = {
      id: Date.now().toString(),
      type,
      x: 100,
      y: 100,
      w: type === 'text' ? 200 : 150,
      h: type === 'text' ? 40 : 100,
      label: `New ${type}`,
    }
    const updated = [...elements, newEl]
    setElements(updated)
    setSelectedId(newEl.id)
    saveBoard(updated, 'Add', `Added new ${type}`)
  }

  const updateElement = (id: string, updates: Partial<WireframeElement>) => {
    const updated = elements.map(el => el.id === id ? { ...el, ...updates } : el)
    setElements(updated)
  }

  const deleteElement = (id: string) => {
    const el = elements.find(item => item.id === id)
    const updated = elements.filter(item => item.id !== id)
    setElements(updated)
    setSelectedId(null)
    saveBoard(updated, 'Delete', `Removed ${el?.label || el?.type}`)
  }

  const clearBoard = () => {
    if (confirm('Clear the entire board? All design progress will be lost.')) {
      setElements([])
      saveBoard([], 'Clear', 'Cleared the entire board')
    }
  }

  const selectedEl = elements.find(el => el.id === selectedId)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050505]">
        <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full w-full flex bg-[#050505] overflow-hidden">
      {/* Sidebar - Tools */}
      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-6 bg-[#080808] z-30">
        <Button variant="ghost" size="icon" className="size-12 rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 transition-all active:scale-95">
          <MousePointer2 size={20} />
        </Button>
        <Button onClick={() => addElement('box')} title="Add Box" variant="ghost" size="icon" className="size-12 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5 transition-all hover:scale-110">
          <Square size={20} />
        </Button>
        <Button onClick={() => addElement('text')} title="Add Text" variant="ghost" size="icon" className="size-12 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5 transition-all hover:scale-110">
          <Type size={20} />
        </Button>
        <Button onClick={() => addElement('image')} title="Add Image" variant="ghost" size="icon" className="size-12 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5 transition-all hover:scale-110">
          <ImageIcon size={20} />
        </Button>
        <Button onClick={() => addElement('button')} title="Add Button" variant="ghost" size="icon" className="size-12 rounded-2xl text-zinc-600 hover:text-white hover:bg-white/5 transition-all hover:scale-110">
          <Maximize2 size={20} />
        </Button>
        <div className="flex-1" />
        <Button
          onClick={clearBoard}
          title="Clear Board"
          variant="ghost"
          size="icon"
          className="size-12 rounded-2xl text-zinc-600 hover:text-destructive hover:bg-destructive/10 transition-all hover:scale-110 mb-8"
        >
          <Trash2 size={20} />
        </Button>
      </aside>

      {/* Canvas Area */}
      <main
        onMouseMove={handleMouseMove}
        onMouseUp={handleInteractionEnd}
        onClick={() => setSelectedId(null)}
        className="flex-1 relative overflow-auto bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-size-[24px_24px] cursor-crosshair selection:bg-none scrollbar-hide"
      >
        <div className="min-w-[2000px] min-h-[2000px] p-48 relative">
          {elements.map((el) => (
            <div
              key={el.id}
              onMouseDown={(e) => handleInteractionStart(e, el.id, 'dragging')}
              onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
              style={{
                left: el.x,
                top: el.y,
                width: el.w,
                height: el.h,
              }}
              className={cn(
                "absolute border-2 transition-all group/item cursor-move overflow-hidden",
                selectedId === el.id ? "ring-2 ring-primary border-primary z-50 shadow-2xl shadow-primary/20" : "border-zinc-800/40 z-10",
                
                // Box Styles
                el.type === 'box' && cn(
                  el.theme === 'glass' && "bg-white/3 backdrop-blur-xl border-white/10 shadow-2xl",
                  el.theme === 'solid' && "bg-zinc-900 border-zinc-800",
                  el.theme === 'gradient' && "bg-linear-to-br from-primary/10 to-blue-600/10 border-primary/20",
                  !el.theme && "bg-white/5 rounded-3xl"
                ),
                el.type === 'box' && "rounded-3xl",

                // Button Styles
                el.type === 'button' && cn(
                  el.variant === 'primary' && "bg-primary text-white border-transparent shadow-lg shadow-primary/20",
                  el.variant === 'outline' && "bg-transparent border-primary/40 text-primary",
                  el.variant === 'ghost' && "bg-white/5 border-transparent text-zinc-400",
                  !el.variant && "bg-primary/5 border-primary/20"
                ),
                el.type === 'button' && "rounded-xl",

                // Text/Image base
                el.type === 'text' && "border-transparent hover:border-zinc-800/40",
                el.type === 'image' && "bg-white/5 border-zinc-800 rounded-2xl flex items-center justify-center p-8"
              )}
            >
              {el.type === 'image' && (
                <div className="text-center space-y-2 opacity-20 group-hover/item:opacity-40 transition-opacity">
                  <ImageIcon size={32} className="mx-auto" />
                  <p className="text-[8px] font-black uppercase tracking-widest">{el.label}</p>
                </div>
              )}
              
              <div className={cn(
                "absolute -top-6 left-0 text-[8px] font-black uppercase tracking-[0.2em] transition-opacity",
                selectedId === el.id ? "text-primary opacity-100" : "text-zinc-600 opacity-0 group-hover/item:opacity-100"
              )}>
                {el.label || el.type}
              </div>
              
              {el.type === 'text' && (
                <div className={cn(
                  "p-4 italic truncate h-full flex items-center leading-tight",
                  el.variant === 'primary' ? "text-4xl font-black text-white" : 
                  el.variant === 'muted' ? "text-sm font-bold text-zinc-500 uppercase tracking-widest" :
                  "text-xl font-bold text-zinc-200"
                )}>
                  {el.label}
                </div>
              )}

              {el.type === 'button' && (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest px-4 text-center">
                  {el.label}
                </div>
              )}

              {el.type === 'box' && el.theme === 'glass' && (
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-linear-to-br from-white/10 to-transparent" />
              )}

              {/* Selection Handles & Resize Trigger */}
              {selectedId === el.id && (
                <>
                  <div className="absolute -top-1.5 -left-1.5 size-3 bg-white border-2 border-primary rounded-full z-10" />
                  <div className="absolute -top-1.5 -right-1.5 size-3 bg-white border-2 border-primary rounded-full z-10" />
                  <div className="absolute -bottom-1.5 -left-1.5 size-3 bg-white border-2 border-primary rounded-full z-10" />
                  <div
                    onMouseDown={(e) => handleInteractionStart(e, el.id, 'resizing')}
                    className="absolute -bottom-2 -right-2 size-5 bg-primary border-4 border-[#050505] rounded-full cursor-nwse-resize z-20 shadow-lg shadow-primary/40 hover:scale-125 transition-transform"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-white/5 bg-[#080808] flex flex-col z-30">
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setSideTab('layers')}
            className={cn("flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all text-center", sideTab === 'layers' ? "text-white bg-white/5 border-b-2 border-primary" : "text-zinc-600 hover:text-zinc-400")}
          >
            Layers
          </button>
          <button
            onClick={() => setSideTab('inspector')}
            className={cn("flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all text-center", sideTab === 'inspector' ? "text-white bg-white/5 border-b-2 border-primary" : "text-zinc-600 hover:text-zinc-400")}
          >
            Inspector
          </button>
          <button
            onClick={() => setSideTab('logs')}
            className={cn("flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all text-center", sideTab === 'logs' ? "text-white bg-white/5 border-b-2 border-primary" : "text-zinc-600 hover:text-zinc-400")}
          >
            History
          </button>
        </div>

        <ScrollArea className="flex-1 p-6">
          {sideTab === 'layers' && (
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Pipeline</h3>
              <div className="space-y-2">
                {elements.map((el) => (
                  <div
                    key={el.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all group cursor-pointer",
                      selectedId === el.id ? "bg-primary/10 border-primary/20" : "bg-white/5 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-primary">
                        {el.type === 'box' && <Square size={14} />}
                        {el.type === 'text' && <Type size={14} />}
                        {el.type === 'button' && <Maximize2 size={14} />}
                        {el.type === 'image' && <ImageIcon size={14} />}
                      </div>
                      <span className="text-xs font-bold text-zinc-300 truncate max-w-[140px]">{el.label || el.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sideTab === 'inspector' && selectedEl && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Appearance</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase">Label</label>
                    <input
                      value={selectedEl.label || ''}
                      onChange={(e) => updateElement(selectedEl.id, { label: e.target.value })}
                      onBlur={() => saveBoard(elements, 'Edit', `Renamed element to ${selectedEl.label}`)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase">Width</label>
                      <input
                        type="number"
                        value={selectedEl.w}
                        onChange={(e) => updateElement(selectedEl.id, { w: parseInt(e.target.value) })}
                        onBlur={() => saveBoard(elements, 'Edit', `Resized ${selectedEl.label}`)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase">Height</label>
                      <input
                        type="number"
                        value={selectedEl.h}
                        onChange={(e) => updateElement(selectedEl.id, { h: parseInt(e.target.value) })}
                        onBlur={() => saveBoard(elements, 'Edit', `Resized ${selectedEl.label}`)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <Button
                  onClick={() => deleteElement(selectedEl.id)}
                  variant="destructive"
                  className="w-full h-10 rounded-xl font-black uppercase tracking-widest text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete Element
                </Button>
              </div>
            </div>
          )}

          {sideTab === 'inspector' && !selectedEl && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="size-16 rounded-3xl bg-white/5 flex items-center justify-center text-zinc-800">
                <MousePointer2 size={32} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Select an element<br />to inspect</p>
            </div>
          )}

          {sideTab === 'logs' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Edit History</h3>
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3 group">
                    <div className="size-8 rounded-full bg-white/5 border border-white/5 overflow-hidden ring-1 ring-white/10 shrink-0">
                      <img src={log.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${log.user_name}`} alt={log.user_name} />
                    </div>
                    <div className="space-y-1 pt-1 min-w-0">
                      <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">{log.user_name}</p>
                      <p className="text-[10px] text-zinc-500">
                        <span className="text-primary font-bold">{log.action}:</span> {log.details}
                      </p>
                      <p className="text-[8px] text-zinc-600 font-mono italic">{format(new Date(log.created_at), 'HH:mm:ss')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Sync Status Overlay */}
      <div className="absolute bottom-8 right-[340px] z-50">
        <div className={cn(
          "px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-500 shadow-2xl backdrop-blur-md",
          syncStatus === 'synced' ? "bg-zinc-900/80 border-white/5 text-zinc-500" :
          syncStatus === 'syncing' ? "bg-primary/20 border-primary/20 text-primary animate-pulse" :
          "bg-destructive/20 border-destructive/20 text-destructive"
        )}>
          <div className={cn(
            "size-1.5 rounded-full",
            syncStatus === 'synced' ? "bg-zinc-700" :
            syncStatus === 'syncing' ? "bg-primary animate-pulse" :
            "bg-destructive"
          )} />
          <span className="text-[9px] font-mono uppercase tracking-widest font-black">
            {syncStatus === 'synced' ? 'System_Synced' :
             syncStatus === 'syncing' ? 'Syncing_Core...' :
             'Sync_Error_Retry'}
          </span>
        </div>
      </div>
    </div>
  )
}
