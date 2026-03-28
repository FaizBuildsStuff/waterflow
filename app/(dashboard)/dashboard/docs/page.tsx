'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Search, 
  Plus, 
  ChevronRight, 
  Globe, 
  Lock,
  Calendar,
  MoreHorizontal,
  Folder
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DocsPage() {
  const router = useRouter()
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocs()
  }, [])

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/docs')
      const data = await res.json()
      if (data.docs) setDocs(data.docs)
    } catch (err) {
      console.error('Fetch docs error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 min-h-screen bg-[#0A0A0A] p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Knowledge Base</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage project documentation and AI strategic reports.</p>
        </div>
        
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-white transition-colors" />
          <input 
            placeholder="Search documents..." 
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
          />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[32px]" />
          ))}
        </div>
      ) : docs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <Link 
              key={doc.id} 
              href={`/dashboard/docs/${doc.id}`}
              className="group h-full"
            >
              <Card className="h-full bg-[#0D0D0D] border-white/5 p-6 rounded-[32px] hover:border-primary/50 transition-all hover:scale-[1.02] duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <FileText size={20} />
                    </div>
                    {doc.is_public ? (
                      <Badge className="bg-green-500/10 text-green-500 border-none text-[8px] font-black uppercase tracking-widest px-2 py-1">
                        <Globe size={10} className="mr-1" /> Public
                      </Badge>
                    ) : (
                      <Badge className="bg-zinc-500/10 text-zinc-500 border-none text-[8px] font-black uppercase tracking-widest px-2 py-1">
                        <Lock size={10} className="mr-1" /> Private
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{doc.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">
                    <Folder size={12} className="text-primary" />
                    <span>{doc.project_name}</span>
                  </div>
                  
                  <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed">
                    {doc.content.substring(0, 150)}...
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-medium">
                    <Calendar size={12} />
                    <span>{new Date(doc.updated_at).toLocaleDateString()}</span>
                  </div>
                  <ChevronRight size={16} className="text-zinc-600 group-hover:text-primary transition-all group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="bg-[#0D0D0D] border-white/5 border-dashed border-2 p-12 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6">
          <div className="size-20 rounded-full bg-white/5 flex items-center justify-center text-zinc-600">
            <FileText size={40} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">No documents found</h2>
            <p className="text-zinc-500 max-w-sm">Go to a project dashboard and click "Full Doc" to generate strategic documentation using AI.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5" asChild>
            <Link href="/dashboard">View Projects</Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
