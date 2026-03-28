'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  FileText, 
  Share2, 
  Save, 
  ArrowLeft, 
  Globe, 
  Lock,
  Loader2,
  Check,
  MoreVertical,
  Trash2,
  Maximize2,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import gsap from 'gsap'

export default function DocEditorPage() {
  const { id } = useParams()
  const router = useRouter()
  const [doc, setDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetchDoc()
  }, [id])

  const fetchDoc = async () => {
    try {
      const res = await fetch(`/api/docs/${id}`)
      const data = await res.json()
      if (data.doc) {
        setDoc(data.doc)
        setTitle(data.doc.title)
        setContent(data.doc.content)
        setIsPublic(data.doc.is_public)
      }
    } catch (err) {
      console.error('Fetch doc error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/docs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, is_public: isPublic })
      })
      if (res.ok) {
        setShowSaved(true)
        setTimeout(() => setShowSaved(false), 2000)
      }
    } catch (err) {
      console.error('Save doc error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/docs/${doc.slug}`
    navigator.clipboard.writeText(url)
    alert('Public link copied to clipboard!')
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-[#0A0A0A]">
      <Loader2 className="animate-spin text-primary size-8" />
    </div>
  )

  if (!doc) return (
    <div className="flex-1 flex items-center justify-center bg-[#0A0A0A] text-white">
      Doc not found.
    </div>
  )

  return (
    <div className="flex-1 min-h-screen bg-[#0A0A0A] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#0D0D0D]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/dashboard/docs')}
            className="text-zinc-500 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <FileText size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{doc.project_name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5">
            <button 
              onClick={() => setIsPublic(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                !isPublic ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Lock size={12} /> Private
            </button>
            <button 
              onClick={() => setIsPublic(true)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                isPublic ? "bg-green-500 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Globe size={12} /> Public
            </button>
          </div>

          <Separator orientation="vertical" className="h-6 bg-white/5" />

          {isPublic && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest h-9"
            >
              <Share2 size={14} className="mr-2" /> Share
            </Button>
          )}

          <Button 
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-white text-black hover:bg-zinc-200 text-[10px] font-bold uppercase tracking-widest h-9 px-6"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : showSaved ? <Check size={14} /> : "Save"}
          </Button>
        </div>
      </header>

      {/* Editor Main */}
      <main className="flex-1 overflow-auto bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto py-20 px-8 space-y-12">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-5xl font-black text-white outline-none placeholder:text-zinc-800 tracking-tight"
            placeholder="Document Title"
          />

          <div className="relative group">
            <textarea 
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[600px] bg-transparent text-zinc-300 text-lg leading-relaxed outline-none resize-none placeholder:text-zinc-800 font-medium"
              placeholder="Start writing or let AI architect your strategy..."
            />
          </div>
        </div>
      </main>

      {/* Floating Toolbar (Optional but cool) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl shadow-2xl flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-10 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5">
          <Maximize2 size={18} />
        </Button>
        <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-xl text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 hover:bg-primary/20"
          onClick={() => alert('AI Assistant placeholder')}
        >
          AI Rewrite
        </Button>
        <Button variant="ghost" size="icon" className="size-10 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 ml-auto">
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  )
}
