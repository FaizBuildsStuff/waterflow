'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Zap, Shield, Loader2, Sparkles, AlertCircle, ArrowRight, CreditCard } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Pricing from '@/components/pricing-3'
import { cn } from '@/lib/utils'

export default function BillingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary size-8" />
    </div>
  )

  const isTrialing = user?.subscriptionStatus === 'trialing'
  const isFree = user?.subscriptionTier === 'free'
  const trialEnds = user?.trialEndsAt ? new Date(user.trialEndsAt) : null
  const trialExpired = trialEnds && trialEnds < new Date()

  return (
    <div className="flex-1 p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <CreditCard size={12} className="animate-pulse" /> Billing Verified
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white/95 leading-[0.9]">
            Plan & Billing<span className="text-primary">.</span>
        </h1>
        <p className="text-zinc-500 text-lg font-medium max-w-xl">
             Manage your project capacity, subscriptions, and payment methods.
        </p>
      </div>

      {/* Current Plan Summary (Prominent & Centered) */}
      <div className="max-w-xl">
        <Card className="p-8 bg-white/5 border-white/5 space-y-6 relative overflow-hidden group hover:border-primary/20 transition-all duration-500 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={120} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subscription Status</span>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-white capitalize">{user?.subscriptionTier || 'Free'} Plan</h3>
              <Badge className={cn(
                "uppercase text-[9px] font-black",
                isTrialing ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                (user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'granted') ? "bg-green-500/10 text-green-500 border-green-500/20" :
                "bg-primary/10 text-primary border-primary/20"
              )}>
                {user?.subscriptionStatus || 'Inactive'}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-zinc-500">Project AI Usage</span>
              <span className="text-white">{user?.aiUsageCount || 0} / {isFree ? 5 : '∞'}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                style={{ width: `${Math.min(((user?.aiUsageCount || 0) / (isFree ? 5 : 100)) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg transition-all active:scale-95"
              onClick={() => window.open('https://polar.sh/dashboard/subscriptions', '_blank')}
            >
              Manage Subscription
              <ArrowRight size={14} />
            </Button>
          </div>

          {isTrialing && !trialExpired && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
              <Zap size={14} />
              Trial ends in: {trialEnds?.toLocaleDateString()}
            </div>
          )}

          {trialExpired && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest text-red-500">
              <AlertCircle size={14} />
              Trial Expired: Please upgrade your plan to continue using all features.
            </div>
          )}
        </Card>
      </div>

      <Separator className="bg-white/5" />

      {/* Pricing Table Component */}
      <div className="rounded-3xl border border-white/5 bg-[#0D0D0D]/50 backdrop-blur-xl overflow-hidden shadow-2xl">
        <Pricing />
      </div>
    </div>
  )
}
