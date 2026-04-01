'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Zap, Shield, Loader2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react'
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
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Strategic Billing</h1>
        <p className="text-zinc-500 font-medium">Manage your cognitive capacity and workspace tier.</p>
      </div>

      {/* Current Plan Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-8 bg-white/5 border-white/5 space-y-6 relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={120} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Current Plan</span>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-white capitalize">{user?.subscriptionTier} Tier</h3>
              <Badge className={cn(
                "uppercase text-[9px] font-black",
                isTrialing ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
              )}>
                {user?.subscriptionStatus}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">AI Decompositions</span>
              <span className="text-white font-bold">{user?.aiUsageCount || 0} / {isFree ? 5 : '∞'}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${Math.min(((user?.aiUsageCount || 0) / (isFree ? 5 : 100)) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full bg-white/5 border-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
              onClick={() => window.open('https://polar.sh/dashboard/subscriptions', '_blank')}
            >
              Manage in Polar.sh
              <ArrowRight size={14} />
            </Button>
          </div>

          {isTrialing && (
            <div className={cn(
              "flex items-center gap-2 p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest",
              trialExpired ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-white/5 border-white/5 text-zinc-400"
            )}>
              <AlertCircle size={14} />
              {trialExpired ? "Trial Expired - Unlock Required" : `Trial ends ${trialEnds?.toLocaleDateString()}`}
            </div>
          )}
        </Card>

        <div className="md:col-span-2 flex flex-col justify-center space-y-4 px-4">
          <h4 className="text-xl font-bold text-white">Upgrade to unlock full potential</h4>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">
            The free tier is intended for testing cognitive flow. For active project management and high-volume AI strategy, choose a tier that matches your agency's velocity.
          </p>

          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              <Sparkles size={12} className="text-primary" />
              Developer Sandbox
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-primary/5 border-primary/10 text-primary hover:bg-primary/10 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                onClick={async () => {
                  const res = await fetch('/api/admin/test-upgrade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tier: 'pro' })
                  })
                  if (res.ok) window.location.reload()
                }}
              >
                Simulate Pro
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-500/5 border-blue-500/10 text-blue-500 hover:bg-blue-500/10 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                onClick={async () => {
                  const res = await fetch('/api/admin/test-upgrade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tier: 'neural' })
                  })
                  if (res.ok) window.location.reload()
                }}
              >
                Simulate Neural
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-600 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest"
                onClick={async () => {
                  const res = await fetch('/api/admin/test-upgrade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tier: 'free' })
                  })
                  if (res.ok) window.location.reload()
                }}
              >
                Reset to Free
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500/50 hover:text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                onClick={async () => {
                  const res = await fetch('/api/admin/test-upgrade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tier: 'expired_trial' })
                  })
                  if (res.ok) window.location.reload()
                }}
              >
                Simulate Expire
              </Button>
            </div>
            <p className="text-[9px] text-zinc-600 font-medium italic">
              * Since you are in testing mode, use these buttons to bypass Polar.sh and unlock features instantly.
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Pricing Table Component */}
      <div className="rounded-3xl border border-white/5 bg-[#0D0D0D]/50 backdrop-blur-xl overflow-hidden shadow-2xl">
        <Pricing />
      </div>
    </div>
  )
}
